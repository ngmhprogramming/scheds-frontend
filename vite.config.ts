import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    server: {
      port: 3003,
      host: true,
      watch: {
       usePolling: true,
      },
      esbuild: {
       target: "esnext",
       platform: "linux",
     },
   },
   define: {
     VITE_APP_BACKEND_ADDRESS: JSON.stringify(env.VITE_APP_BACKEND_ADDRESS),
   },
  };
 });