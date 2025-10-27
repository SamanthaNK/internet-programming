<?php
// Forgot Password page
?>
<?php include_once __DIR__ . '/../includes/header.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Forgot Password - Smart Finance Tracker</title>
	<link rel="stylesheet" href="../assets/css/auth.css">
	<link rel="stylesheet" href="../assets/css/forms.css">
</head>
<body class="forgot-page">

<main class="forgot-container">
	<section class="forgot-card" role="region" aria-labelledby="forgot-title">
		<div class="brand">
			<div class="logo" aria-hidden="true"></div>
			<div>
				<span style="font-weight:700;color:var(--kombu);">Smart Finance</span>
				<div style="font-size:12px;color:var(--moss);margin-top:2px;">Tracker</div>
			</div>
		</div>

		<h1 id="forgot-title">Forgot your password?</h1>
		<p class="lead">Enter the email address associated with your account. We'll send a link to reset your password.</p>

		<form action="process/reset-password.php" method="post" novalidate>
			<label for="email">Email address</label>
			<input id="email" name="email" type="email" placeholder="you@example.com" required />

			<div class="actions">
				<button type="submit" class="btn-primary">Send reset link</button>
				<a href="signin.php" class="btn-secondary" role="button">Back to sign in</a>
			</div>
		</form>

		<div class="meta">
			<div style="margin-top:10px">Didn't receive the email? Check your spam folder or try again in a few minutes.</div>
		</div>
	</section>
</main>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>
</body>
</html>
