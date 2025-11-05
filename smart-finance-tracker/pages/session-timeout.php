<?php

// Session Timeout Page

session_start();

// Get reason for timeout
$reason = $_GET['reason'] ?? 'timeout';

// Set content based on reason
$title = 'Session Expired';
$message = 'Your session has expired for security reasons. Please sign in again to continue.';
$icon = 'clock-history';

if ($reason === 'logout') {
    $title = 'Signed Out';
    $message = 'You have been successfully signed out. Come back soon!';
    $icon = 'box-arrow-right';
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($title); ?> - Smart Finance Tracker</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="../assets/css/auth.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
</head>

<body>
    <div class="auth-page-wrapper">
        <div class="auth-content-center">
            <div class="auth-card session-card">

                <div class="session-icon-wrapper">
                    <i class="bi bi-<?php echo htmlspecialchars($icon); ?>"></i>
                </div>

                <h1 class="session-title"><?php echo htmlspecialchars($title); ?></h1>

                <p class="session-message"><?php echo htmlspecialchars($message); ?></p>

                <div class="session-info-card">
                    <?php if ($reason === 'timeout'): ?>
                        <i class="bi bi-info-circle"></i>
                        <div class="session-info-content">
                            <h3>Why did this happen?</h3>
                            <p>For your security, we automatically sign you out after 30 minutes of inactivity.</p>
                        </div>
                    <?php else: ?>
                        <i class="bi bi-shield-check"></i>
                        <div class="session-info-content">
                            <h3>Your data is secure</h3>
                            <p>All your financial information has been safely logged out and protected.</p>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Actions -->
                <div class="session-actions">
                    <a href="/auth/signin.php" class="btn btn-primary btn-full">
                        <i class="bi bi-box-arrow-in-right"></i>
                        Sign In Again
                    </a>
                    <a href="/index.php" class="btn btn-secondary btn-full">
                        <i class="bi bi-house"></i>
                        Go to Home
                    </a>
                </div>
            </div>
        </div>
        <!-- Decorative Elements -->
        <div class="decorative-elements">
            <div class="leaf leaf-1"><i class="bi bi-leaf"></i></div>
            <div class="leaf leaf-2"><i class="bi bi-flower1"></i></div>
            <div class="leaf leaf-3"><i class="bi bi-droplet"></i></div>
        </div>
    </div>
</body>

</html>