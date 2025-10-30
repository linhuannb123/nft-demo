import { UserConfig, defineConfig, type ConfigEnv, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from "path";
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';

import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { createHtmlPlugin as CreateHtmlPlugin } from 'vite-plugin-html';
import ViteCompression from 'vite-plugin-compression';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import viteImagemin from 'vite-plugin-imagemin';
// 构建显示进度条
import progress from 'vite-plugin-progress';
// 监听配置文件修改自动重启Vite
import ViteRestart from 'vite-plugin-restart';
import { visualizer } from 'rollup-plugin-visualizer';
import {
  VueUseComponentsResolver,
  ArcoResolver,
} from 'unplugin-vue-components/resolvers';
import ViteImages from 'vite-plugin-vue-images';
import pkg from './package.json';
const { dependencies, devDependencies, name, version } = pkg
const _APP_INFO_ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: ((date: Date) => {
    let [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    month < 10 && (month = `0${month}` as unknown as number)
    day < 10 && (day = `0${day}` as unknown as number)
    return `${year}/${month}/${day} ${date.toLocaleTimeString([], { hourCycle: 'h24' })}`
  })(new Date())
}
// https://vitejs.dev/config/
const config = defineConfig((mode: ConfigEnv): any => {
  const env = loadEnv(mode.mode, process.cwd());
  const isProduction = env.VITE_NODE_ENV === "production";
  console.log('环境配置:', { mode, env, isProduction });
  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        dts: 'types/auto-imports.d.ts',
        imports: [
          'vue',
          'pinia',
          {
            '@vueuse/core': [],
          },
          VueRouterAutoImports,

        ],
        resolvers: [
          ArcoResolver({
            sideEffect: true, // 可选：若需自动引入样式，设为 true
          })
        ],
      }),
      CreateHtmlPlugin({
        minify: true,
        entry: '/src/main.ts',
        inject: {
          data: {
            title: 'nft',
          },
        },
      }),
      ViteCompression({
        verbose: true, // 默认即可
        disable: false, //开启压缩(不禁用)，默认即可
        deleteOriginFile: false, //删除源文件
        threshold: 10240, //压缩前最小文件大小
        algorithm: 'gzip', //压缩算法
        ext: '.gz', //文件类型
      }),
      ViteImages({
        dirs: ['src/assets'],
        extensions: ['jpg', 'jpeg', 'png', 'svg', 'webp'],
        customResolvers: [],
        customSearchRegex: '([a-zA-Z0-9]+)'
      }),
      Components({
        dirs: ['src/components'],
        extensions: ['vue', 'md'],
        deep: true,
        dts: 'types/components.d.ts',
        directoryAsNamespace: false,
        globalNamespaces: [],
        directives: true,
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
        resolvers: [
          VueUseComponentsResolver(),
          ArcoResolver({
            sideEffect: true // 自动引入 Arco 样式
          })
        ]
      }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        mozjpeg: {
          quality: 20,
        },
        optipng: {
          optimizationLevel: 7,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
      ViteRestart({
        restart: ['*.config.[jt]s', '**/config/*.[jt]s'],
      }),
      visualizer({
        filename: './node_modules/.cache/visualizer/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
      progress(),
      nodePolyfills({
        include: [
          'crypto',
          'buffer',
          'stream',
          'util',
          'path',
          'assert',
          'os'
        ],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
      })
    ],
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
      sourcemap: isProduction,
      outDir: 'dist',
      chunkSizeWarningLimit: 5000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
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
    define: {
      _APP_INFO_: JSON.stringify(_APP_INFO_)
    }
  };
});
export default config;