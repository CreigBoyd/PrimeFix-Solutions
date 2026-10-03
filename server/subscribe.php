<?php
/**
 * POST /subscribe.php
 *
 * JSON in:  { email, company (honeypot) }
 * Stores the address in storage/subscribers.csv (de-duplicated), notifies the
 * owner, and sends the subscriber a welcome email.
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

use PHPMailer\PHPMailer\Exception;

require_post();
$data = json_input();

if (!empty($data['company'])) {
    respond(true);
}

$email = clean_text($data['email'] ?? '', 254);

// Reject leading =,+,-,@ outright: protects anyone opening the CSV in Excel/Sheets (formula injection).
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/^[=+\-@]/', $email)) {
    respond(false, ['error' => 'Enter a valid email address.'], 422);
}

rate_limit('subscribe', 5, 3600);
require_mail_config($config);

// ---- Save (skip duplicates) -------------------------------------------------
$csvPath  = storage_dir() . '/subscribers.csv';
$saved    = false;
$isNew    = true;
$fh = @fopen($csvPath, 'c+');
if ($fh) {
    if (flock($fh, LOCK_EX)) {
        while (($row = fgetcsv($fh, 0, ',', '"', '')) !== false) {
            if (isset($row[0]) && strcasecmp($row[0], $email) === 0) {
                $isNew = false;
                break;
            }
        }
        if ($isNew) {
            fseek($fh, 0, SEEK_END);
            fputcsv($fh, [$email, gmdate('Y-m-d H:i:s') . ' UTC'], ',', '"', '');
            fflush($fh);
        }
        $saved = true;
        flock($fh, LOCK_UN);
    }
    fclose($fh);
}

// Already subscribed: succeed quietly, don't email anyone again.
if (!$isNew) {
    respond(true);
}

// ---- Emails -------------------------------------------------------------------
$notified = false;
try {
    $mail = build_mailer($config);
    $mail->addAddress($config['notify_to_email']);
    $mail->addReplyTo($email);
    $mail->isHTML(true);
    $mail->Subject = 'New newsletter subscriber';
    $mail->Body    = '<p><strong>New subscriber:</strong> ' . e($email) . '</p>'
        . ($saved ? '' : '<p style="color:#b00020;">Warning: could not save to storage/subscribers.csv. Copy this address manually.</p>');
    $mail->AltBody = "New subscriber: {$email}";
    $mail->send();
    $notified = true;
} catch (Exception $ex) {
    error_log('PrimeFix newsletter notify error: ' . $ex->getMessage());
}

// Only fail if the signup was lost entirely.
if (!$saved && !$notified) {
    respond(false, ['error' => 'Sorry, we could not complete your signup. Please try again later.'], 502);
}

try {
    $welcome = build_mailer($config);
    $logo = attach_logo($welcome);
    $phoneLine = '<a href="tel:' . e(tel_digits($config['business_phone'])) . '" style="color:#128077;">' . e($config['business_phone']) . '</a>';

    $welcome->addAddress($email);
    $welcome->addReplyTo($config['notify_to_email'], $config['from_name']);
    $welcome->isHTML(true);
    $welcome->Subject = 'Welcome to PrimeFix Solutions';
    $welcome->Body = email_shell($logo,
        '<p>Thanks for subscribing to the PrimeFix Solutions newsletter.</p>'
        . '<p>Expect the occasional seasonal reminder, like when it is time to book gutter cleaning or winterizing.</p>'
        . '<p>Questions or need a hand around the property? Call or text us at ' . $phoneLine . '.</p>'
        . '<p style="margin-top:24px;color:#4A6572;font-size:13px;">Reply to this email at any time to unsubscribe.<br>- The PrimeFix Solutions team</p>'
    );
    $welcome->AltBody = "Thanks for subscribing to the PrimeFix Solutions newsletter. Reply to this email at any time to unsubscribe.\n- The PrimeFix Solutions team";
    $welcome->send();
} catch (Exception $ex) {
    error_log('PrimeFix newsletter welcome error: ' . $ex->getMessage());
}

respond(true);
