/**
 * @name ConfigPagesPlugin
 * @description 动态生成路由
 */


import VueRouter from "unplugin-vue-router/vite";

export const ConfigPagesPlugin = () => {
    return VueRouter({
        // 指定路由页面文件所在的根目录，这里设置为 src/views（
        // Vue 项目中常用的页面组件目录）。
        // 声明需要被识别为路由页面的文件扩展名，按优先级排序（前面的扩展名优先级更高）。
        routesFolder: ['src/views'],
        // 指定生成 TypeScript 类型声明文件的路径，用于提供路由相关的类型提示（如路由名称、参数类型等）。
        // 开启后，在开发时可以获得路由跳转、参数传递的类型校验，提升代码健壮性（尤其适合 TypeScript 项目）。
        dts: "types/typed-router.d.ts",
        extensions: ['.page.vue', '.vue', '.md'],
    })
}