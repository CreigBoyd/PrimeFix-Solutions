<?php

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
        if ($key !== '') {
            putenv("$key=$value");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
})();

$env = function(string $key, string $default = ''): string {
    $val = $_ENV[$key] ?? getenv($key);
    return ($val !== false && $val !== null && $val !== '') ? (string)$val : $default;
};

return [
    'smtp_host'          => $env('SMTP_HOST', 'primefix.vip'),
    'smtp_port'          => (int)$env('SMTP_PORT', '465'),
    'smtp_secure'        => $env('SMTP_SECURE', 'ssl'),
    'smtp_user'          => $env('SMTP_USER'),
    'smtp_pass'          => $env('SMTP_PASS'),
    'notify_to_email'    => $env('NOTIFY_TO_EMAIL', 'hello@primefix.vip'),
    'from_email'         => $env('SMTP_USER', 'hello@primefix.vip'),
    'from_name'          => 'PrimeFix Solutions',

    // Business Contact Details
    'business_phone'     => $env('BUSINESS_PHONE_DISPLAY', '(978) 417-2042'),
    'business_phone_raw' => $env('BUSINESS_PHONE', '9784172042'),
    'business_email'     => $env('BUSINESS_EMAIL', 'hello@primefix.vip'),

    'allowed_origins'    => array_filter(explode(',', $env('ALLOWED_ORIGIN'))),
    'trust_proxy'        => strtolower($env('TRUST_PROXY')) === 'true',
];