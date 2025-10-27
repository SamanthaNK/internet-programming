<?php
// Authentication and Session Management

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Session timeout(30 minutes)
define('SESSION_TIMEOUT', 1800); // 30 minutes in seconds

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']) && isset($_SESSION['last_activity']);
}

// Check session timeout
function checkSessionTimeout() {
    if (isset($_SESSION['last_activity'])) {
        $elapsed = time() - $_SESSION['last_activity'];

        if ($elapsed > SESSION_TIMEOUT) {
            // Session expired
            session_unset();
            session_destroy();
            return false;
        }
    }

    // Update last activity timestamp
    $_SESSION['last_activity'] = time();
    return true;
}

// Require user to be logged in (redirect to login if not)
function requireAuth() {
    if (!isLoggedIn()) {
        $_SESSION['redirect_after_login'] = $_SERVER['REQUEST_URI'];
        header("Location: /auth/signin.php?error=login_required");
        exit();
    }

    if (!checkSessionTimeout()) {
        header("Location: /pages/session-timeout.php?reason=timeout");
        exit();
    }
}

// Regenerate session ID for security
function regenerateSession() {
    session_regenerate_id(true);
}

// Set user session on login
function setUserSession($user_id, $email, $name) {
    regenerateSession();

    $_SESSION['user_id'] = $user_id;
    $_SESSION['email'] = $email;
    $_SESSION['name'] = $name;
    $_SESSION['last_activity'] = time();
    $_SESSION['created_at'] = time();
    $_SESSION['user_ip'] = $_SERVER['REMOTE_ADDR'];
}

// Clear user session on logout
function clearUserSession() {
    $_SESSION = array();

    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }

    session_destroy();
}

// Generate CSRF token
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Verify CSRF token
function verifyCSRFToken($token) {
    if (!isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        return false;
    }
    return true;
}

// Get current user ID
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

// Get current user data
function getCurrentUser() {
    return [
        'user_id' => $_SESSION['user_id'] ?? null,
        'email' => $_SESSION['email'] ?? null,
        'name' => $_SESSION['name'] ?? null
    ];
}

// Sanitize user input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Validate email format
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Validate password strength
function isValidPassword($password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return strlen($password) >= 8 &&
           preg_match('/[A-Z]/', $password) &&
           preg_match('/[a-z]/', $password) &&
           preg_match('/[0-9]/', $password);
}

// Hash password
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Verify password hash
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}
?>