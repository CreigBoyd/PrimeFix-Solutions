<?php
/**
 * Shared setup for every endpoint: error handling, security headers, CORS,
 * JSON helpers, input cleaning, rate limiting, and mail helpers.
 * Require this at the top of each endpoint file.
 */

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

// Never leak PHP errors to visitors; log them instead.
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Any uncaught problem becomes a clean JSON 500 (the frontend expects JSON).
set_exception_handler(function (Throwable $e): void {
    error_log('PrimeFix API fatal: ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json');
    }
    echo json_encode(['ok' => false, 'error' => 'Something went wrong on our end. Please call us instead.']);
    exit;
});

require __DIR__ . '/vendor/autoload.php';

$config = require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

// --- CORS: only for explicitly allowed origins (same-origin needs nothing) ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && $config['allowed_origins']) {
    if (in_array('*', $config['allowed_origins'], true)) {
        header('Access-Control-Allow-Origin: *');
    } elseif (in_array($origin, $config['allowed_origins'], true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------------------------------------------------------------------------
// Request / response helpers
// ---------------------------------------------------------------------------

function respond(bool $ok, array $extra = [], int $status = 200): void
{
    http_response_code($status);
    echo json_encode(array_merge(['ok' => $ok], $extra));
    exit;
}

function require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST, OPTIONS');
        respond(false, ['error' => 'Method not allowed.'], 405);
    }
}

function json_input(): array
{
    $raw = file_get_contents('php://input', false, null, 0, 65537);
    if ($raw === false || strlen($raw) > 65536) {
        respond(false, ['error' => 'Request too large.'], 413);
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/** Trim, strip control characters (blocks header injection), and cap length. */
function clean_text($value, int $max, bool $multiline = false): string
{
    $value = is_scalar($value) ? (string) $value : '';
    $pattern = $multiline ? '/[^\P{C}\n]+/u' : '/\p{C}+/u';
    $value = preg_replace($pattern, ' ', $value) ?? '';
    $value = trim($value);
    return mb_strlen($value) > $max ? mb_substr($value, 0, $max) : $value;
}

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// ---------------------------------------------------------------------------
// Storage + rate limiting
// ---------------------------------------------------------------------------

function storage_dir(): string
{
    $dir = __DIR__ . '/storage';
    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }
    return $dir;
}

function client_ip(): string
{
    global $config;
    if (!empty($config['trust_proxy']) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $first = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
        if (filter_var($first, FILTER_VALIDATE_IP)) {
            return $first;
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/**
 * Allow at most $max hits per $windowSec per visitor IP for a given bucket.
 * Fails open if the storage folder isn't writable (so real customers are never blocked by a hosting quirk).
 */
function rate_limit(string $bucket, int $max, int $windowSec): void
{
    $dir = storage_dir() . '/ratelimit';
    if (!is_dir($dir) && !@mkdir($dir, 0775, true)) {
        return;
    }

    // Opportunistic cleanup of stale counters (~1% of requests).
    if (random_int(1, 100) === 1) {
        foreach (glob($dir . '/*.json') ?: [] as $old) {
            if (@filemtime($old) < time() - 86400) {
                @unlink($old);
            }
        }
    }

    $file = $dir . '/' . preg_replace('/[^a-z0-9_-]/i', '', $bucket) . '-' . hash('sha256', client_ip()) . '.json';
    $fh = @fopen($file, 'c+');
    if (!$fh) {
        return;
    }

    $blocked = false;
    if (flock($fh, LOCK_EX)) {
        $hits = json_decode((string) stream_get_contents($fh), true);
        $hits = is_array($hits) ? $hits : [];
        $now = time();
        $hits = array_values(array_filter($hits, fn($t) => is_int($t) && $t > $now - $windowSec));

        if (count($hits) >= $max) {
            $blocked = true;
        } else {
            $hits[] = $now;
            ftruncate($fh, 0);
            rewind($fh);
            fwrite($fh, json_encode($hits));
            fflush($fh);
        }
        flock($fh, LOCK_UN);
    }
    fclose($fh);

    if ($blocked) {
        respond(false, ['error' => 'Too many requests from your connection. Please try again later, or call us directly.'], 429);
    }
}

// ---------------------------------------------------------------------------
// Mail helpers
// ---------------------------------------------------------------------------

function mail_is_configured(array $config): bool
{
    return $config['smtp_user'] !== '' && $config['smtp_pass'] !== '' && $config['notify_to_email'] !== '';
}

/** Fails fast (as JSON) when SMTP credentials haven't been provided. */
function require_mail_config(array $config): void
{
    if (!mail_is_configured($config)) {
        error_log('PrimeFix API: SMTP is not configured. Set SMTP_USER / SMTP_PASS / NOTIFY_TO_EMAIL (see server/.env.example).');
        respond(false, ['error' => 'Our messaging service is temporarily unavailable. Please call us instead.'], 503);
    }
}

/** Fresh, SMTP-configured PHPMailer instance (throws PHPMailer\Exception on error). */
function build_mailer(array $config): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->CharSet    = 'UTF-8';
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp_user'];
    $mail->Password   = $config['smtp_pass'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port       = $config['smtp_port'];
    $mail->Timeout    = 12;
    $mail->setFrom($config['from_email'], $config['from_name']);
    return $mail;
}

/** Embeds the logo (if present) and returns the <img> markup to put in the email body. */
function attach_logo(PHPMailer $mail): string
{
    $path = __DIR__ . '/PFS_email-logo.png';
    if (!is_file($path)) {
        return '';
    }
    $mail->addEmbeddedImage($path, 'primefix_logo', 'PFS_email-logo.png');
    return '<div style="margin-bottom:20px;"><img src="cid:primefix_logo" alt="PrimeFix Solutions" width="160" style="display:block;border:0;max-width:160px;height:auto;" /></div>';
}

function email_shell(string $logoHtml, string $inner): string
{
    return '<div style="font-family:Arial,Helvetica,sans-serif;color:#0E2A38;max-width:520px;line-height:1.5;">'
        . $logoHtml . $inner . '</div>';
}

function tel_digits(string $phone): string
{
    return preg_replace('/\D+/', '', $phone) ?? '';
}
