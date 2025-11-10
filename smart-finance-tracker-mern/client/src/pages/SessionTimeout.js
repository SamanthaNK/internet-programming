import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/auth.css';

function SessionTimeout() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'timeout';

  // Content based on reason
  const content = {
    timeout: {
      icon: 'clock-history',
      title: 'Session Expired',
      message: 'Your session has expired for security reasons. Please sign in again to continue.',
      info: {
        title: 'Why did this happen?',
        message: 'For your security, we automatically sign you out after 30 minutes of inactivity.'
      }
    },
    logout: {
      icon: 'box-arrow-right',
      title: 'Signed Out',
      message: 'You have been successfully signed out. Come back soon!',
      info: {
        title: 'Your data is secure',
        message: 'All your financial information has been safely logged out and protected.'
      }
    }
  };

  const current = content[reason] || content.timeout;

  return (
    <div className="auth-page">
      <div className="auth-page-wrapper">
        <div className="auth-content-center">
          <div className="auth-card session-card">
            <div className="session-icon-wrapper">
              <i className={`bi bi-${current.icon}`}></i>
            </div>

            <h1 className="session-title">{current.title}</h1>
            <p className="session-message">{current.message}</p>

            <div className="session-info-card">
              <i className={`bi bi-${reason === 'timeout' ? 'info-circle' : 'shield-check'}`}></i>
              <div className="session-info-content">
                <h3>{current.info.title}</h3>
                <p>{current.info.message}</p>
              </div>
            </div>

            <div className="session-actions">
              <Link to="/signin" className="btn btn-primary btn-full">
                <i className="bi bi-box-arrow-in-right"></i>
                Sign In Again
              </Link>
              <Link to="/" className="btn btn-secondary btn-full">
                <i className="bi bi-house"></i>
                Go to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="decorative-elements">
          <div className="leaf leaf-1">
            <i className="bi bi-leaf"></i>
          </div>
          <div className="leaf leaf-2">
            <i className="bi bi-flower1"></i>
          </div>
          <div className="leaf leaf-3">
            <i className="bi bi-droplet"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionTimeout;