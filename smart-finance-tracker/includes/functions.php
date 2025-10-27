<?php
// Helper Functions

require_once __DIR__ . '/../config/db_connect.php';

// Get user by email
function getUserByEmail($conn, $email) {
    $stmt = $conn->prepare("SELECT user_id, email, password, name, currency_preference FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();
    return $user;
}

// Get user by ID
function getUserById($conn, $user_id) {
    $stmt = $conn->prepare("SELECT user_id, email, name, currency_preference, created_at FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();
    return $user;
}

// Create new user
function createUser($conn, $email, $password, $name) {
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (email, password, name, currency_preference, created_at) VALUES (?, ?, ?, 'USD', NOW())");
    $stmt->bind_param("sss", $email, $hashed_password, $name);

    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        $stmt->close();

        // Create default categories for new user
        createDefaultCategories($conn, $user_id);

        return $user_id;
    }

    $stmt->close();
    return false;
}

// Create default categories for new user
function createDefaultCategories($conn, $user_id) {
    $default_categories = [
        'Salary',
        'Investment',
        'Groceries',
        'Transportation',
        'Rent',
        'Bills',
        'Entertainment',
        'Healthcare',
        'Shopping',
        'Dining Out',
        'Education',
        'Travel',
        'Other'
    ];

    $stmt = $conn->prepare("INSERT INTO categories (user_id, name, is_default, created_at) VALUES (?, ?, 1, NOW())");

    foreach ($default_categories as $category) {
        $stmt->bind_param("is", $user_id, $category);
        $stmt->execute();
    }

    $stmt->close();
}

// Create password reset token
function createPasswordResetToken($conn, $email) {
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

    // Delete old tokens for this email
    $stmt = $conn->prepare("DELETE FROM password_resets WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->close();

    // Insert new token
    $stmt = $conn->prepare("INSERT INTO password_resets (email, token, expires_at, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $email, $token, $expires);
    $stmt->execute();
    $stmt->close();

    return $token;
}

// Verify password reset token
function verifyPasswordResetToken($conn, $token) {
    $stmt = $conn->prepare("SELECT email, expires_at FROM password_resets WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    $reset = $result->fetch_assoc();
    $stmt->close();

    if (!$reset) {
        return false;
    }

    // Check if token is expired
    if (strtotime($reset['expires_at']) < time()) {
        return false;
    }

    return $reset['email'];
}

// Update user password
function updateUserPassword($conn, $email, $new_password) {
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->bind_param("ss", $hashed_password, $email);
    $success = $stmt->execute();
    $stmt->close();

    if ($success) {
        // Delete used reset token
        $stmt = $conn->prepare("DELETE FROM password_resets WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->close();
    }

    return $success;
}

// Format currency
function formatCurrency($amount, $currency = 'FCFA') {
    $symbols = [
        'USD' => '$',
        'EUR' => '€',
        'GBP' => '£',
        'FCFA' => 'FCFA'
    ];

    $symbol = $symbols[$currency] ?? 'FCFA';
    return $symbol . number_format($amount, 2);
}
?>