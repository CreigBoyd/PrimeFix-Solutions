<?php
/**
 * POST /submit-review.php
 *
 * JSON in:  { name, service, rating, quote, company (honeypot) }
 * Reviews are NOT published automatically. They are queued in
 * storage/pending-reviews.json and emailed to the owner with a ready-to-paste
 * snippet for src/data/reviews.json.
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

use PHPMailer\PHPMailer\Exception;

require_post();
$data = json_input();

if (!empty($data['company'])) {
    respond(true);
}

const REVIEW_SERVICES = [
    'Carpentry', 'Roofing', 'Yard & grounds', 'Handyman & repairs',
    'Painting & finishing', 'Seasonal upkeep', 'Other',
];

$name    = clean_text($data['name'] ?? '', 80);
$service = clean_text($data['service'] ?? '', 60);
$rating  = (int) ($data['rating'] ?? 0);
$quote   = clean_text($data['quote'] ?? '', 2000, true);

if (!in_array($service, REVIEW_SERVICES, true)) {
    $service = 'Other';
}

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

rate_limit('review', 3, 3600);
require_mail_config($config);

$entry = [
    'name'         => $name,
    'service'      => $service,
    'rating'       => $rating,
    'quote'        => $quote,
    'submitted_at' => gmdate('c'),
];

// ---- Queue (atomic append under an exclusive lock) ---------------------------
$saved = false;
$fh = @fopen(storage_dir() . '/pending-reviews.json', 'c+');
if ($fh) {
    if (flock($fh, LOCK_EX)) {
        $pending = json_decode((string) stream_get_contents($fh), true);
        $pending = is_array($pending) ? $pending : [];
        $pending[] = $entry;
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($pending, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        fflush($fh);
        $saved = true;
        flock($fh, LOCK_UN);
    }
    fclose($fh);
}

// ---- Notify owner, including a paste-ready snippet ---------------------------
$slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', $name) ?? '', '-')) ?: 'customer';
$snippet = json_encode([
    'id'       => $slug . '-' . date('ymd'),
    'name'     => $name,
    'role'     => 'Customer',
    'service'  => $service,
    'rating'   => $rating,
    'date'     => gmdate('Y-m-d'),
    'quote'    => $quote,
    'featured' => false,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$notified = false;
try {
    $mail = build_mailer($config);
    $mail->addAddress($config['notify_to_email']);
    $mail->isHTML(true);
    $mail->Subject = "New review pending approval - {$name} ({$rating}/5)";
    $mail->Body = '<h2>New review awaiting approval</h2>'
        . '<p><strong>Name:</strong> ' . e($name) . '</p>'
        . '<p><strong>Service:</strong> ' . e($service) . '</p>'
        . '<p><strong>Rating:</strong> ' . str_repeat('&#9733;', $rating) . str_repeat('&#9734;', 5 - $rating) . '</p>'
        . '<p><strong>Review:</strong><br>' . nl2br(e($quote)) . '</p>'
        . '<p style="color:#4A6572;font-size:0.9rem;">To publish: add this to <code>src/data/reviews.json</code> and redeploy.</p>'
        . '<pre style="background:#f4f6f8;padding:12px;border-radius:6px;font-size:12px;white-space:pre-wrap;">' . e($snippet) . '</pre>';
    $mail->AltBody = "Name: {$name}\nService: {$service}\nRating: {$rating}/5\nReview: {$quote}\n\nTo publish, add to src/data/reviews.json:\n{$snippet}";
    $mail->send();
    $notified = true;
} catch (Exception $ex) {
    error_log('PrimeFix review notification error: ' . $ex->getMessage());
}

// Only fail if the review was lost entirely.
if (!$saved && !$notified) {
    respond(false, ['error' => 'Sorry, we could not save your review. Please try again later.'], 502);
}

respond(true);
