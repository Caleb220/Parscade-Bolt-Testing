import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-toast'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'vendor-supabase': ['@supabase/supabase-js'],
          
          // Feature chunks
          'auth': [
            'src/features/auth/context/AuthContext.tsx',
            'src/features/auth/components/AuthForm.tsx',
            'src/features/auth/components/AuthModal.tsx'
          ],
          'dashboard': [
            'src/features/dashboard/pages/DashboardPage.tsx',
            'src/features/dashboard/components/FileUploadZone.tsx',
            'src/features/dashboard/components/JobsList.tsx'
          ],
          'account': [
            'src/features/account/components/AccountLayout.tsx',
            'src/features/account/hooks/useAccountSettings.tsx'
          ],
          'marketing': [
            'src/features/marketing/sections/HeroSection.tsx',
            'src/features/marketing/sections/FeaturesSection.tsx',
            'src/features/marketing/components/PipelineCarousel.tsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600 // Slightly increase limit for remaining chunks
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
