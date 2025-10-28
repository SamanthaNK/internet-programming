<?php
// Dashboard Page

session_start();

require_once __DIR__ . '/../config/db_connect.php';
require_once __DIR__ . '/../includes/auth_session.php';
require_once __DIR__ . '/../includes/functions.php';

// Require authentication - will redirect if not logged in
requireAuth();

// Set page-specific variables for header
$page_title = 'Dashboard - Smart Finance Tracker';
$current_page = 'dashboard';

include __DIR__ . '/../includes/header.php';
?>

<!-- Main Content -->
<div class="container-fluid section-spacing">
    <div class="page-transition">

        <!-- Page Header -->
        <div class="page-header">
            <h1>Dashboard</h1>
            <p>Your financial overview at a glance</p>
        </div>

        <!-- Stat Cards Grid -->
        <div class="stat-cards-grid">

            <!-- Total Income Card -->
            <div class="card stat-card stat-card-income">
                <div class="icon-circle income">
                    <i class="bi bi-arrow-down-circle"></i>
                </div>
                <div class="stat-label">Total Income</div>
                <div class="stat-value" style="color: var(--accent-sage);">XAF 0</div>
                <p class="stat-description">This month</p>
            </div>

            <!-- Total Expenses Card -->
            <div class="card stat-card stat-card-expense">
                <div class="icon-circle expense">
                    <i class="bi bi-arrow-up-circle"></i>
                </div>
                <div class="stat-label">Total Expenses</div>
                <div class="stat-value" style="color: var(--accent-terracotta);">XAF 0</div>
                <p class="stat-description">This month</p>
            </div>

            <!-- Current Savings Card -->
            <div class="card stat-card stat-card-savings">
                <div class="icon-circle savings">
                    <i class="bi bi-piggy-bank"></i>
                </div>
                <div class="stat-label">Current Savings</div>
                <div class="stat-value" style="color: var(--accent-seafoam);">XAF 0</div>
                <p class="stat-description">Balance</p>
            </div>

        </div>

        <!-- Welcome Card -->
        <div class="card welcome-card">
            <div class="welcome-card-icon">
                <i class="bi bi-graph-up-arrow"></i>
            </div>
            <h2>Welcome to Your Finance Tracker</h2>
            <p>
                Start managing your finances effectively. Track your income and expenses,
                set budgets, and achieve your financial goals.
            </p>
            <div class="welcome-card-actions">
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

        <!-- Dashboard Grid -->
        <div class="dashboard-grid">

            <!-- Recent Transactions Card -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="bi bi-clock-history"></i>
                        Recent Transactions
                    </h3>
                </div>
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="bi bi-inbox"></i>
                    </div>
                    <p>No transactions yet</p>
                    <p class="empty-state-description">
                        Start by adding your first transaction
                    </p>
                </div>
            </div>

            <!-- AI Financial Tip Card -->
            <div class="card" style="background: linear-gradient(135deg, #F0F6F5 0%, #E8F3F1 100%); border: 2px solid var(--accent-seafoam);">
                <div class="card-header" style="border-color: var(--accent-seafoam);">
                    <h3 class="card-title">
                        <i class="bi bi-lightbulb" style="color: var(--accent-seafoam);"></i>
                        AI Financial Tip
                    </h3>
                </div>
                <p style="color: var(--text-secondary); line-height: 1.8; margin: 0;">
                    <i class="bi bi-quote" style="font-size: 1.5rem; opacity: 0.3; margin-right: 0.5rem;"></i>
                    Start tracking your daily expenses to identify spending patterns.
                    Small purchases can add up quickly over time.
                </p>
            </div>

        </div>

    </div>
</div>

<?php
include __DIR__ . '/../includes/footer.php';
?>