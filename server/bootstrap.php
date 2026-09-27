<?php
/**
 * Shared setup for every endpoint in this folder: CORS headers, JSON
 * request/response helpers, and config loading. Require this at the top
 * of each endpoint file.
 */

require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

$config = file_exists(__DIR__ . '/config.php')
    ? require __DIR__ . '/config.php'
    : require __DIR__ . '/config.example.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . $config['allowed_origin']);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight requests end here.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function respond(bool $ok, array $extra = [], int $status = 200): void
{
    http_response_code($status);
    echo json_encode(array_merge(['ok' => $ok], $extra));
    exit;
}

function require_post(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        respond(false, ['error' => 'Method not allowed.'], 405);
    }
}

/**
 * Returns a fresh, SMTP-configured PHPMailer instance. Fresh per email —
 * simpler and safer than reusing one instance and calling clearAddresses()
 * between sends.
 */
function build_mailer(array $config): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp_user'];
    $mail->Password   = $config['smtp_pass'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port       = $config['smtp_port'];
    $mail->setFrom($config['from_email'], $config['from_name']);
    return $mail;
}
