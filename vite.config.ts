// vite.config.ts - Enterprise-grade build configuration with bulletproof error handling
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import compression from 'vite-plugin-compression';
import path from 'path';
import fs from 'fs';

// Helper to ensure clean cache
const cleanCache = () => {
  const cacheDir = path.resolve(__dirname, 'node_modules/.vite');
  if (fs.existsSync(cacheDir)) {
    try {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('✅ Vite cache cleared');
    } catch (e) {
      console.warn('⚠️ Could not clear cache:', e);
    }
  }
};

// Clean cache if build fails
if (process.env.VITE_CLEAN_CACHE === 'true') {
  cleanCache();
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isAnalyze = process.env.ANALYZE === 'true';

  return {
    plugins: [
      react(),
      // Add compression only in production
      ...(isProd ? [
        compression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 1024,
          deleteOriginFile: false,
        }),
        compression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 1024,
          deleteOriginFile: false,
        }),
      ] : []),
      // Bundle analyzer (only in analyze mode)
      isAnalyze && visualizer({
        open: true,
        filename: 'dist/bundle-analysis.html',
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
    ].filter(Boolean),

    build: {
      target: 'es2020',
      minify: isProd ? 'terser' : false,
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
          passes: 2,
        },
        format: {
          comments: false,
        },
      } : undefined,
      sourcemap: isDev,
      chunkSizeWarningLimit: 500,
      reportCompressedSize: false,
      // Improve build consistency
      commonjsOptions: {
        transformMixedEsModules: true,
        strictRequires: true,
      },
      rollupOptions: {
        // Handle external dependencies properly
        external: [],
        // Ensure React is available as a shared dependency
        preserveEntrySignatures: 'strict',
        output: {
          // Manual chunks for better code splitting
          manualChunks: (id) => {
            // Normalize path for Windows compatibility
            const normalizedId = id.replace(/\\/g, '/');
            // Vendor chunks
            if (normalizedId.includes('node_modules')) {
              // Core React dependencies - must be loaded first
              if (normalizedId.includes('react-dom')) {
                return 'react-core';
              }
              if (normalizedId.includes('react') && !normalizedId.includes('react-router') && !normalizedId.includes('@radix-ui')) {
                return 'react-core';
              }
              // React Router - separate chunk
              if (normalizedId.includes('react-router')) {
                return 'react-router';
              }
              // UI libraries
              if (normalizedId.includes('@radix-ui') || normalizedId.includes('framer-motion')) {
                return 'ui-vendor';
              }
              // Data management
              if (normalizedId.includes('@tanstack')) {
                return 'tanstack-query';
              }
              if (normalizedId.includes('@supabase')) {
                return 'supabase';
              }
              // Form handling
              if (normalizedId.includes('react-hook-form') || normalizedId.includes('zod')) {
                return 'form-vendor';
              }
              // Icons
              if (normalizedId.includes('lucide-react')) {
                return 'icons';
              }
              // Monitoring
              if (normalizedId.includes('@sentry')) {
                return 'monitoring';
              }
              // Other vendors
              return 'vendor';
            }

            // Feature-based chunking for app code
            if (normalizedId.includes('/src/features/dashboard/')) {
              // Split large dashboard features
              if (normalizedId.includes('CommandCentrePage') || normalizedId.includes('command-centre')) {
                return 'command-centre';
              }
              if (normalizedId.includes('DashboardPage') || normalizedId.includes('overview')) {
                return 'dashboard-main';
              }
              if (normalizedId.includes('visualization') || normalizedId.includes('charts')) {
                return 'dashboard-viz';
              }
              return 'dashboard';
            }
            if (normalizedId.includes('/src/features/auth/')) {
              return 'auth';
            }
            if (normalizedId.includes('/src/features/marketing/')) {
              return 'marketing';
            }
            if (normalizedId.includes('/src/features/account/')) {
              return 'account';
            }
            if (normalizedId.includes('/src/features/jobs/')) {
              return 'jobs';
            }
            // Shared components
            if (normalizedId.includes('/src/shared/components/')) {
              if (normalizedId.includes('/brand/')) return 'brand-components';
              if (normalizedId.includes('/ui/')) return 'ui-components';
              if (normalizedId.includes('/forms/')) return 'form-components';
              return 'shared-components';
            }
            // Core libraries
            if (normalizedId.includes('/src/lib/')) {
              if (normalizedId.includes('/api/')) return 'api-client';
              if (normalizedId.includes('/auth/')) return 'auth-lib';
              return 'lib';
            }
          },

          // Asset naming for better caching
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name ? assetInfo.name.split('.') : [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: (chunkInfo) => {
            // Ensure React core is loaded first with a predictable name
            if (chunkInfo.name === 'react-core') {
              return 'js/01-react-core-[hash].js';
            }
            return 'js/[name]-[hash].js';
          },
          entryFileNames: 'js/[name]-[hash].js',
          // Ensure consistent chunk generation
          generatedCode: {
            preset: 'es2015',
            constBindings: true,
          },
        },

        // Tree shaking optimization
        treeshake: {
          preset: 'recommended',
          moduleSideEffects: 'no-external',
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
        // Prevent memory issues during build
        maxParallelFileOps: 5,
      },
      // Clear output directory before build
      emptyOutDir: true,
      // Improve CSS handling
      cssCodeSplit: true,
      cssMinify: isProd,
      assetsInlineLimit: 4096,
    },

    define: {
      global: 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(mode),
      'import.meta.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
      'import.meta.env.BUILD_VERSION': JSON.stringify(process.env.npm_package_version || '0.0.0'),
    },

    resolve: {
      dedupe: ['react', 'react-dom', 'react-router-dom', 'react/jsx-runtime'],
      // Explicitly set React aliases to prevent duplicate instances
      alias: {
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
        'react/jsx-dev-runtime': path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime'),
        '@': path.resolve(__dirname, './src'),
        '@/app': path.resolve(__dirname, './src/app'),
        '@/shared': path.resolve(__dirname, './src/shared'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/lib': path.resolve(__dirname, './src/lib'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/types': path.resolve(__dirname, './src/types'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      // Improve module resolution
      mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-router-dom',
        'react-remove-scroll',
        'react-remove-scroll-bar',
        'use-sidecar',
        'react-style-singleton',
        '@tanstack/react-query',
        '@supabase/supabase-js',
        'framer-motion',
        'lucide-react',
        'zod',
        'react-hook-form',
        '@hookform/resolvers',
        '@radix-ui/react-dialog',
        '@radix-ui/react-label',
        '@radix-ui/react-select',
        '@radix-ui/react-switch',
        '@radix-ui/react-toast',
        '@radix-ui/react-avatar',
        '@radix-ui/react-slot',
        '@radix-ui/react-primitive',
        '@radix-ui/react-use-layout-effect',
        'class-variance-authority',
        'tailwind-merge',
      ],
      exclude: ['@vite/client', '@vite/env'],
      // Force pre-bundling to ensure consistent behavior
      force: true,
      // Increase discovery depth
      entries: [
        './src/**/*.{tsx,ts,jsx,js}',
        './index.html',
      ],
      esbuildOptions: {
        // Ensure React is treated as a global
        define: {
          global: 'globalThis',
        },
        // Ensure proper JSX handling
        jsx: 'automatic',
      },
    },

    // Server configuration
    server: {
      port: parseInt(env.VITE_PORT || '5173'),
      strictPort: false,
      host: 'localhost',
      hmr: {
        overlay: true,
        clientPort: parseInt(env.VITE_PORT || '5173'),
      },
      // Proxy API requests
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('Proxying:', req.method, req.url, '->', proxyReq.path);
            });
          },
        },
      },
      fs: {
        strict: false,
      },
      watch: {
        // Ignore files that shouldn't trigger rebuilds
        ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      },
    },

    // Preview server configuration
    preview: {
      port: 4173,
      strictPort: false,
      host: 'localhost',
    },

    // CSS optimization
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isDev
          ? '[name]__[local]__[hash:base64:5]'
          : '[hash:base64:8]',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/shared/design/variables.scss";`,
          quietDeps: true,
        },
      },
      devSourcemap: isDev,
    },

    // Worker configuration
    worker: {
      format: 'es',
    },

    // Log level
    logLevel: env.VITE_LOG_LEVEL || 'info',

    // Clear screen on dev server start
    clearScreen: !process.env.CI,
  };
});