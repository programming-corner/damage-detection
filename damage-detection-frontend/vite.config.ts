import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: ['.web.ts', '.web.tsx', '.web.js', '.web.jsx', '.ts', '.tsx', '.js', '.jsx'],
  },
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(true),
  },
  optimizeDeps: {
    include: ['react-native-web'],
    exclude: ['react-native-vector-icons', 'react-native-safe-area-context', 'react-native-screens'],
  },
  server: {
    port: 3000,
    host: true,
  },
});