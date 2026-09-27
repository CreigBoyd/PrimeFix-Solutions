<?php
/**
 * POST /server/send-mail.php (Proxied via /api/send-mail.php)
 *
 * Expects JSON: { name, phone, email, service, message, company }
 */

require __DIR__ . '/bootstrap.php';

use PHPMailer\PHPMailer\Exception;

require_post();

$data = json_input();

// Honeypot check — silently succeed for spam bots
if (!empty($data['company'])) {
    respond(true);
}

$name    = trim((string) ($data['name'] ?? ''));
$phone   = trim((string) ($data['phone'] ?? ''));
$email   = trim((string) ($data['email'] ?? ''));
$service = trim((string) ($data['service'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));

$isNewsletter = ($service === 'Newsletter Subscription' || stristr($service, 'newsletter') !== false);

$errors = [];
if (!$isNewsletter && $name === '') {
    $errors[] = 'Name is required.';
}
if (!$isNewsletter && $phone === '') {
    $errors[] = 'Phone is required.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

if ($errors) {
    respond(false, ['error' => implode(' ', $errors)], 422);
}

$mail = build_mailer($config);

try {
    $mail->addAddress($config['notify_to_email']);
    if ($email !== '') {
        $mail->addReplyTo($email, $name ?: $email);
    }

    $mail->isHTML(true);

    if ($isNewsletter) {
        $mail->Subject = "New Newsletter Subscriber — " . ($name ?: $email);
        $mail->Body = '
            <h2>New Newsletter Subscription</h2>
            <p><strong>Email:</strong> ' . htmlspecialchars($email) . '</p>
            ' . ($name !== '' ? '<p><strong>Name:</strong> ' . htmlspecialchars($name) . '</p>' : '') . '
            <p><strong>Source:</strong> Newsletter Footer Signup</p>
        ';
        $mail->AltBody = "New Newsletter Subscription\nEmail: {$email}" . ($name !== '' ? "\nName: {$name}" : "");
    } else {
        $mail->Subject = "New estimate request — {$name}";
        $mail->Body = '
            <h2>New Estimate Request</h2>
            <p><strong>Name:</strong> ' . htmlspecialchars($name) . '</p>
            <p><strong>Phone:</strong> ' . htmlspecialchars($phone) . '</p>
            <p><strong>Email:</strong> ' . htmlspecialchars($email ?: '—') . '</p>
            <p><strong>Service/Type:</strong> ' . htmlspecialchars($service) . '</p>
            <p><strong>Details:</strong><br>' . nl2br(htmlspecialchars($message)) . '</p>
        ';
        $mail->AltBody = "Name: {$name}\nPhone: {$phone}\nEmail: {$email}\nService: {$service}\nDetails:\n{$message}";
    }

    $mail->send();
} catch (Exception $e) {
    error_log('PrimeFix contact form mail error: ' . $mail->ErrorInfo);
    respond(false, ['error' => 'Sorry, something went wrong sending that request.'], 500);
}

// Confirmation email to visitor
if ($email !== '') {
    try {
        $confirmation = build_mailer($config);
        $confirmation->addAddress($email, $name ?: 'Subscriber');
        $confirmation->addReplyTo($config['notify_to_email'], $config['from_name']);

        $confirmation->isHTML(true);

        if ($isNewsletter) {
            $confirmation->Subject = "Welcome to PrimeFix Solutions!";
            $confirmation->Body = '
                <div style="font-family: Arial, Helvetica, sans-serif; color:#0E2A38; max-width:520px;">
                    <p>Hi ' . htmlspecialchars($name ?: 'there') . ',</p>
                    <p>Thanks for subscribing to the PrimeFix Solutions newsletter! You are now on the list to receive our latest home maintenance tips, seasonal checklists, and special offers.</p>
                    <p>If you ever have any questions or need a hand around the house, feel free to call or text us anytime at <a href="tel:5550102000" style="color:#128077;">(555) 010-2000</a>.</p>
                    <p style="margin-top:24px; color:#4A6572; font-size:13px;">— The PrimeFix Solutions team</p>
                </div>
            ';
            $confirmation->AltBody = "Hi " . ($name ?: 'there') . ",\n\nThanks for subscribing to the PrimeFix Solutions newsletter! You'll be the first to receive home maintenance tips and seasonal guides.\n\n— The PrimeFix Solutions team";
        } else {
            $firstName = $name !== '' ? explode(' ', $name)[0] : 'there';
            $confirmation->Subject = "We've got your request — PrimeFix Solutions";
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
            $confirmation->AltBody = "Hi {$firstName},\n\nThanks for reaching out to PrimeFix Solutions — this confirms we received your request.\n\nService: {$service}\nPhone: {$phone}\n" . ($message !== '' ? "Details: {$message}\n" : '') . "\nWe reply within 24 hours.\n\n— The PrimeFix Solutions team";
        }

        $confirmation->send();
    } catch (Exception $e) {
        error_log('PrimeFix visitor confirmation mail error: ' . $confirmation->ErrorInfo);
    }
}

respond(true);