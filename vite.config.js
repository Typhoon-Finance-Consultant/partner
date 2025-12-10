import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import path from 'path';

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
    base: '/',
    plugins: [
        react({
            include: '**/*.jsx',
        }),
        tailwindcss(),
    ],
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
    server: {
        watch: {
            usePolling: true,
        },
    },
    clearScreen: false,
    resolve: {
        alias: {
            '&': path.resolve(__dirname, './src'),
        },
    },
});
