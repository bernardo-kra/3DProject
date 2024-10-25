import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@common': path.resolve(__dirname, 'src/components/common'),
      '@variables': path.resolve(__dirname, 'src/assets/variables'),
      '@context': path.resolve(__dirname, 'src/contexts'),
    },
  },
});
