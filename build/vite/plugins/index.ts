import { PluginOption } from 'vite'
// import { ConfigPagesPlugin } from "./pages";
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

// import VitePluginCertificate from 'vite-plugin-mkcert';
import { AutoRegistryComponents } from './component'
import { AutoImportDeps } from './autoImport'
import { ConfigRestartPlugin } from './restart'
import { ConfigProgressPlugin } from './progress'
// import { ConfigSvgIconsPlugin } from "./svgIcons";
// import { ConfigMockPlugin } from "./mock";
import { ConfigImageminPlugin } from './imagemin'
import { ConfigCompressPlugin } from './compress'
import { ConfigVisualizerConfig } from './visualizer'
import { ConfigCreateHtmlPlugin } from './html'
import { ConfigImagePlugin } from './image'
import { ConfigNodePolyfillsPlugin } from './polyfills'
import { ConfigCheckerPlugin } from './checker'
import { ConfigLegacy } from './legacy'
// import { ConfigUnocssPlugin } from "./unocss";
export function createVitePlugins(
  viteEnv: Record<string, any>,
  isBuild: boolean,
) {
  const { VITE_USE_COMPRESS } = viteEnv

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    //自动生成路由
    // ConfigPagesPlugin(),
    // vue支持
    vue(),
    // JSX支持
    vueJsx(),
    // setup语法糖组件名组件
    vueSetupExtend(),
    // 提供https证书
    // VitePluginCertificate({
    //     source:'coding',
    // })

    // 标题
    ConfigCreateHtmlPlugin(),

    // 图片
    ConfigImagePlugin(),

    ConfigNodePolyfillsPlugin(),

    // 自动检查引入文件的eslint
    ConfigCheckerPlugin(),
    // 自动降级babel
    ConfigLegacy(),
  ]

  // 自动按需引入组件
  vitePlugins.push(AutoRegistryComponents())

  // 自动按需引入依赖
  vitePlugins.push(AutoImportDeps())

  // 监听配置文件改动重启
  vitePlugins.push(ConfigRestartPlugin())

  // 构建时显示进度条
  vitePlugins.push(ConfigProgressPlugin())

  // unocss
  // vitePlugins.push(ConfigUnocssPlugin());

  // vite-plugin-svg-icons
  // vitePlugins.push(ConfigSvgIconsPlugin(isBuild));

  // vite-plugin-mock
  //    VITE_USE_MOCK && vitePlugins.push(ConfigMockPlugin(isBuild));

  // rollup-plugin-visualizer
  vitePlugins.push(ConfigVisualizerConfig())

  if (isBuild) {
    // vite-Plugin-imagemin
    vitePlugins.push(ConfigImageminPlugin())

    // 开启.gz压缩 rollup-plugin-gzip
    VITE_USE_COMPRESS && vitePlugins.push(ConfigCompressPlugin())
  }

  return vitePlugins
}
