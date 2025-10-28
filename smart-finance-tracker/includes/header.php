<?php
// Header Include File that contains the navigation bar and common head elements

// Get current user data if logged in
$is_logged_in = isLoggedIn();
$user_data = $is_logged_in ? getCurrentUser() : null;
$user_name = $user_data['name'] ?? 'User';

// Set default current page if not provided
$current_page = $current_page ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title ?? 'Smart Finance Tracker'); ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <?php if (isset($additional_css)): ?>
        <?php foreach ($additional_css as $css): ?>
            <link rel="stylesheet" href="<?php echo htmlspecialchars($css); ?>">
        <?php endforeach; ?>
    <?php endif; ?>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>

<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="container-fluid">
            <div class="navbar-container">
                <!-- Brand Logo -->
                <a href="<?php echo $is_logged_in ? '/pages/dashboard.php' : '/index.php'; ?>" class="navbar-brand">
                    <i class="bi bi-tree-fill"></i>
                    FinanceTracker
                </a>

                <!-- Navigation Menu -->
                <?php if ($is_logged_in): ?>
                    <div class="navbar-menu">
                        <a href="/pages/dashboard.php" class="nav-link <?php echo $current_page === 'dashboard' ? 'active' : ''; ?>">
                            <i class="bi bi-speedometer2"></i>
                            Dashboard
                        </a>
                        <a href="/pages/transactions.php" class="nav-link <?php echo $current_page === 'transactions' ? 'active' : ''; ?>">
                            <i class="bi bi-list-ul"></i>
                            Transactions
                        </a>
                        <a href="/pages/reports.php" class="nav-link <?php echo $current_page === 'reports' ? 'active' : ''; ?>">
                            <i class="bi bi-bar-chart"></i>
                            Reports
                        </a>
                    </div>

                    <!-- User Section -->
                    <div class="navbar-user">
                        <div class="user-greeting">
                            <i class="bi bi-person-circle"></i>
                            <span>Welcome, <strong><?php echo htmlspecialchars($user_name); ?></strong></span>
                        </div>
                        <a href="/auth/logout.php" class="btn btn-outline btn-logout">
                            <i class="bi bi-box-arrow-right"></i>
                            Logout
                        </a>
                    </div>
                <?php else: ?>
                    <!-- Guest Navigation -->
                    <div class="navbar-menu">
                        <a href="/auth/signin.php" class="btn btn-outline">
                            <i class="bi bi-box-arrow-in-right"></i>
                            Sign In
                        </a>
                        <a href="/auth/signup.php" class="btn btn-primary">
                            <i class="bi bi-person-plus"></i>
                            Sign Up
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <!-- Main Content Wrapper -->
    <main class="main-content">