<?php

// Session Timeout Page

session_start();

// Get reason for timeout
$reason = $_GET['reason'] ?? 'timeout';

// Set content based on reason
$content = [
    'timeout' => [
        'title' => 'Session Expired',
        'message' => 'Your session has expired for security reasons. Please sign in again to continue.',
        'icon' => 'clock-history',
        'info_title' => 'Why did this happen?',
        'info_message' => 'For your security, we automatically sign you out after 30 minutes of inactivity.'
    ],
    'logout' => [
        'title' => 'Signed Out',
        'message' => 'You have been successfully signed out. Come back soon!',
        'icon' => 'box-arrow-right',
        'info_title' => 'Your data is secure',
        'info_message' => 'All your financial information has been safely logged out and protected.'
    ]
];

$current = $content[$reason] ?? $content['timeout'];
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
    <div class="auth-container">
        <div class="auth-card">
            <header class="auth-header">
                <div class="auth-icon">
                    <i class="bi bi-<?php echo $current['icon']; ?>"></i>
                </div>
                <h1 class="auth-title"><?php echo htmlspecialchars($title); ?></h1>
                <p class="auth-subtitle"><?php echo htmlspecialchars($message); ?></p>
            </header>

            <!-- Session Info -->
            <div class="session-info">
                <div class="info-card">
                    <i class="bi bi-<?php echo $reason === 'timeout' ? 'info-circle' : 'shield-check'; ?>"></i>
                    <div>
                        <h3><?php echo htmlspecialchars($current['info_title']); ?></h3>
                        <p><?php echo htmlspecialchars($current['info_message']); ?></p>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="timeout-actions">
                <a href="/auth/signin.php" class="btn btn-primary">
                    <i class="bi bi-box-arrow-in-right"></i>
                    Sign In Again
                </a>
                <a href="/index.php" class="btn btn-secondary">
                    <i class="bi bi-house"></i>
                    Go to Home
                </a>
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