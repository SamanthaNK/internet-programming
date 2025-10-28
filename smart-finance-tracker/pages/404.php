<?php
// Error 404 Page

session_start();

require_once __DIR__ . '/../config/db_connect.php';
require_once __DIR__ . '/../includes/auth_session.php';

// Set page-specific variables
$page_title = '404 - Page Not Found';
$current_page = '';

http_response_code(404);

include __DIR__ . '/../includes/header.php';
?>

<!-- 404 Content -->
<div class="container-fluid section-spacing">
    <div class="page-transition">

        <!-- Error Card -->
        <div class="card welcome-card">
            <div class="error-icon">
                <i class="bi bi-exclamation-triangle"></i>
            </div>
            <h1 class="error-title">404</h1>
            <h2 class="error-subtitle">Page Not Found</h2>
            <p class="error-description">
                Oops! The page you're looking for seems to have wandered off.
                It might have been moved, deleted, or perhaps it never existed.
            </p>

            <!-- Action Buttons -->
            <div class="error-actions">
                <a href="<?php echo isLoggedIn() ? '/pages/dashboard.php' : '/index.php'; ?>" class="btn btn-primary">
                    <i class="bi bi-house"></i>
                    Go to <?php echo isLoggedIn() ? 'Dashboard' : 'Home'; ?>
                </a>
                <button onclick="history.back()" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i>
                    Go Back
                </button>
            </div>

            <!-- Helpful Links -->
            <div class="helpful-links">
                <h3>You might be looking for:</h3>
                <div class="links-grid">
                    <?php if (isLoggedIn()): ?>
                        <a href="/pages/dashboard.php" class="link-card">
                            <i class="bi bi-speedometer2"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="/pages/transactions.php" class="link-card">
                            <i class="bi bi-list-ul"></i>
                            <span>Transactions</span>
                        </a>
                        <a href="/pages/reports.php" class="link-card">
                            <i class="bi bi-bar-chart"></i>
                            <span>Reports</span>
                        </a>
                        <a href="/pages/settings.php" class="link-card">
                            <i class="bi bi-gear"></i>
                            <span>Settings</span>
                        </a>
                    <?php else: ?>
                        <a href="/index.php" class="link-card">
                            <i class="bi bi-house"></i>
                            <span>Home</span>
                        </a>
                        <a href="/auth/signin.php" class="link-card">
                            <i class="bi bi-box-arrow-in-right"></i>
                            <span>Sign In</span>
                        </a>
                        <a href="/auth/signup.php" class="link-card">
                            <i class="bi bi-person-plus"></i>
                            <span>Sign Up</span>
                        </a>
                        <a href="/pages/about.php" class="link-card">
                            <i class="bi bi-info-circle"></i>
                            <span>About Us</span>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>

    </div>
</div>

<?php
include __DIR__ . '/../includes/footer.php';
?>