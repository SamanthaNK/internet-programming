<?php
// sign in process handler

session_start();

require_once __DIR__ . '/../../config/db_connect.php';
require_once __DIR__ . '/../../includes/auth_session.php';
require_once __DIR__ . '/../../includes/functions.php';

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /auth/signin.php");
    exit();
}

// Verify CSRF token
if (!isset($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
    header("Location: /auth/signin.php?error=invalid_request");
    exit();
}

// Sanitize and validate inputs
$email = sanitizeInput($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$remember_me = isset($_POST['remember_me']);

$errors = [];

// Validate email
if (empty($email)) {
    $errors[] = 'Email is required.';
} elseif (!isValidEmail($email)) {
    $errors[] = 'Invalid email format.';
}

// Validate password
if (empty($password)) {
    $errors[] = 'Password is required.';
}

// If validation errors, redirect back
if (!empty($errors)) {
    $_SESSION['signin_errors'] = $errors;
    $_SESSION['signin_email'] = $email;
    header("Location: /auth/signin.php?error=validation");
    exit();
}

// Get user from database
$user = getUserByEmail($conn, $email);

// Verify credentials
if (!$user || !verifyPassword($password, $user['password'])) {
    // Log failed attempt
    error_log("Failed login attempt for email: {$email}");

    // Add delay to prevent brute force
    sleep(1);

    header("Location: /auth/signin.php?error=invalid_credentials");
    exit();
}

// Successful login - set session
setUserSession($user['user_id'], $user['email'], $user['name']);

// Handle "Remember Me"
if ($remember_me) {
    // Extend session cookie lifetime to 30 days
    $cookie_lifetime = 30 * 24 * 60 * 60; // 30 days
    setcookie(
        session_name(),
        session_id(),
        time() + $cookie_lifetime,
        '/',
        '',
        false, // Set to true if using HTTPS
        true   // HttpOnly
    );
}

// Check if there's a redirect URL stored
$redirect_url = $_SESSION['redirect_after_login'] ?? '/pages/dashboard.php';
unset($_SESSION['redirect_after_login']);

// Redirect to dashboard or stored URL
header("Location: " . $redirect_url);
exit();
?>
