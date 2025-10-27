// Authentication validation and helpers

// Toggle password visibility
function togglePassword(fieldId, iconId = 'toggleIcon') {
    const field = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);

    if (!field || !icon) return;

    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

// Password strength indicator (only for signup page)
document.addEventListener('DOMContentLoaded', function() {
    const passwordField = document.getElementById('password');
    const strengthDiv = document.getElementById('passwordStrength');

    // Only run if both elements exist (signup page)
    if (passwordField && strengthDiv) {
        passwordField.addEventListener('input', function(e) {
            const password = e.target.value;

            let strength = 0;
            let message = '';
            let color = '';

            if (password.length >= 8) strength++;
            if (/[a-z]/.test(password)) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^a-zA-Z0-9]/.test(password)) strength++;

            switch (strength) {
                case 0:
                case 1:
                    message = 'Weak password';
                    color = '#C88B7A';
                    break;
                case 2:
                case 3:
                    message = 'Medium password';
                    color = '#CFBB99';
                    break;
                case 4:
                case 5:
                    message = 'Strong password';
                    color = '#A8B89E';
                    break;
            }

            if (password.length > 0) {
                strengthDiv.innerHTML = `<div style="color: ${color}; font-size: 0.875rem; margin-top: 0.25rem;">${message}</div>`;
            } else {
                strengthDiv.innerHTML = '';
            }
        });
    }
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password);
}

// Real-time form validation (signin)
document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signinForm');

    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            let isValid = true;
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');

            // Clear previous errors
            emailError.textContent = '';
            passwordError.textContent = '';

            // Validate email
            if (!email) {
                emailError.textContent = 'Email is required';
                isValid = false;
            } else if (!validateEmail(email)) {
                emailError.textContent = 'Please enter a valid email';
                isValid = false;
            }

            // Validate password
            if (!password) {
                passwordError.textContent = 'Password is required';
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});

// Real-time form validation (signup)
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            let isValid = true;
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const terms = document.getElementById('terms').checked;

            // Get error elements
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            const confirmPasswordError = document.getElementById('confirmPasswordError');

            // Clear previous errors
            nameError.textContent = '';
            emailError.textContent = '';
            passwordError.textContent = '';
            confirmPasswordError.textContent = '';

            // Validate name
            if (!name) {
                nameError.textContent = 'Name is required';
                isValid = false;
            } else if (name.length < 2) {
                nameError.textContent = 'Name must be at least 2 characters';
                isValid = false;
            }

            // Validate email
            if (!email) {
                emailError.textContent = 'Email is required';
                isValid = false;
            } else if (!validateEmail(email)) {
                emailError.textContent = 'Please enter a valid email';
                isValid = false;
            }

            // Validate password
            if (!password) {
                passwordError.textContent = 'Password is required';
                isValid = false;
            } else if (!validatePassword(password)) {
                passwordError.textContent = 'Password must be at least 8 characters with uppercase, lowercase, and number';
                isValid = false;
            }

            // Validate password confirmation
            if (!confirmPassword) {
                confirmPasswordError.textContent = 'Please confirm your password';
                isValid = false;
            } else if (password !== confirmPassword) {
                confirmPasswordError.textContent = 'Passwords do not match';
                isValid = false;
            }

            // Validate terms
            if (!terms) {
                alert('You must accept the Terms of Service and Privacy Policy');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});

// Auto-dismiss alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(function() {
                alert.remove();
            }, 500);
        }, 5000);
    });
});