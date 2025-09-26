import { motion } from 'framer-motion';
import React, { Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import LoadingSpinner from '@/shared/components/forms/atoms/LoadingSpinner';
import Layout from '@/shared/components/layout/templates/Layout';

import { AuthModal } from '../../auth';
import BetaCTASection from '../components/BetaCTASection';
import FeaturesSection from '../sections/FeaturesSection';
import HeroSection from '../sections/HeroSection';

const PipelineCarousel = React.lazy(() => import('../components/PipelineCarousel'));

const HomePage: React.FC = () => {
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = React.useState<boolean>(false);

  useEffect(() => {
    // Check if we should open the auth modal (e.g., from ProductPage redirect)
    if (location.state?.openAuthModal === true) {
      setAuthModalOpen(true);
      // Clear the state to prevent modal from opening again on subsequent visits
      window.history.replaceState({}, document.title);
    }
  }, []);

  return (
    <Layout>
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
            <h2
              id="pipeline-demo"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              See how it works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our intelligent pipeline transforms your documents through four seamless stages,
              delivering structured data ready for your applications.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Suspense
              fallback={
                <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-gray-300">
                  <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <span className="text-sm text-gray-500">Loading interactive preview...</span>
                  </div>
                </div>
              }
            >
              <PipelineCarousel />
            </Suspense>
          </motion.div>
        </div>
      </section>

      <FeaturesSection />

      <BetaCTASection />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signup"
      />
    </Layout>
  );
};

export default HomePage;
