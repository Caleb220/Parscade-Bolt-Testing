import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Advanced chunking strategy
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes('node_modules')) {
            // Core React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }

            // UI and animation libraries
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('@radix-ui')) {
              return 'vendor-ui';
            }

            // Form handling
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'vendor-forms';
            }

            // Data fetching
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }

            // Backend services
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'vendor-supabase';
            }

            // Date handling
            if (id.includes('date-fns') || id.includes('dayjs') || id.includes('moment')) {
              return 'vendor-date';
            }

            // Utilities
            if (id.includes('lodash') || id.includes('ramda') || id.includes('clsx') || id.includes('class-variance-authority')) {
              return 'vendor-utils';
            }

            // Default vendor chunk for other node_modules
            return 'vendor-misc';
          }

          // Feature-based chunking for application code
          if (id.includes('src/features/auth')) {
            return 'feature-auth';
          }

          if (id.includes('src/features/dashboard')) {
            // Further split dashboard by page type
            if (id.includes('pages/Document') || id.includes('components/document')) {
              return 'feature-documents';
            }
            if (id.includes('pages/Job') || id.includes('components/job')) {
              return 'feature-jobs';
            }
            if (id.includes('pages/Project') || id.includes('components/project')) {
              return 'feature-projects';
            }
            return 'feature-dashboard';
          }

          if (id.includes('src/features/account')) {
            return 'feature-account';
          }

          if (id.includes('src/features/marketing')) {
            return 'feature-marketing';
          }

          // Shared components chunking
          if (id.includes('src/shared/components/error')) {
            return 'shared-error';
          }

          if (id.includes('src/shared/components/loading')) {
            return 'shared-loading';
          }

          if (id.includes('src/shared/components/ui')) {
            return 'shared-ui';
          }

          if (id.includes('src/shared/components')) {
            return 'shared-components';
          }

          if (id.includes('src/shared/hooks')) {
            return 'shared-hooks';
          }

          if (id.includes('src/lib')) {
            return 'app-lib';
          }
        },

        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;

          // Keep vendor chunks stable for better caching
          if (name.startsWith('vendor-')) {
            return `${name}.[hash].js`;
          }

          // Feature chunks
          if (name.startsWith('feature-')) {
            return `${name}.[hash].js`;
          }

          // Shared chunks
          if (name.startsWith('shared-')) {
            return `${name}.[hash].js`;
          }

          // Default chunking
          return 'chunks/[name].[hash].js';
        },

        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').pop();

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return 'images/[name].[hash][extname]';
          }

          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return 'fonts/[name].[hash][extname]';
          }

          return 'assets/[name].[hash][extname]';
        }
      }
    },
    chunkSizeWarningLimit: 500 // Lower limit to encourage smaller chunks
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@tanstack/react-query',
      'react-hook-form',
      'zod'
    ],
    exclude: ['lucide-react'],
    force: true, // Force optimization for better dev performance
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
