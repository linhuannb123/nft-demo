/**
 * @name AutoImport
 * @description 按需加载，自动引入
 */


import AutoImport from "unplugin-auto-import/vite"
import { ArcoResolver } from "unplugin-vue-components/resolvers"
import { VueRouterAutoImports } from "unplugin-vue-router"


export const AutoImportDeps = () => {
    return AutoImport({
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
    });
}