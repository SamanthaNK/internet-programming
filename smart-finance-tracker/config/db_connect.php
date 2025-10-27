// MySQL db connection setup

<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'Student_1234');
define('DB_NAME', 'financetrackerdb');

// Create connection
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Set charset to utf8mb4
    $conn->set_charset("utf8mb4");
} catch (Exception $e) {
    die("Database error: " . $e->getMessage());
}

// Timezone setting
date_default_timezone_set('UTC');

// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS
ini_set('session.cookie_samesite', 'Strict');
?>