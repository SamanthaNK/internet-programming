import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function SessionTimeout() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'timeout';
  const { isDark, toggleTheme } = useTheme();

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
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4">
      <div className="max-w-2xl w-full">
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill text-xl`}></i>
          </button>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-12 text-center">
          <div className="w-32 h-32 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <i className={`bi bi-${current.icon} text-6xl text-primary-600 dark:text-primary-400`}></i>
          </div>

          <h1 className="text-4xl font-serif font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            {current.title}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
            {current.message}
          </p>

          <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
            <div className="flex items-start space-x-4">
              <i className={`bi bi-${reason === 'timeout' ? 'info-circle' : 'shield-check'} text-3xl text-primary-600 dark:text-primary-400 flex-shrink-0`}></i>
              <div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  {current.info.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {current.info.message}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/signin"
              className="flex items-center justify-center space-x-2 w-full py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-lg font-medium shadow-md"
            >
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Sign In Again</span>
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 w-full py-4 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition text-lg font-medium"
            >
              <i className="bi bi-house"></i>
              <span>Go to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionTimeout;