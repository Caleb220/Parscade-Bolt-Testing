import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PublicAuthLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Minimal layout for authentication flows (password reset, recovery).
 * 
 * DESIGN RATIONALE:
 * - No navigation bar or user chrome to avoid confusion during auth flows
 * - Clean, focused experience that feels secure and standalone
 * - Prevents users from navigating away during sensitive operations
 * - Matches industry standards for password reset UX (Google, GitHub, etc.)
 */
const PublicAuthLayout: React.FC<PublicAuthLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {children}
      </motion.div>
      
      {/* Subtle branding without navigation */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-500">
        Parscade
      </div>
    </div>
  );
};

export default PublicAuthLayout;