<?php
/**
 * POST /server/submit-review.php
 *
 * Expects JSON: { name, service, rating, quote, company }
 * "company" is a honeypot field, same pattern as send-mail.php / subscribe.php.
 *
 * Reviews are NEVER auto-published — anyone could otherwise post a fake
 * one-star review straight to your live site with zero friction. This
 * endpoint appends the submission to pending-reviews.json and emails you
 * a notification. To actually publish one, copy its object from
 * pending-reviews.json into src/data/reviews.json (adding an "id",
 * "date", and "featured": false) and rebuild/redeploy the frontend.
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

// Append to the pending queue as a JSON array (created on first submission).
$pendingPath = __DIR__ . '/pending-reviews.json';
$pending = file_exists($pendingPath)
    ? (json_decode(file_get_contents($pendingPath), true) ?: [])
    : [];

$entry = [
    'name'         => $name,
    'service'      => $service ?: 'Other',
    'rating'       => $rating,
    'quote'        => $quote,
    'submitted_at' => gmdate('c'),
];

$pending[] = $entry;
file_put_contents($pendingPath, json_encode($pending, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// Notify the owner — same as the other two endpoints, failure here doesn't
// fail the request since the submission is already safely saved above.
try {
    $mail = build_mailer($config);
    $mail->addAddress($config['notify_to_email']);

    $mail->isHTML(true);
    $mail->Subject = "New review pending approval — {$name} ({$rating}\u2605)";
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
