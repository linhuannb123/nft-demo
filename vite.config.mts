import { defineConfig, type ConfigEnv, loadEnv } from 'vite';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugins';
import { fileURLToPath } from 'node:url'


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
    //基础配置
    base: "/",
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

    // 构建优化（可选，提升打包效率）
    build: {
      sourcemap: false,
      outDir: 'dist',
      chunkSizeWarningLimit: 5000,// 加大chunk体积警告阈值
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,//改为false，生产环境就会保留console.log
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

    // 开发服务器配置（保留你的原有配置即可）
    server: {
      host: '0.0.0.0',
      port: 3001,
      open: false,
      // proxy: {
      //   // 若有接口代理，保留你的配置
      //   '/api': {
      //     target:'/api',
      //     changeOrigin: true,
      //     rewrite: (path:string) => path.replace(/^\/api/, '')
      //   }
      // }
    },

  };
});
export default config;