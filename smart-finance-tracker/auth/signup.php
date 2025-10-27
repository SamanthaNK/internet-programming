<?php
// Sign up page

session_start();

// Redirect to dashboard if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: ../pages/dashboard.php');
    exit();
}

require_once __DIR__ . '/../config/db_connect.php';
require_once __DIR__ . '/../includes/auth_session.php';

$error = '';
$errors = $_SESSION['signup_errors'] ?? [];
$old_values = [
    'name' => $_SESSION['signup_name'] ?? '',
    'email' => $_SESSION['signup_email'] ?? ''
];

unset($_SESSION['signup_errors'], $_SESSION['signup_name'], $_SESSION['signup_email']);

// Generate CSRF token
$csrf_token = generateCSRFToken();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - Smart Finance Tracker</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="../assets/css/auth.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
</head>

<body>
    <div class="auth-container">
        <!-- Left Side - Branding -->
        <div class="auth-left">
            <div class="auth-branding">
                <div class="brand-icon">
                    <i class="bi bi-seedling"></i>
                </div>
                <h1>Start Your Financial<br>Journey Today</h1>
                <p>Join thousands who are taking control of their finances. Create your free account and start building a better financial future.</p>

                <div class="auth-features">
                    <div class="auth-feature">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Track income and expenses effortlessly</span>
                    </div>
                    <div class="auth-feature">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Get AI-powered financial insights</span>
                    </div>
                    <div class="auth-feature">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Set and achieve savings goals</span>
                    </div>
                    <div class="auth-feature">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Generate detailed reports</span>
                    </div>
                </div>
            </div>

            <!-- Decorative Elements -->
            <div class="decorative-elements">
                <div class="leaf leaf-1"><i class="bi bi-flower2"></i></div>
                <div class="leaf leaf-2"><i class="bi bi-leaf"></i></div>
            </div>
        </div>

        <!-- Right Side - Form -->
        <div class="auth-right">
            <div class="auth-form-container">
                <div class="auth-header">
                    <h2>Sign Up</h2>
                    <p>Create your free account</p>
                </div>

                <?php if (!empty($errors)): ?>
                    <div class="alert alert-error">
                        <i class="bi bi-exclamation-circle"></i>
                        <div>
                            <?php foreach ($errors as $err): ?>
                                <p><?php echo htmlspecialchars($err); ?></p>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>

                <form id="signupForm" action="/auth/process/signup-process.php" method="POST" class="auth-form">
                    <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">

                    <div class="form-group">
                        <label for="name">Full Name <span class="required">*</span></label>
                        <div class="input-with-icon">
                            <i class="bi bi-person"></i>
                            <input type="text"
                                id="name"
                                name="name"
                                class="form-control"
                                placeholder="John Doe"
                                value="<?php echo htmlspecialchars($old_values['name']); ?>"
                                required
                                autocomplete="name">
                        </div>
                        <span class="error-message" id="nameError"></span>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address <span class="required">*</span></label>
                        <div class="input-with-icon">
                            <i class="bi bi-envelope"></i>
                            <input type="email"
                                id="email"
                                name="email"
                                class="form-control"
                                placeholder="your.email@example.com"
                                value="<?php echo htmlspecialchars($old_values['email']); ?>"
                                required
                                autocomplete="email">
                        </div>
                        <span class="error-message" id="emailError"></span>
                    </div>

                    <div class="form-group">
                        <label for="password">Password <span class="required">*</span></label>
                        <div class="input-with-icon">
                            <i class="bi bi-lock"></i>
                            <input type="password"
                                id="password"
                                name="password"
                                class="form-control"
                                placeholder="••••••••"
                                required
                                autocomplete="new-password">
                            <button type="button" class="toggle-password" onclick="togglePassword('password', 'toggleIcon1')">
                                <i class="bi bi-eye" id="toggleIcon1"></i>
                            </button>
                        </div>
                        <span class="error-message" id="passwordError"></span>
                        <div id="passwordStrength"></div>
                        <small class="input-hint">At least 8 characters with uppercase, lowercase, and number</small>
                    </div>

                    <div class="form-group">
                        <label for="confirm_password">Confirm Password <span class="required">*</span></label>
                        <div class="input-with-icon">
                            <i class="bi bi-lock-fill"></i>
                            <input type="password"
                                id="confirm_password"
                                name="confirm_password"
                                class="form-control"
                                placeholder="••••••••"
                                required
                                autocomplete="new-password">
                            <button type="button" class="toggle-password" onclick="togglePassword('confirm_password', 'toggleIcon2')">
                                <i class="bi bi-eye" id="toggleIcon2"></i>
                            </button>
                        </div>
                        <span class="error-message" id="confirmPasswordError"></span>
                    </div>

                    <div class="form-group">
                        <label for="currency">Preferred Currency</label>
                        <div class="input-with-icon">
                            <i class="bi bi-cash"></i>
                            <select id="currency" name="currency">
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="XAF" selected>XAF - Central African CFA Franc</option>
                                <option value="NGN">NGN - Nigerian Naira</option>
                                <option value="ZAR">ZAR - South African Rand</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-options">
                        <label class="checkbox-label">
                            <input type="checkbox" name="terms" id="terms" required>
                            <span>I agree to the <a href="#" class="link-primary">Terms of Service</a> and <a href="#" class="link-primary">Privacy Policy</a></span>
                        </label>
                    </div>

                    <button type="submit" class="btn btn-primary btn-full">
                        <i class="bi bi-person-plus"></i>
                        Create Account
                    </button>

                    <div class="divider">
                        <span>or</span>
                    </div>

                    <button type="button" class="btn btn-social btn-google">
                        <i class="bi bi-google"></i>
                        Sign up with Google
                    </button>

                    <div class="auth-footer">
                        <p>Already have an account? <a href="/auth/signin.php" class="link-primary">Sign in</a></p>
                    </div>
                </form>

                <div class="back-home">
                    <a href="../index.php" class="link-secondary">
                        <i class="bi bi-arrow-left"></i> Back to Home
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script src="../assets/js/auth.js"></script>
</body>

</html>