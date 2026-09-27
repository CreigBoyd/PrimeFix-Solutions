<?php
/**
 * POST /server/submit-review.php
 *
 * Expects JSON: { name, service, rating, quote, company }
 * "company" is a honeypot field.
 */

require __DIR__ . '/bootstrap.php';

use PHPMailer\PHPMailer\Exception;

require_post();

$data = json_input();

if (!empty($data['company'])) {
    respond(true);
}

$name    = trim((string) ($data['name'] ?? ''));
$service = trim((string) ($data['service'] ?? ''));
$rating  = (int) ($data['rating'] ?? 0);
$quote   = trim((string) ($data['quote'] ?? ''));

$errors = [];
if ($name === '') {
    $errors[] = 'Name is required.';
}
if ($rating < 1 || $rating > 5) {
    $errors[] = 'Rating must be between 1 and 5.';
}
if (mb_strlen($quote) < 10) {
    $errors[] = 'Review text is too short.';
}

if ($errors) {
    respond(false, ['error' => implode(' ', $errors)], 422);
}

// Append entry to pending queue using atomic file locking (flock)
$pendingPath = __DIR__ . '/pending-reviews.json';
$entry = [
    'name'         => $name,
    'service'      => $service ?: 'Other',
    'rating'       => $rating,
    'quote'        => $quote,
    'submitted_at' => gmdate('c'),
];

$fh = fopen($pendingPath, 'c+');
if ($fh) {
    if (flock($fh, LOCK_EX)) {
        $filesize = filesize($pendingPath);
        $pending = [];
        if ($filesize > 0) {
            $content = fread($fh, $filesize);
            $pending = json_decode($content, true) ?: [];
        }
        $pending[] = $entry;

        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($pending, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    fclose($fh);
}

// Notify owner
try {
    $mail = build_mailer($config);
    $mail->addAddress($config['notify_to_email']);

    $mail->isHTML(true);
    // Fixed PHP curly brace Unicode syntax: \u{2605}
    $mail->Subject = "New review pending approval — {$name} ({$rating}\u{2605})";
    $mail->Body = '
        <h2>New review awaiting approval</h2>
        <p><strong>Name:</strong> ' . htmlspecialchars($name) . '</p>
        <p><strong>Service:</strong> ' . htmlspecialchars($service ?: 'Other') . '</p>
        <p><strong>Rating:</strong> ' . str_repeat('&#9733;', $rating) . str_repeat('&#9734;', 5 - $rating) . '</p>
        <p><strong>Review:</strong><br>' . nl2br(htmlspecialchars($quote)) . '</p>
        <p style="color:#4A6572;font-size:0.85rem;">Saved to server/pending-reviews.json — copy it into src/data/reviews.json to publish it.</p>
    ';
    $mail->AltBody = "Name: {$name}\nService: {$service}\nRating: {$rating}/5\nReview: {$quote}";

    $mail->send();
} catch (Exception $e) {
    error_log('PrimeFix review notification mail error: ' . $mail->ErrorInfo);
}

respond(true);