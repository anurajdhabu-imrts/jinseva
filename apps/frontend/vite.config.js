import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':           path.resolve(__dirname, './src'),
      '@web':        path.resolve(__dirname, './src/web'),
      '@dashboard':  path.resolve(__dirname, './src/dashboard'),
      '@shared':     path.resolve(__dirname, '../../packages/shared'),
      '@components': path.resolve(__dirname, '../../packages/shared/components'),
      '@context':    path.resolve(__dirname, '../../packages/shared/context'),
      '@hooks':      path.resolve(__dirname, '../../packages/shared/hooks'),
      '@services':   path.resolve(__dirname, '../../packages/shared/services'),
      '@utils':      path.resolve(__dirname, '../../packages/shared/utils'),
      '@data':       path.resolve(__dirname, '../../packages/shared/data'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
