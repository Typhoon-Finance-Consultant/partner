import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import path from 'path';

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [
        react({
            include: '**/*.jsx',
        }),
        tailwindcss(),
    ],
    server: {
      watch: {
        usePolling: true
      }
    },
    clearScreen: false,
    resolve: {
        alias: {
            '&': path.resolve(__dirname, './src'),
        },
    },
});
