<?php
// Landing Page
session_start();

// Redirect to dashboard if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: /pages/dashboard.php');
    exit();
}

$page_title = 'Welcome - Smart Finance Tracker';
$current_page = 'home';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title); ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>

<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="container-fluid">
            <div class="navbar-container">
                <a href="/index.php" class="navbar-brand">
                    <i class="bi bi-tree-fill"></i>
                    FinanceTracker
                </a>

                <div class="navbar-menu">
                    <a href="/auth/signin.php" class="btn btn-outline">
                        <i class="bi bi-box-arrow-in-right"></i>
                        Sign In
                    </a>
                    <a href="/auth/signup.php" class="btn btn-primary">
                        <i class="bi bi-person-plus"></i>
                        Get Started
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container-fluid">
            <div class="fade-in-up">
                <h1>Take Control of Your Financial Future</h1>
                <p>
                    Smart finance tracking with AI-powered insights. Track expenses, 
                    set budgets, achieve goals, and make better financial decisions.
                </p>
                <div class="error-actions">
                    <a href="/auth/signup.php" class="btn btn-primary">
                        <i class="bi bi-rocket-takeoff"></i>
                        Start Free Today
                    </a>
                    <a href="#features" class="btn btn-secondary">
                        <i class="bi bi-play-circle"></i>
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="section-spacing" id="features">
        <div class="container-fluid">
            <div class="mb-large">
                <h2 style="text-align: center;">Everything You Need to Manage Your Money</h2>
                <p style="text-align: center; color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
                    Powerful features designed to help you achieve financial freedom
                </p>
            </div>

            <div class="stat-cards-grid">
                <div class="card">
                    <div class="icon-circle income">
                        <i class="bi bi-graph-up-arrow"></i>
                    </div>
                    <h3 style="font-size: 1.5rem; text-align: center; margin-bottom: 1rem;">Track Transactions</h3>
                    <p style="text-align: center; color: var(--text-secondary);">
                        Easily record income and expenses with our intuitive interface. 
                        Categorize and organize all your financial activities.
                    </p>
                </div>

                <div class="card">
                    <div class="icon-circle expense">
                        <i class="bi bi-wallet2"></i>
                    </div>
                    <h3 style="font-size: 1.5rem; text-align: center; margin-bottom: 1rem;">Budget Planning</h3>
                    <p style="text-align: center; color: var(--text-secondary);">
                        Set monthly budgets for different categories and get alerts 
                        when you're approaching your limits.
                    </p>
                </div>

                <div class="card">
                    <div class="icon-circle savings">
                        <i class="bi bi-lightbulb"></i>
                    </div>
                    <h3 style="font-size: 1.5rem; text-align: center; margin-bottom: 1rem;">AI Insights</h3>
                    <p style="text-align: center; color: var(--text-secondary);">
                        Get personalized financial tips and recommendations powered 
                        by artificial intelligence.
                    </p>
                </div>

                <div class="card">
                    <div class="icon-circle category">
                        <i class="bi bi-bar-chart-line"></i>
                    </div>
                    <h3 style="font-size: 1.5rem; text-align: center; margin-bottom: 1rem;">Detailed Reports</h3>
                    <p style="text-align: center; color: var(--text-secondary);">
                        Visualize your spending patterns with beautiful charts and 
                        comprehensive analytics.
                    </p>
                </div>

                <div class="card">
                    <div class="icon-circle income">
                        <i class="bi bi-trophy"></i>
                    </div>
                    <h3 style="font-size: 1.5rem; text-align: center; margin-bottom: 1rem;">Financial Goals</h3>
                    <p style="text-align: center; color: var(--text-secondary);">
                        Set savings goals and track your progress. Stay motivated 
                        with milestone achievements.
                    </p>
                </div>

                <div class="card">
                    <div class="icon-circle expense">
                        <i class="bi bi-shield-check"></i>
                    </div>
                    <h3 style="font-size: 1.5rem; text-align: center; margin-bottom: 1rem;">Secure & Private</h3>
                    <p style="text-align: center; color: var(--text-secondary);">
                        Your financial data is encrypted and protected with 
                        industry-standard security measures.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="section-spacing" style="background: var(--bg-secondary); margin-top: 0;">
        <div class="container-fluid">
            <div class="card card-elevated" style="text-align: center; padding: 4rem 2rem; background: linear-gradient(135deg, var(--primary-light) 0%, var(--bg-card) 100%);">
                <h2 style="margin-bottom: 1rem;">Ready to Transform Your Finances?</h2>
                <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem; font-size: 1.1rem;">
                    Join thousands of users who are already taking control of their financial future. 
                    Start your journey today – it's completely free!
                </p>
                <div class="error-actions">
                    <a href="/auth/signup.php" class="btn btn-primary">
                        <i class="bi bi-person-plus"></i>
                        Create Free Account
                    </a>
                    <a href="/auth/signin.php" class="btn btn-outline">
                        <i class="bi bi-box-arrow-in-right"></i>
                        Sign In
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container-fluid">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <i class="bi bi-tree-fill"></i>
                        <span>FinanceTracker</span>
                    </div>
                    <p class="footer-tagline">
                        Smart financial management for a better tomorrow
                    </p>
                </div>

                <div class="footer-links">
                    <div class="footer-column">
                        <h4>Product</h4>
                        <ul>
                            <li><a href="/auth/signup.php">Get Started</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="/auth/signin.php">Sign In</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> Smart Finance Tracker. All rights reserved.</p>
                <div class="footer-social">
                    <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                    <a href="#" aria-label="Twitter"><i class="bi bi-twitter"></i></a>
                    <a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
                </div>
            </div>
        </div>
    </footer>

    <script src="/assets/js/main.js"></script>
</body>

</html>