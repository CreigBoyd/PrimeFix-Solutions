<?php
/**
 * POST /send-mail.php   (frontend calls it via VITE_API_BASE, default /api)
 *
 * Handles every "request something" form on the site: contact/estimate form,
 * consultation bookings, cost estimator, maintenance plans, service explorer
 * and the chatbot.
 *
 * JSON in:  { name, phone, email?, service?, message?, company (honeypot) }
 * JSON out: { ok: true } | { ok: false, error: "..." }
 *
 * Newsletter signups use subscribe.php, reviews use submit-review.php.
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

use PHPMailer\PHPMailer\Exception;

require_post();
$data = json_input();

// Honeypot: pretend success so bots learn nothing.
if (!empty($data['company'])) {
    respond(true);
}

$name    = clean_text($data['name'] ?? '', 100);
$phone   = clean_text($data['phone'] ?? '', 40);
$email   = clean_text($data['email'] ?? '', 254);
$service = clean_text($data['service'] ?? '', 150);
$message = clean_text($data['message'] ?? '', 4000, true);

$errors = [];
if ($name === '') {
    $errors[] = 'Name is required.';
}
if (strlen(tel_digits($phone)) < 10) {
    $errors[] = 'A valid phone number is required.';
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'That email address looks invalid.';
}
if ($errors) {
    respond(false, ['error' => implode(' ', $errors)], 422);
}

// 5 requests / 10 minutes / IP is plenty for a real customer.
rate_limit('contact', 5, 600);
require_mail_config($config);

if ($service === '') {
    $service = 'General inquiry';
}

// ---------------------------------------------------------------------------
// 1) Notification to the business owner (this one must succeed)
// ---------------------------------------------------------------------------
try {
    $mail = build_mailer($config);
    $logo = attach_logo($mail);

    $mail->addAddress($config['notify_to_email']);
    if ($email !== '') {
        $mail->addReplyTo($email, $name);
    }

    $mail->isHTML(true);
    $mail->Subject = "New request: {$service} - {$name}";
    $mail->Body = email_shell($logo,
        '<h2 style="margin:0 0 12px;">New request</h2>'
        . '<p><strong>Name:</strong> ' . e($name) . '</p>'
        . '<p><strong>Phone:</strong> <a href="tel:' . e(tel_digits($phone)) . '">' . e($phone) . '</a></p>'
        . '<p><strong>Email:</strong> ' . ($email !== '' ? e($email) : '-') . '</p>'
        . '<p><strong>Service/Type:</strong> ' . e($service) . '</p>'
        . '<p><strong>Details:</strong><br>' . ($message !== '' ? nl2br(e($message)) : '-') . '</p>'
    );
    $mail->AltBody = "Name: {$name}\nPhone: {$phone}\nEmail: " . ($email ?: '-') . "\nService: {$service}\nDetails:\n" . ($message ?: '-');
    $mail->send();
} catch (Exception $ex) {
    error_log('PrimeFix request mail error: ' . $ex->getMessage());
    respond(false, ['error' => 'Sorry, we could not send that request. Please call or text us instead.'], 502);
}

// ---------------------------------------------------------------------------
// 2) Confirmation to the visitor (best effort - failure is only logged)
// ---------------------------------------------------------------------------
if ($email !== '') {
    try {
        $confirm = build_mailer($config);
        $logo = attach_logo($confirm);
        $phoneLine = '<a href="tel:' . e(tel_digits($config['business_phone'])) . '" style="color:#128077;">' . e($config['business_phone']) . '</a>';
        $firstName = explode(' ', $name)[0];

        $confirm->addAddress($email, $name);
        $confirm->addReplyTo($config['notify_to_email'], $config['from_name']);
        $confirm->isHTML(true);
        $confirm->Subject = "We've received your request - PrimeFix Solutions";
        $confirm->Body = email_shell($logo,
            '<p>Hi ' . e($firstName) . ',</p>'
            . '<p>Thanks for reaching out to PrimeFix Solutions. This confirms we received your request:</p>'
            . '<table style="border-collapse:collapse;margin:16px 0;">'
            . '<tr><td style="padding:4px 12px 4px 0;color:#4A6572;">Service</td><td><strong>' . e($service) . '</strong></td></tr>'
            . '<tr><td style="padding:4px 12px 4px 0;color:#4A6572;">Phone</td><td>' . e($phone) . '</td></tr>'
            . ($message !== '' ? '<tr><td style="padding:4px 12px 4px 0;color:#4A6572;vertical-align:top;">Details</td><td>' . nl2br(e($message)) . '</td></tr>' : '')
            . '</table>'
            . '<p>We aim to reply within 24 hours. If it is urgent, call or text us at ' . $phoneLine . '.</p>'
            . '<p style="margin-top:24px;color:#4A6572;font-size:13px;">- The PrimeFix Solutions team</p>'
        );
        $confirm->AltBody = "Hi {$firstName},\n\nThanks for reaching out to PrimeFix Solutions. We received your request ({$service}) and aim to reply within 24 hours.\nUrgent? Call or text {$config['business_phone']}.\n\n- The PrimeFix Solutions team";
        $confirm->send();
    } catch (Exception $ex) {
        error_log('PrimeFix visitor confirmation mail error: ' . $ex->getMessage());
    }
}

respond(true);
