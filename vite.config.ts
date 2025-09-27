// vite.config.ts
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import compression from 'vite-plugin-compression';
import { nodePolyfills  } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isAnalyze = env.ANALYZE === 'true';

  return {
    plugins: [
      react(),
      nodePolyfills({
        protocolImports: true, // allows e.g. node:stream
      }),
      ...(isProd
        ? [
          compression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 1024,
          }),
        ]
        : []),
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
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
              if (id.includes('@radix-ui') || id.includes('framer-motion')) return 'vendor-ui';
              if (id.includes('@tanstack') || id.includes('@supabase')) return 'vendor-data';
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
        treeshake: { preset: 'recommended' },
      },
      cssCodeSplit: true,
      cssMinify: isProd,
    },

    // These replaces stop "process is not defined" at runtime
    define: {
      global: 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env': '{}',
      'process.platform': '"browser"',
      'import.meta.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
    },

    resolve: {
      dedupe: ['react', 'react-dom', 'react-router-dom'],
      alias: {
        // Correct polyfills
        process: 'process/browser',
        buffer: 'buffer',
        stream: 'stream-browserify',
        http: 'stream-http',
        https: 'https-browserify',
        url: 'url',
        util: 'util',
        path: 'path-browserify',

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

    // Make esbuild see the shims during dependency pre-bundle
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        '@supabase/supabase-js',
        'zod',
        // shims
        'buffer',
        'process',
        'stream-browserify',
        'https-browserify',
        'url',
        'util',
        'path-browserify',
      ],
      esbuildOptions: {
        define: {
          global: 'globalThis',
          'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
        },
      },
      exclude: ['@vite/client', '@vite/env'],
    },

    server: {
      port: parseInt(env.VITE_PORT || '5173'),
      strictPort: false,
      host: 'localhost',
      proxy: env.VITE_API_BASE_URL
        ? {
          '/api': {
            target: env.VITE_API_BASE_URL,
            changeOrigin: true,
            rewrite: (p) => p.replace(/^\/api/, ''),
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
    clearScreen: !env.CI,
  };
});
