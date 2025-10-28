<?php
// Footer Include File Contains the site footer and closing HTML tags
?>
</main> <!-- Close main-content from header -->

<!-- Footer -->
<footer class="site-footer">
    <div class="container-fluid">
        <div class="footer-content">
            <!-- Footer Brand -->
            <div class="footer-brand">
                <div class="footer-logo">
                    <i class="bi bi-tree-fill"></i>
                    <span>FinanceTracker</span>
                </div>
                <p class="footer-tagline">
                    Smart financial management for a better tomorrow
                </p>
            </div>

            <!-- Footer Links -->
            <div class="footer-links">
                <div class="footer-column">
                    <h4>Product</h4>
                    <ul>
                        <li><a href="/pages/dashboard.php">Dashboard</a></li>
                        <li><a href="/pages/transactions.php">Transactions</a></li>
                        <li><a href="/pages/reports.php">Reports</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/pages/about.php">About Us</a></li>
                        <li><a href="/pages/contact.php">Contact</a></li>
                        <li><a href="/pages/privacy.php">Privacy Policy</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="/pages/faq.php">FAQ</a></li>
                        <li><a href="/pages/help.php">Help Center</a></li>
                        <li><a href="/pages/terms.php">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Footer Bottom -->
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

<!-- Scripts -->
<?php if (isset($additional_js)): ?>
    <?php foreach ($additional_js as $js): ?>
        <script src="<?php echo htmlspecialchars($js); ?>"></script>
    <?php endforeach; ?>
<?php endif; ?>
</body>

</html>