import { UserConfig, defineConfig, type ConfigEnv, loadEnv } from 'vite';
// import vue from '@vitejs/plugin-vue';
// import vueJsx from '@vitejs/plugin-vue-jsx';
// import path from "path";
import { fileURLToPath } from 'node:url'
  // import AutoImport from 'unplugin-auto-import/vite'
  // import Components from 'unplugin-vue-components/vite';

  // import { nodePolyfills } from 'vite-plugin-node-polyfills';
  // import { createHtmlPlugin as CreateHtmlPlugin } from 'vite-plugin-html';
  // import ViteCompression from 'vite-plugin-compression';
  // import { VueRouterAutoImports } from 'unplugin-vue-router';
  ;
// 构建显示进度条
// import progress from 'vite-plugin-progress';
// 监听配置文件修改自动重启Vite
// import ViteRestart from 'vite-plugin-restart';
// import { visualizer } from 'rollup-plugin-visualizer';
// import {
//   VueUseComponentsResolver,
//   ArcoResolver,
// } from 'unplugin-vue-components/resolvers';
// import ViteImages from 'vite-plugin-vue-images';

import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugins';


// https://vitejs.dev/config/
const config = defineConfig(({ command, mode }: ConfigEnv): any => {
  //   mode: {
  //   mode: 'development',
  //   command: 'serve',
  //   isSsrBuild: false,
  //   isPreview: false
  // },
  const isBuild = command === 'build';

  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env)

  console.log('环境配置:', viteEnv)



  // console.log('环境配置:', { mode, env, isProduction });
  return {
    plugins: [...createVitePlugins(viteEnv, isBuild)],
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios', 'ethers']
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        assert: 'assert',
        http: 'stream-http',
        https: 'https-browserify',
        os: 'os-browserify/browser',
        url: 'url',
        process: 'process/browser'
      },
      extensions: ['.js', '.ts', '.mjs', '.mts', '.json', '.vue'],
    },
    publicDir: 'public',
    build: {
      sourcemap: false,
      outDir: 'dist',
      chunkSizeWarningLimit: 5000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,//改为false，生产环境就会保留console.log
          drop_debugger: true, //改为false，生产环境就会保留debugger
        }
      },
      rollupOptions: {
        output: {
          manualChunks(id: string | string[]) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 3001,
      open: false,
      proxy: {
        '/api-pinata': {
          // 修正为 API 服务地址
          target: 'https://api.pinata.cloud',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api-pinata/, ''),
          configure: (proxy: any) => {
            proxy.on('proxyReq', (proxyReq: any, req: any) => {
              Object.keys(req.headers).forEach(header => {
                proxyReq.setHeader(header, req.headers[header]);
              });
              console.log(req.headers)
            });
          },
          withCredentials: true,
        },
      },
    },

  };
});
export default config;