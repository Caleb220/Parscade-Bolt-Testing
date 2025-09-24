import { motion } from 'framer-motion';
import React from 'react';

import { GlobalErrorBoundary, NetworkErrorBoundary } from '../../error';
import Footer from '../organisms/Footer';
import Header from '../organisms/Header';

import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <GlobalErrorBoundary level="app">
      <NetworkErrorBoundary>
        <div className={`min-h-screen flex flex-col ${className}`}>
          <GlobalErrorBoundary level="section">
            <Header />
          </GlobalErrorBoundary>

          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <GlobalErrorBoundary level="page">
              {children}
            </GlobalErrorBoundary>
          </motion.main>

          <GlobalErrorBoundary level="section">
            <Footer />
          </GlobalErrorBoundary>
        </div>
      </NetworkErrorBoundary>
    </GlobalErrorBoundary>
  );
};

export default Layout;