import React, { Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../../../components/templates/Layout';
import HeroSection from '../sections/HeroSection';
import FeaturesSection from '../sections/FeaturesSection';
import { AuthModal } from '../../auth';
import LoadingSpinner from '../../../components/atoms/LoadingSpinner';

const PipelineCarousel = React.lazy(() => import('../components/PipelineCarousel'));

const HomePage: React.FC = () => {
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = React.useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState<boolean>(false);

  useEffect(() => {
    // Check URL parameters for various states
    const urlParams = new URLSearchParams(location.search);
    const resetStatus = urlParams.get('reset');
    
    // Handle password reset success
    if (resetStatus === 'success') {
      setShowSuccessMessage(true);
      // Clean URL after showing message
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    }
    
    // Check if we should open the auth modal (e.g., from ProductPage redirect)
    if (location.state?.openAuthModal === true) {
      setAuthModalOpen(true);
      // Clear the state to prevent modal from opening again on subsequent visits
      window.history.replaceState({}, document.title);
    }
  }, []);

  return (
    <Layout>
      {/* Password Reset Success Banner */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-green-600 text-white py-3 px-4 text-center relative"
          role="alert"
          aria-live="polite"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                Password updated successfully! You can now sign in with your new password.
              </span>
            </div>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-white hover:text-green-200 transition-colors duration-200"
              aria-label="Close success message"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
      
      <HeroSection />

      <section className="py-20 bg-white" aria-labelledby="pipeline-demo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 id="pipeline-demo" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              See how it works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our intelligent pipeline transforms your documents through four seamless stages, delivering structured data ready for your applications.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Suspense
              fallback={(
                <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-gray-300">
                  <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <span className="text-sm text-gray-500">Loading interactive preview...</span>
                  </div>
                </div>
              )}
            >
              <PipelineCarousel />
            </Suspense>
          </motion.div>
        </div>
      </section>

      <FeaturesSection />

      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700" aria-labelledby="final-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 id="final-cta" className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Join the future of document processing
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Be among the first to experience next-generation document parsing. Join our beta program and help shape the future of intelligent data extraction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg">
                Join Beta Program
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200">
                Request Early Access
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">
              Early access • Beta program • Shape the product with us
            </p>
          </motion.div>
        </div>
      </section>
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signup"
      />
    </Layout>
  );
};

export default HomePage;

