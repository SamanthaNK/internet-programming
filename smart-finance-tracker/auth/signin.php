<?php
// Sign In Page

session_start();

// Redirect to dashboard if already logged in
if (isset($_SESSION['user_id'])) {
    header("Location: /pages/dashboard.php");
    exit();
}

require_once __DIR__ . '/../config/db_connect.php';
require_once __DIR__ . '/../includes/auth_session.php';

$error = '';
$success = '';

// Handle query parameters
if (isset($_GET['error'])) {
    switch ($_GET['error']) {
        case 'login_required':
            $error = 'Please sign in to access that page.';
            break;
        case 'invalid_credentials':
            $error = 'Invalid email or password.';
            break;
        default:
            $error = 'An error occurred. Please try again.';
    }
}

if (isset($_GET['success'])) {
    if ($_GET['success'] === 'registered') {
        $success = 'Account created successfully! Please sign in.';
    } elseif ($_GET['success'] === 'password_reset') {
        $success = 'Password reset successfully! Please sign in.';
    }
}

// Generate CSRF token
$csrf_token = generateCSRFToken();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - Smart Finance Tracker</title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/auth.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
</head>

<body class="auth-page">
    <div class="auth-container">
        <!-- Left side -->
        <aside class="auth-left">
            <div class="auth-branding">
                <div class="brand-icon">
                    <i class="bi bi-tree-fill"></i>
                </div>
                <h1>Welcome Back to<br>FinanceTracker</h1>
                <p>Continue managing your finances with ease</p>

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
                <div class="leaf leaf-1"><i class="bi bi-leaf"></i></div>
                <div class="leaf leaf-2"><i class="bi bi-flower1"></i></div>
            </div>
        </aside>

        <!-- Right Side(form) -->
        <main class="auth-right">
            <div class="auth-form-container">
                <header class="auth-header">
                    <h2>Sign In</h2>
                    <p>Access your account</p>
                </header>
                <!-- Error Alert -->
                <?php if ($error): ?>
                    <div class="alert alert-error" role="alert">
                        <i class="bi bi-exclamation-circle"></i>
                        <span><?php echo htmlspecialchars($error); ?></span>
                    </div>
                <?php endif; ?>
                <!-- Success Alert -->
                <?php if ($success): ?>
                    <div class="alert alert-success" role="alert">
                        <i class="bi bi-check-circle"></i>
                        <span><?php echo htmlspecialchars($success); ?></span>
                    </div>
                <?php endif; ?>

                <form id="signinForm" action="/auth/process/signin-process.php" method="POST" class="auth-form">
                    <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">

                    <div class="form-group">
                        <label for="email" class="form-label">Email Address</label>
                        <div class="input-with-icon">
                            <i class="bi bi-envelope"></i>
                            <input type="email"
                                id="email"
                                name="email"
                                class="form-control"
                                placeholder="your.email@example.com"
                                required
                                autocomplete="email"
                                aria-describedby="emailError">
                        </div>
                        <span class="error-message" id="emailError" role="alert"></span>
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label">Password</label>
                        <div class="input-with-icon">
                            <i class="bi bi-lock"></i>
                            <input type="password"
                                id="password"
                                name="password"
                                class="form-control"
                                placeholder="••••••••" required
                                autocomplete="current-password"
                                aria-describedby="passwordError">
                            <button type="button" class="toggle-password" onclick="togglePassword('password')" aria-label="Toggle password visibility">
                                <i class="bi bi-eye" id="toggleIcon"></i>
                            </button>
                        </div>
                        <span class="error-message" id="passwordError" role="alert"></span>
                    </div>

                    <div class="form-options">
                        <label class="checkbox-label">
                            <input type="checkbox" name="remember" id="remember">
                            <span>Remember me</span>
                        </label>
                        <a href="/auth/forgot-password.php" class="link-primary">Forgot password?</a>
                    </div>

                    <button type="submit" class="btn btn-primary btn-full">
                        <i class="bi bi-box-arrow-in-right"></i>
                        Sign In
                    </button>

                    <div class="divider">
                        <span>or</span>
                    </div>

                    <button type="button" class="btn btn-social btn-google">
                        <i class="bi bi-google"></i>
                        Continue with Google
                    </button>

                    <div class="auth-footer">
                        <p>Don't have an account? <a href="/auth/signup.php" class="link-primary">Create one</a></p>
                    </div>
                </form>

                <div class="back-home">
                    <a href="../index.php" class="link-secondary">
                        <i class="bi bi-arrow-left"></i> Back to Home
                    </a>
                </div>
            </div>
        </main>
    </div>
    <script src="../assets/js/auth.js"></script>
</body>

</html>