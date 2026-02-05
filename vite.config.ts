import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const {
      VITE_BASE_URL: baseUrl,
      VITE_PORT: port,
      VITE_AUTH_HOST: authHost,
    } = env;

    return {
      base: baseUrl,
      server: {
        port: Number(port) || 3000,
        host: '0.0.0.0',
        https: true,
        proxy: {
          '/api/Profile': {
            target: authHost,
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api\/Profile/, '/Profile'),
          },
        },
      },
      plugins: [vue(), mkcert()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
