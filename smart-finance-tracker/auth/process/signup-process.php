<?php
// Sign up process handler

session_start();

require_once __DIR__ . '/../../config/db_connect.php';
require_once __DIR__ . '/../../includes/auth_session.php';
require_once __DIR__ . '/../../includes/functions.php';

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /auth/signup.php");
    exit();
}

// Verify CSRF token
if (!isset($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
    header("Location: /auth/signup.php?error=invalid_request");
    exit();
}

// Sanitize and validate inputs
$name = sanitizeInput($_POST['name'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirm_password = $_POST['confirm_password'] ?? '';
$terms = isset($_POST['terms']);

$errors = [];

// Validate name
if (empty($name)) {
    $errors[] = 'Name is required.';
} elseif (strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters.';
} elseif (strlen($name) > 100) {
    $errors[] = 'Name must be less than 100 characters.';
}

// Validate email
if (empty($email)) {
    $errors[] = 'Email is required.';
} elseif (!isValidEmail($email)) {
    $errors[] = 'Invalid email format.';
} else {
    // Check if email already exists
    $existing_user = getUserByEmail($conn, $email);
    if ($existing_user) {
        $errors[] = 'This email is already registered.';
    }
}

// Validate password
if (empty($password)) {
    $errors[] = 'Password is required.';
} elseif (!isValidPassword($password)) {
    $errors[] = 'Password must be at least 8 characters with uppercase, lowercase, and number.';
}

// Validate password confirmation
if ($password !== $confirm_password) {
    $errors[] = 'Passwords do not match.';
}

// Validate terms acceptance
if (!$terms) {
    $errors[] = 'You must accept the Terms of Service and Privacy Policy.';
}

// If validation errors, redirect back with errors
if (!empty($errors)) {
    $_SESSION['signup_errors'] = $errors;
    $_SESSION['signup_name'] = $name;
    $_SESSION['signup_email'] = $email;
    header("Location: /auth/signup.php");
    exit();
}

// Create user account
$user_id = createUser($conn, $email, $password, $name);

if (!$user_id) {
    $_SESSION['signup_errors'] = ['Failed to create account. Please try again.'];
    $_SESSION['signup_name'] = $name;
    $_SESSION['signup_email'] = $email;
    header("Location: /auth/signup.php");
    exit();
}

// Redirect to sign in with success message
header("Location: /auth/signin.php?success=registered");
exit();
?>