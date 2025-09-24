import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth';

interface BetaCTASectionProps {
  readonly title?: string;
  readonly description?: string;
  readonly primaryButtonText?: string;
  readonly secondaryButtonText?: string;
}

const BetaCTASection: React.FC<BetaCTASectionProps> = ({
  title = "Ready to shape the future with us?",
  description = "Join our beta program and be among the first to experience next-generation document processing.",
  primaryButtonText,
  secondaryButtonText,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleJoinBetaClick = (): void => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/', { state: { openAuthModal: true } });
    }
  };

  const handleSecondaryClick = (): void => {
    if (isAuthenticated) {
      navigate('/product');
    } else {
      navigate('/', { state: { openAuthModal: true } });
    }
  };

  const getPrimaryButtonText = (): string => {
    if (primaryButtonText) return primaryButtonText;
    return isAuthenticated ? 'Go to Dashboard' : 'Join Beta Program';
  };

  const getSecondaryButtonText = (): string => {
    if (secondaryButtonText) return secondaryButtonText;
    return isAuthenticated ? 'View Features' : 'Request Access';
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {title}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleJoinBetaClick}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg border-2 border-white"
            >
              {getPrimaryButtonText()}
            </button>
            <button
              onClick={handleSecondaryClick}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200 bg-transparent"
            >
              {getSecondaryButtonText()}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BetaCTASection;