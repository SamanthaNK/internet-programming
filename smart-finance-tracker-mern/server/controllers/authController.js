const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require("nodemailer");

// Create JWT token
const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Configure email transporter
const createEmailTransporter = () => {
    // For Gmail
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false  // for development
        }
    });
};

// Send password reset email
const sendResetEmail = async (email, resetUrl) => {
    const transporter = createEmailTransporter();

    const mailOptions = {
        from: `"Finance Tracker" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request - Finance Tracker',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #2A2D22; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #354024 0%, #889063 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #FDFDFB; padding: 30px; border: 1px solid #E5E3DA; border-top: none; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background: #354024; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 500; }
                    .button:hover { background: #2A3319; }
                    .footer { text-align: center; margin-top: 30px; color: #8B8E82; font-size: 14px; }
                    .warning { background: #FFF3CD; border-left: 4px solid #FFC107; padding: 15px; margin: 20px 0; border-radius: 4px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; font-family: 'Cormorant Garamond', serif;">🌳 Finance Tracker</h1>
                        <p style="margin: 10px 0 0 0;">Password Reset Request</p>
                    </div>
                    <div class="content">
                        <h2 style="color: #354024; font-family: 'Cormorant Garamond', serif;">Reset Your Password</h2>
                        <p>You requested to reset your password for your Finance Tracker account.</p>
                        <p>Click the button below to reset your password. This link will expire in <strong>10 minutes</strong>.</p>

                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </div>

                        <p style="margin-top: 20px; font-size: 14px; color: #5F6355;">
                            Or copy and paste this link into your browser:<br>
                            <a href="${resetUrl}" style="color: #889063; word-break: break-all;">${resetUrl}</a>
                        </p>

                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong><br>
                            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                        </div>

                        <p style="margin-top: 30px; color: #8B8E82; font-size: 14px;">
                            This is an automated email. Please do not reply to this message.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Finance Tracker. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

// REGISTER: Create new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, currency } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            currency: currency || 'XAF'
        });

        // Generate token
        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    currency: user.currency
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user'
        });
    }
};

// LOGIN: Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user with password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = createToken(user._id);
        const loginTimestamp = Date.now();

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            loginTimestamp,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    currency: user.currency
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in user'
        });
    }
};

// GET ME: Get current user info
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                currency: user.currency
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        });
    }
};

// FORGOT PASSWORD: Generate reset token and send email
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if user exists for security
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token and save to user
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire time (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create reset URL (frontend)
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        // Send email
        const emailSent = await sendResetEmail(user.email, resetUrl);

        if (!emailSent) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            return res.status(500).json({
                success: false,
                message: 'Error sending password reset email. Please try again later.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'If an account exists with this email, a password reset link has been sent'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending password reset email'
        });
    }
};

// RESET PASSWORD: Reset password with token
exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a new password'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters'
            });
        }

        // Hash the token from URL
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Generate new token for automatic login
        const token = createToken(user._id);
        const loginTimestamp = Date.now();

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    currency: user.currency
                }
            }
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
};