<?php
/**
 * POST /server/subscribe.php
 *
 * Expects JSON: { email, company }
 * "company" is a honeypot field, same idea as send-mail.php.
 *
 * This is a minimal starting point: it appends the address to a local CSV
 * and emails you a notification via PHPMailer. For a real mailing list
 * (unsubscribe links, campaigns, deliverability, etc.) you'll want to swap
 * this out for a proper provider — Mailchimp, ConvertKit, Brevo, etc. all
 * have simple HTTP APIs you could call from here instead.
 */

require __DIR__ . '/bootstrap.php';

use PHPMailer\PHPMailer\PHPMailer;
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

// Append to a local CSV as a simple record of signups.
$csvPath = __DIR__ . '/subscribers.csv';
$row = [$email, gmdate('Y-m-d H:i:s') . ' UTC'];
$fh = fopen($csvPath, 'a');
if ($fh) {
    fputcsv($fh, $row);
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
    // The address is already saved to the CSV even if the notification
    // email fails, so we don't lose the signup — just log it.
    error_log('PrimeFix newsletter mail error: ' . $mail->ErrorInfo);
    respond(true);
}
