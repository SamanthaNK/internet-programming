<?php
// Forgot Password page - updated to match sign in / sign up layout

session_start();

// Redirect to dashboard if already logged in
if (isset($_SESSION['user_id'])) {
	header('Location: ../pages/dashboard.php');
	exit();
}

require_once __DIR__ . '/../config/db_connect.php';
require_once __DIR__ . '/../includes/auth_session.php';

// Get messages from session (if set)
$errors = $_SESSION['reset_errors'] ?? [];
$success = $_SESSION['reset_success'] ?? '';
$dev_link = $_SESSION['reset_link'] ?? '';

// Clear session messages
unset($_SESSION['reset_errors'], $_SESSION['reset_success'], $_SESSION['reset_link']);

// Generate CSRF token
$csrf_token = generateCSRFToken();
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Forgot Password - Smart Finance Tracker</title>
	<link rel="stylesheet" href="../assets/css/style.css">
	<link rel="stylesheet" href="../assets/css/auth.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
	<link rel="stylesheet" href="../assets/css/forms.css">
</head>
<body class="auth-page">
	<div class="auth-container">
		<!-- Left side (branding) -->
		<aside class="auth-left">
			<div class="auth-branding">
				<div class="brand-icon">
					<i class="bi bi-tree-fill"></i>
				</div>
				<h1>Forgot your password?</h1>
				<p>Enter the email address associated with your account and we'll send a reset link.</p>

				<div class="auth-features">
					<div class="auth-feature">
						<i class="bi bi-check-circle-fill"></i>
						<span>Secure password resets</span>
					</div>
					<div class="auth-feature">
						<i class="bi bi-check-circle-fill"></i>
						<span>Links expire after 1 hour</span>
					</div>
					<div class="auth-feature">
						<i class="bi bi-check-circle-fill"></i>
						<span>We keep your data safe</span>
					</div>
				</div>
			</div>
		</aside>

		<!-- Right side (form) -->
		<main class="auth-right">
			<div class="auth-form-container">
				<header class="auth-header">
					<h2>Reset Password</h2>
					<p>We will send a link to your email with instructions to reset your password.</p>
				</header>

				<!-- Error Alert -->
				<?php if (!empty($errors)): ?>
					<div class="alert alert-error" role="alert">
						<i class="bi bi-exclamation-circle"></i>
						<div>
							<?php foreach ($errors as $err): ?>
								<p><?php echo htmlspecialchars($err); ?></p>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endif; ?>

				<!-- Success Alert -->
				<?php if (!empty($success)): ?>
					<div class="alert alert-success" role="alert">
						<i class="bi bi-check-circle"></i>
						<span><?php echo htmlspecialchars($success); ?></span>
					</div>
				<?php endif; ?>

				<form id="forgotForm" action="/auth/process/reset-password.php" method="post" class="auth-form">
					<input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">

					<div class="form-group">
						<label for="email" class="form-label">Email Address</label>
						<div class="input-with-icon">
							<i class="bi bi-envelope"></i>
							<input id="email" name="email" type="email" class="form-control" placeholder="your.email@example.com" required autocomplete="email" />
						</div>
						<span class="error-message" id="emailError" role="alert"></span>
					</div>

					<div class="form-options">
						<a href="/auth/signin.php" class="link-primary">Back to sign in</a>
					</div>

					<button type="submit" class="btn btn-primary btn-full">Send reset link</button>

					<div class="divider">
						<span>or</span>
					</div>

					<div class="auth-footer">
						<p>Remembered your password? <a href="/auth/signin.php" class="link-primary">Sign in</a></p>
					</div>
				</form>

				<?php if (!empty($dev_link)): ?>
					<!-- Developer convenience: show reset link when mailer is not configured -->
					<div class="meta" style="margin-top:12px;">
						<small>Dev reset link (mail not configured): <a href="<?php echo htmlspecialchars($dev_link); ?>" target="_blank">Open reset link</a></small>
					</div>
				<?php endif; ?>

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
