<?php
/**
 * POST /server/send-mail.php
 *
 * Expects JSON: { name, phone, email, service, message, company }
 * "company" is a honeypot field — it's hidden from real visitors via CSS,
 * so if it's filled in, the submission almost certainly came from a bot.
 * We respond as if it succeeded but skip actually sending anything.
 */

require __DIR__ . '/bootstrap.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_post();

$data = json_input();

// Honeypot check — silently "succeed" without sending.
if (!empty($data['company'])) {
    respond(true);
}

$name    = trim((string) ($data['name'] ?? ''));
$phone   = trim((string) ($data['phone'] ?? ''));
$email   = trim((string) ($data['email'] ?? ''));
$service = trim((string) ($data['service'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));

$errors = [];
if ($name === '') {
    $errors[] = 'Name is required.';
}
if ($phone === '') {
    $errors[] = 'Phone is required.';
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'That email address looks invalid.';
}

if ($errors) {
    respond(false, ['error' => implode(' ', $errors)], 422);
}

$mail = build_mailer($config);

try {
    $mail->addAddress($config['notify_to_email']);
    if ($email !== '') {
        $mail->addReplyTo($email, $name);
    }

    $mail->isHTML(true);
    $mail->Subject = "New estimate request — {$name}";
    $mail->Body = '
        <h2>New estimate request</h2>
        <p><strong>Name:</strong> ' . htmlspecialchars($name) . '</p>
        <p><strong>Phone:</strong> ' . htmlspecialchars($phone) . '</p>
        <p><strong>Email:</strong> ' . htmlspecialchars($email ?: '—') . '</p>
        <p><strong>Service:</strong> ' . htmlspecialchars($service) . '</p>
        <p><strong>Message:</strong><br>' . nl2br(htmlspecialchars($message)) . '</p>
    ';
    $mail->AltBody = "Name: {$name}\nPhone: {$phone}\nEmail: {$email}\nService: {$service}\nMessage: {$message}";

    $mail->send();
} catch (Exception $e) {
    error_log('PrimeFix contact form mail error: ' . $mail->ErrorInfo);
    respond(false, ['error' => 'Sorry, something went wrong sending that. Please call or text us instead.'], 500);
}

// Confirmation email to the visitor. Sent only if they gave an email
// address, and its own try/catch so a failure here never overrides the
// success response above — the owner already has the request either way.
if ($email !== '') {
    try {
        $confirmation = build_mailer($config);
        $confirmation->addAddress($email, $name);
        $confirmation->addReplyTo($config['notify_to_email'], $config['from_name']);

        $confirmation->isHTML(true);
        $confirmation->Subject = "We've got your request — PrimeFix Solutions";
        $firstName = $name !== '' ? explode(' ', $name)[0] : 'there';
        $confirmation->Body = '
            <div style="font-family: Arial, Helvetica, sans-serif; color:#0E2A38; max-width:520px;">
                <p>Hi ' . htmlspecialchars($firstName) . ',</p>
                <p>Thanks for reaching out to PrimeFix Solutions — this confirms we received your request. Here\'s what you sent us:</p>
                <table style="border-collapse:collapse; margin:16px 0;">
                    <tr><td style="padding:4px 12px 4px 0; color:#4A6572;">Service</td><td><strong>' . htmlspecialchars($service) . '</strong></td></tr>
                    <tr><td style="padding:4px 12px 4px 0; color:#4A6572;">Phone</td><td>' . htmlspecialchars($phone) . '</td></tr>' .
                    ($message !== '' ? '<tr><td style="padding:4px 12px 4px 0; color:#4A6572; vertical-align:top;">Details</td><td>' . nl2br(htmlspecialchars($message)) . '</td></tr>' : '') . '
                </table>
                <p>We reply within 24 hours — usually much sooner. If it\'s urgent, just call or text us at <a href="tel:5550102000" style="color:#128077;">(555) 010-2000</a>.</p>
                <p style="margin-top:24px; color:#4A6572; font-size:13px;">— The PrimeFix Solutions team</p>
            </div>
        ';
        $confirmation->AltBody = "Hi {$firstName},\n\nThanks for reaching out to PrimeFix Solutions — this confirms we received your request.\n\nService: {$service}\nPhone: {$phone}\n" . ($message !== '' ? "Details: {$message}\n" : '') . "\nWe reply within 24 hours. Call or text us at (555) 010-2000 if it's urgent.\n\n— The PrimeFix Solutions team";

        $confirmation->send();
    } catch (Exception $e) {
        // Don't fail the whole request over a confirmation email — the
        // owner notification above already succeeded and that's what
        // actually matters. Just log it so you notice a pattern if SMTP
        // is misconfigured for outbound-to-visitor mail specifically.
        error_log('PrimeFix visitor confirmation mail error: ' . $confirmation->ErrorInfo);
    }
}

respond(true);
