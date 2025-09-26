// vite.config.ts - Optimized for performance and bundle splitting
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    // Add gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Add brotli compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    // Bundle analyzer (only in analyze mode)
    process.env.ANALYZE && visualizer({
      open: true,
      filename: 'dist/bundle-analysis.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),

  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap: false,
    chunkSizeWarningLimit: 250,
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // UI libraries
            if (id.includes('@radix-ui') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
            // Data management
            if (id.includes('@tanstack') || id.includes('@supabase')) {
              return 'data-vendor';
            }
            // Form handling
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'form-vendor';
            }
            // Icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Other vendors
            return 'vendor';
          }

          // Feature-based chunking for app code
          if (id.includes('/src/features/dashboard/')) {
            // Split large dashboard pages into separate chunks
            if (id.includes('CommandCentrePage')) return 'command-centre';
            if (id.includes('DashboardPage')) return 'dashboard-main';
            return 'dashboard';
          }
          if (id.includes('/src/features/auth/')) {
            return 'auth';
          }
          if (id.includes('/src/features/marketing/')) {
            return 'marketing';
          }
          if (id.includes('/src/features/account/')) {
            return 'account';
          }
          if (id.includes('/src/shared/components/brand/')) {
            return 'brand-components';
          }
          if (id.includes('/src/shared/components/ui/')) {
            return 'ui-components';
          }
        },

        // Asset naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },

      // Tree shaking optimization
      treeshake: {
        preset: 'recommended',
        manualPureFunctions: ['console.log', 'console.warn'],
      },
    },
  },

  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },

  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': '/src',
      '@/app': '/src/app',
      '@/shared': '/src/shared',
      '@/features': '/src/features',
      '@/lib': '/src/lib',
      '@/components': '/src/components',
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-remove-scroll',
      'react-remove-scroll-bar',
      'use-sidecar',
      'react-style-singleton',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'framer-motion',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },

  // Performance optimizations
  server: {
    hmr: {
      overlay: true,
    },
  },

  // CSS optimization
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});