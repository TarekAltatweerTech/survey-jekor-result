import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone site (deployed on Vercel). Its only link to Laravel is the results API
// address, given at build time in VITE_RESULTS_API_URL.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // A build without the API address would deploy a screen that can never load the
  // results: stop the build instead of shipping it.
  if (command === 'build' && !env.VITE_RESULTS_API_URL) {
    throw new Error(
      'VITE_RESULTS_API_URL is missing. Set it to the results API, e.g. ' +
        'https://api.example.com/api/v4/survey/results (Vercel: Project → Settings → Environment Variables).',
    );
  }

  return {
    plugins: [react()],
    server: {
      port: 5174,
      // `npm run dev`: /api/* is forwarded to the local Laravel (Laragon) host.
      // `secure: false` accepts Laragon's self-signed certificate on https://*.test.
      proxy: env.VITE_PROXY_TARGET
        ? { '/api': { target: env.VITE_PROXY_TARGET, changeOrigin: true, secure: false } }
        : undefined,
    },
  };
});
