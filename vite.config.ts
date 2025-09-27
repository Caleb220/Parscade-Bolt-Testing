// vite.config.ts - Optimized build configuration for Parscade Frontend
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isAnalyze = import.meta.env.ANALYZE === 'true';

  return {
    plugins: [
      react(),
      // Production optimizations
      ...(isProd
        ? [
          compression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 1024,
          }),
        ]
        : []),
      // Bundle analyzer
      isAnalyze &&
      visualizer({
        open: true,
        filename: 'dist/bundle-analysis.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),

    build: {
      target: 'es2020',
      minify: isProd ? 'terser' : false,
      terserOptions: isProd
        ? {
          compress: {
            drop_console: true,
            drop_debugger: true,
            passes: 2,
          },
        }
        : undefined,
      sourcemap: isDev,
      chunkSizeWarningLimit: 500,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          // Simplified chunk strategy
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // React core
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              // UI libraries
              if (id.includes('@radix-ui') || id.includes('framer-motion')) {
                return 'vendor-ui';
              }
              // Data/Auth
              if (id.includes('@tanstack') || id.includes('@supabase')) {
                return 'vendor-data';
              }
              // Other vendors
              return 'vendor';
            }
          },
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || '';
            if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(name)) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
        },
        treeshake: {
          preset: 'recommended',
        },
      },
      cssCodeSplit: true,
      cssMinify: isProd,
    },

    define: {
      global: 'globalThis',
      'import.meta.env.NODE_ENV': JSON.stringify(mode),
      'import.meta.env': {},
      'import.meta.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
    },

    resolve: {
      dedupe: ['react', 'react-dom', 'react-router-dom'],
      alias: {
        // Node.js polyfills for browser compatibility (fixes Supabase issues)
        stream: 'stream-browserify',
        http: 'stream-http',
        https: 'stream-http',
        url: 'url',
        util: 'util',
        process: 'process/browser',
        buffer: 'buffer',

        // App aliases
        '@': path.resolve(__dirname, './src'),
        '@/app': path.resolve(__dirname, './src/app'),
        '@/shared': path.resolve(__dirname, './src/shared'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/lib': path.resolve(__dirname, './src/lib'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/types': path.resolve(__dirname, './src/types'),
      },
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        '@supabase/supabase-js',
        'zod',
        // Include polyfills for optimization
        'buffer',
        'process',
        'stream-browserify',
        'stream-http',
        'url',
        'util',
      ],
      exclude: ['@vite/client', '@vite/env'],
    },

    server: {
      port: parseInt(env.VITE_PORT || '5173'),
      strictPort: false,
      host: 'localhost',
      proxy: env.VITE_API_URL
        ? {
          '/api': {
            target: env.VITE_API_URL,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        }
        : undefined,
    },

    preview: {
      port: 4173,
      strictPort: false,
      host: 'localhost',
    },

    logLevel: 'info',
    clearScreen: !import.meta.env.CI,
  };
});