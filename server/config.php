<?php
/**
 * Server configuration. This file contains NO secrets and is safe to commit.
 *
 * Values come from real environment variables (recommended on production
 * hosts) or from a server/.env file (convenient for local development and
 * shared hosting). See server/.env.example.
 *
 * NEVER hardcode an SMTP password in this file.
 */

// --- Minimal .env loader (does not override real environment variables) ---
(function () {
    $file = __DIR__ . '/.env';
    if (!is_readable($file)) {
        return;
    }
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) {
            continue;
        }
        [$key, $value] = array_map('trim', explode('=', $line, 2));
        if (strlen($value) >= 2 && ($value[0] === '"' || $value[0] === "'") && substr($value, -1) === $value[0]) {
            $value = substr($value, 1, -1);
        }
        if ($key !== '' && getenv($key) === false) {
            putenv("$key=$value");
        }
    }
})();

$smtpUser = getenv('SMTP_USER') ?: '';

return [
    // SMTP provider (Gmail/Workspace app password, Brevo, Mailgun, host mail...)
    'smtp_host'       => getenv('SMTP_HOST') ?: 'smtp.gmail.com',
    'smtp_user'       => $smtpUser,
    'smtp_pass'       => getenv('SMTP_PASS') ?: '',
    'smtp_port'       => (int) (getenv('SMTP_PORT') ?: 587),
    'smtp_secure'     => getenv('SMTP_SECURE') ?: 'tls', // 'tls' (587) or 'ssl' (465)

    // Visible "From". Gmail requires this to match the authenticated account (or a verified alias).
    'from_email'      => getenv('SMTP_FROM_EMAIL') ?: $smtpUser,
    'from_name'       => getenv('SMTP_FROM_NAME') ?: 'PrimeFix Solutions',

    // Where estimate requests, reviews and newsletter signups are delivered.
    'notify_to_email' => getenv('NOTIFY_TO_EMAIL') ?: $smtpUser,

    // Shown in customer-facing emails.
    'business_phone'  => getenv('BUSINESS_PHONE') ?: '(555) 010-2000',

    // Comma-separated list of origins allowed to call this API cross-origin,
    // e.g. "https://primefix.vip".
    // Leave empty when the site and API share one domain (recommended).
    'allowed_origins' => array_filter(array_map('trim', explode(',', getenv('ALLOWED_ORIGIN') ?: ''))),

    // Set to true ONLY if you are behind a trusted reverse proxy / CDN that sets X-Forwarded-For.
    'trust_proxy'     => filter_var(getenv('TRUST_PROXY') ?: 'false', FILTER_VALIDATE_BOOLEAN),
];
