import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import path from 'path';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        base: './',
        plugins: [react(), vue()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        build: {
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, 'index.html'),
                },
            },
        },
        server: {
            host: '0.0.0.0',
            port: 5177,
            strictPort: true,
            proxy: {
                '/api': {
                    target: env.SERVICE_API_URL || 'http://localhost:8000',
                    changeOrigin: true,
                    rewrite: function (path) { return path.replace(/^\/api/, ''); },
                },
            },
        },
    };
});
