import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['pg', 'pg-native'],
    },
  },
  optimizeDeps: {
    exclude: ['pg', 'pg-native']
  },
  server: {
    port: 3000
  }
}); 