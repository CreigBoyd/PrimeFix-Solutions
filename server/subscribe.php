<?php
/**
 * POST /server/subscribe.php
 *
 * Expects JSON: { email, company }
 * "company" is a honeypot field.
 */

require __DIR__ . '/bootstrap.php';

use PHPMailer\PHPMailer\Exception;

require_post();

$data = json_input();

if (!empty($data['company'])) {
    respond(true);
}

$email = trim((string) ($data['email'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, ['error' => 'Enter a valid email address.'], 422);
}

// Sanitize email against potential CSV formula injection (=, +, -, @)
$safeEmail = ltrim($email, '=+-@');

// Append to local CSV using file locking to prevent corruption from concurrent requests.
$csvPath = __DIR__ . '/subscribers.csv';
$row = [$safeEmail, gmdate('Y-m-d H:i:s') . ' UTC'];
$fh = fopen($csvPath, 'a');
if ($fh) {
    if (flock($fh, LOCK_EX)) {
        fputcsv($fh, $row);
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    fclose($fh);
}

$mail = build_mailer($config);

try {
    $mail->addAddress($config['notify_to_email']);
    $mail->addReplyTo($email);

    $mail->isHTML(true);
    $mail->Subject = 'New newsletter subscriber';
    $mail->Body = '<p><strong>New subscriber:</strong> ' . htmlspecialchars($email) . '</p>';
    $mail->AltBody = "New subscriber: {$email}";

    $mail->send();

    respond(true);
} catch (Exception $e) {
    error_log('PrimeFix newsletter mail error: ' . $mail->ErrorInfo);
    respond(true);
}