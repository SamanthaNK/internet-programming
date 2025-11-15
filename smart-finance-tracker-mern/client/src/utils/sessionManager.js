const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const CHECK_INTERVAL = 60 * 1000; // Check every minute

class SessionManager {
    constructor() {
        this.lastActivity = Date.now();
        this.loginTimestamp = null;
        this.timeoutCheckInterval = null;
        this.activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    }

    // Initialize session tracking
    init() {
        const token = localStorage.getItem('token');
        const storedLoginTime = localStorage.getItem('loginTimestamp');

        if (token && storedLoginTime) {
            this.loginTimestamp = parseInt(storedLoginTime);
            this.lastActivity = Date.now();
            this.startTracking();
        }
    }

    // Set login timestamp when user logs in
    setLoginTimestamp(timestamp) {
        this.loginTimestamp = timestamp || Date.now();
        this.lastActivity = Date.now();
        localStorage.setItem('loginTimestamp', this.loginTimestamp.toString());
        this.startTracking();
    }

    // Update last activity time
    updateActivity() {
        this.lastActivity = Date.now();
    }

    // Start tracking user activity and session timeout
    startTracking() {
        this.activityEvents.forEach(event => {
            document.addEventListener(event, this.handleActivity.bind(this), true);
        });

        // Start interval to check for timeout
        if (this.timeoutCheckInterval) {
            clearInterval(this.timeoutCheckInterval);
        }

        this.timeoutCheckInterval = setInterval(() => {
            this.checkTimeout();
        }, CHECK_INTERVAL);
    }

    // Handle user activity
    handleActivity() {
        this.updateActivity();
    }

    // Check if session has timed out
    checkTimeout() {
        const now = Date.now();
        const timeSinceActivity = now - this.lastActivity;

        if (timeSinceActivity >= SESSION_TIMEOUT) {
            this.handleTimeout();
        }
    }

    // Handle session timeout
    handleTimeout() {
        console.log('Session timeout detected');
        this.cleanup();

        // Clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');

        // Redirect to timeout page
        window.location.href = '/session-timeout?reason=timeout';
    }

    // Get time remaining in session (in milliseconds)
    getTimeRemaining() {
        const now = Date.now();
        const timeSinceActivity = now - this.lastActivity;
        const remaining = SESSION_TIMEOUT - timeSinceActivity;
        return remaining > 0 ? remaining : 0;
    }

    // Get formatted time remaining
    getFormattedTimeRemaining() {
        const remaining = this.getTimeRemaining();
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }

    // Check if session is still valid
    isSessionValid() {
        return this.getTimeRemaining() > 0;
    }

    // Stop tracking (call on logout)
    cleanup() {
        this.activityEvents.forEach(event => {
            document.removeEventListener(event, this.handleActivity.bind(this), true);
        });

        if (this.timeoutCheckInterval) {
            clearInterval(this.timeoutCheckInterval);
            this.timeoutCheckInterval = null;
        }

        this.lastActivity = null;
        this.loginTimestamp = null;
    }

    // Manual logout
    logout() {
        this.cleanup();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
    }
}

const sessionManager = new SessionManager();

export default sessionManager;