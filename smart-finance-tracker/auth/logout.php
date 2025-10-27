<?php
// Logout Handler

session_start();

require_once __DIR__ . '/../config/db_connect.php';
require_once __DIR__ . '/../includes/auth_session.php';
require_once __DIR__ . '/../includes/functions.php';


// Clear session
clearUserSession();

// Redirect to session timeout page with logout reason
header("Location: /pages/session-timeout.php?reason=logout");
exit();
?>