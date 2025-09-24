// vite.config.ts (patched extract)
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

function norm(p: string) { return p.replace(/\\/g, '/'); }

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      output: {

      },
    },
  },

  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': '"production"',
  },

  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': '/src',
      '@/app': '/src/app',
      '@/shared': '/src/shared',
      '@/features': '/src/features',
      '@/lib': '/src/lib',
    },
  },

  optimizeDeps: {
    include: [
        'react','react-dom',
      'react-remove-scroll','react-remove-scroll-bar',
      'use-sidecar','react-style-singleton'
    ],
  },
});
