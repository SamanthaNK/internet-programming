<?php
// Password reset request handler

session_start();

require_once __DIR__ . '/../../config/db_connect.php';
require_once __DIR__ . '/../../includes/auth_session.php';
require_once __DIR__ . '/../../includes/functions.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: /auth/forgot-password.php');
	exit();
}

// Sanitize and validate email
$email = sanitizeInput($_POST['email'] ?? '');
$errors = [];

if (empty($email)) {
	$errors[] = 'Email is required.';
} elseif (!isValidEmail($email)) {
	$errors[] = 'Invalid email format.';
}

if (!empty($errors)) {
	$_SESSION['reset_errors'] = $errors;
	$_SESSION['reset_email'] = $email;
	header('Location: /auth/forgot-password.php?error=validation');
	exit();
}

// Lookup user (but always return generic success to avoid account enumeration)
$user = getUserByEmail($conn, $email);

if ($user) {
	// Create a password reset token and store it
	$token = createPasswordResetToken($conn, $email);

	// Build reset link
	$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
	$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
	$reset_link = $scheme . '://' . $host . '/auth/reset.php?token=' . urlencode($token);

	// Email content
	$subject = 'Reset your Smart Finance Tracker password';
	$message = "Hello,\n\nWe received a request to reset the password for your Smart Finance Tracker account.\n\n";
	$message .= "Please click the link below to reset your password (this link will expire in 1 hour):\n\n";
	$message .= $reset_link . "\n\nIf you did not request a password reset, please ignore this message.\n\n--\nSmart Finance Tracker";

	$headers = 'From: no-reply@' . $host . "\r\n";
	$headers .= 'Content-Type: text/plain; charset=utf-8' . "\r\n";

	// Try to send email. If mail is not configured, store link in session for developer convenience.
	$mail_sent = false;
	try {
		$mail_sent = mail($email, $subject, $message, $headers);
	} catch (Exception $e) {
		error_log('Password reset mail error: ' . $e->getMessage());
	}

	if (!$mail_sent) {
		// For development environments without a mailer, keep the link in session so developer can copy it.
		$_SESSION['reset_link'] = $reset_link;
	}
}

// Always respond with a generic success message to avoid revealing whether the email exists
$_SESSION['reset_success'] = 'If an account exists for that email, a password reset link has been sent.';
header('Location: /auth/forgot-password.php?success=sent');
exit();

?>