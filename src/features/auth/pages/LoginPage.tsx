import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info } from 'lucide-react';
import AuthForm from '../components/AuthForm';
import PublicAuthLayout from '../../../components/templates/PublicAuthLayout';
import { useAuth } from '../context/AuthContext';
import { PATHS } from '../../../routes/paths';

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  // Check for logout confirmation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const loggedOut = urlParams.get('logged_out');
    
    if (loggedOut === '1') {
      setShowLogoutMessage(true);
      // Clean URL after showing message
      window.history.replaceState({}, document.title, PATHS.LOGIN);
      
      // Auto-hide logout message after 8 seconds
      setTimeout(() => {
        setShowLogoutMessage(false);
      }, 8000);
    }
  }, [location.search]);

  // Redirect authenticated users to dashboard or intended destination
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const intendedDestination = location.state?.from?.pathname || PATHS.DASHBOARD;
      navigate(intendedDestination, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state]);

  const handleAuthSuccess = () => {
    const intendedDestination = location.state?.from?.pathname || PATHS.DASHBOARD;
    navigate(intendedDestination, { replace: true });
  };

  if (isLoading) {
    return (
      <PublicAuthLayout>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </PublicAuthLayout>
    );
  }

  return (
    <PublicAuthLayout>
      <div className="space-y-6">
        {/* Logout Success Banner */}
        <AnimatePresence>
          {showLogoutMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  You've been signed out successfully
                </span>
                <button
                  onClick={() => setShowLogoutMessage(false)}
                  className="ml-auto text-green-600 hover:text-green-700"
                  aria-label="Dismiss message"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <AuthForm
            mode="signin"
            onModeChange={() => {}} // Single mode for dedicated login page
            onSuccess={handleAuthSuccess}
          />
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate(PATHS.HOME)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Join our beta program
              </button>
            </p>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help signing in?{' '}
            <button
              onClick={() => navigate(PATHS.LOGIN_SUPPORT)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Get support
            </button>
          </p>
        </div>
      </div>
    </PublicAuthLayout>
  );
};

export default LoginPage;