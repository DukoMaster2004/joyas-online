import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = Number(env.PORT) || 3002;

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/@firebase/auth/')) return 'firebase-auth';
            if (id.includes('/node_modules/@firebase/firestore/')) return 'firebase-firestore';
            if (id.includes('/node_modules/@firebase/')) return 'firebase-shared';
            if (id.includes('/node_modules/firebase/')) return 'firebase-sdk';
            return undefined;
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': `http://127.0.0.1:${apiPort}`,
      },
    },
  };
});
