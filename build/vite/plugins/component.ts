/**
 * @name AutoRegistryComponents
 * @description 按需加载，自动引入组件
 */



import { ArcoResolver, VueUseComponentsResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";




export const AutoRegistryComponents = () => {
    return Components({
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
    })
}