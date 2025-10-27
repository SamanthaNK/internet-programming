<?php
// Dashboard Page

session_start();

require_once __DIR__ . '/../config/db_connect.php';
require_once __DIR__ . '/../includes/auth_session.php';
require_once __DIR__ . '/../includes/functions.php';

// Require authentication
requireAuth();

// Get current user data
$user = getCurrentUser();
$user_name = $user['name'] ?? 'User';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Smart Finance Tracker</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>

<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container-fluid">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div class="navbar-brand">
                    <i class="bi bi-tree-fill" style="margin-right: 0.5rem; color: var(--primary-moss);"></i>
                    FinanceTracker
                </div>
                
                <div style="display: flex; align-items: center; gap: 2rem;">
                    <div style="font-family: 'Montserrat', sans-serif; color: var(--text-secondary); font-size: 0.95rem;">
                        <i class="bi bi-person-circle" style="margin-right: 0.5rem; font-size: 1.2rem;"></i>
                        Welcome, <strong style="color: var(--primary-kombu);"><?php echo htmlspecialchars($user_name); ?></strong>
                    </div>
                    
                    <a href="/auth/logout.php" class="btn btn-outline" style="padding: 0.625rem 1.5rem;">
                        <i class="bi bi-box-arrow-right"></i>
                        Logout
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container-fluid section-spacing">
        <div class="page-transition">
            <!-- Page Header -->
            <div style="margin-bottom: 3rem;">
                <h1>Dashboard</h1>
                <p style="font-size: 1.1rem; color: var(--text-secondary); margin: 0;">
                    Your financial overview at a glance
                </p>
            </div>

            <!-- Stat Cards Row -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
                <!-- Total Income Card -->
                <div class="card stat-card stat-card-income">
                    <div class="icon-circle income" style="margin: 0 auto 1rem;">
                        <i class="bi bi-arrow-down-circle"></i>
                    </div>
                    <div class="stat-label">Total Income</div>
                    <div class="stat-value" style="color: var(--accent-sage);">XAF 0</div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">This month</p>
                </div>

                <!-- Total Expenses Card -->
                <div class="card stat-card stat-card-expense">
                    <div class="icon-circle expense" style="margin: 0 auto 1rem;">
                        <i class="bi bi-arrow-up-circle"></i>
                    </div>
                    <div class="stat-label">Total Expenses</div>
                    <div class="stat-value" style="color: var(--accent-terracotta);">XAF 0</div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">This month</p>
                </div>

                <!-- Current Savings Card -->
                <div class="card stat-card stat-card-savings">
                    <div class="icon-circle" style="margin: 0 auto 1rem; background-color: #E8F3F1; color: var(--accent-seafoam);">
                        <i class="bi bi-piggy-bank"></i>
                    </div>
                    <div class="stat-label">Current Savings</div>
                    <div class="stat-value" style="color: var(--accent-seafoam);">XAF 0</div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Balance</p>
                </div>
            </div>

            <!-- Welcome Card -->
            <div class="card" style="text-align: center; padding: 3rem 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1.5rem;">
                    <i class="bi bi-graph-up-arrow" style="color: var(--primary-moss);"></i>
                </div>
                <h2 style="margin-bottom: 1rem;">Welcome to Your Finance Tracker</h2>
                <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem; line-height: 1.8;">
                    Start managing your finances effectively. Track your income and expenses, set budgets, and achieve your financial goals.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary">
                        <i class="bi bi-plus-circle"></i>
                        Add Transaction
                    </button>
                    <button class="btn btn-secondary">
                        <i class="bi bi-bar-chart"></i>
                        View Reports
                    </button>
                </div>
            </div>

            <!-- Quick Info Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
                <!-- Recent Transactions -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="bi bi-clock-history" style="margin-right: 0.5rem; color: var(--primary-moss);"></i>
                            Recent Transactions
                        </h3>
                    </div>
                    <div style="text-align: center; padding: 2rem 0; color: var(--text-muted);">
                        <i class="bi bi-inbox" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                        <p style="margin: 0;">No transactions yet</p>
                        <p style="font-size: 0.9rem; margin: 0.5rem 0 0;">Start by adding your first transaction</p>
                    </div>
                </div>

                <!-- AI Financial Tip -->
                <div class="card" style="background: linear-gradient(135deg, #F0F6F5 0%, #E8F3F1 100%); border: 2px solid var(--accent-seafoam);">
                    <div class="card-header" style="border-color: var(--accent-seafoam);">
                        <h3 class="card-title">
                            <i class="bi bi-lightbulb" style="margin-right: 0.5rem; color: var(--accent-seafoam);"></i>
                            AI Financial Tip
                        </h3>
                    </div>
                    <div style="padding: 0.5rem 0;">
                        <p style="color: var(--text-secondary); line-height: 1.8; margin: 0;">
                            <i class="bi bi-quote" style="font-size: 1.5rem; opacity: 0.3; margin-right: 0.5rem;"></i>
                            Start tracking your daily expenses to identify spending patterns. Small purchases can add up quickly over time.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Footer -->
    <footer style="background: var(--bg-secondary); border-top: 1px solid var(--border-primary); padding: 2rem 0; margin-top: 4rem;">
        <div class="container-fluid">
            <div style="text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                <p style="margin: 0;">© 2025 Smart Finance Tracker. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>

</html>