import { defineConfig } from 'vite';
import { localModeration } from './dev/moderate';

export default defineConfig(({ command, isPreview }) => ({
  plugins: command === 'serve' && !isPreview ? [localModeration()] : [],
  optimizeDeps: { include: ['react', 'react-dom/client', 'react/jsx-dev-runtime'] },
  server: { host: '127.0.0.1', port: 5173, cors: false },
}));
