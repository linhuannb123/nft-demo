/**
 * @name ConfigNodePolyfillsPlugin
 * @description 基于 vite-plugin-node-polyfills 插件的 Vite 配置函数，
 * 主要用于在浏览器环境中补充 Node.js 内置模块的 polyfill（兼容代码），
 * 解决前端项目中使用 Node.js 相关模块时的兼容性问题
 */

import { nodePolyfills } from 'vite-plugin-node-polyfills';


export const ConfigNodePolyfillsPlugin = () => {
    return nodePolyfills({
        //指定需要补充 polyfill 的 Node.js 内置模块列表，
        // 数组中的模块会被插件处理并在浏览器中可用。
        include: [
            'crypto', // 加密相关模块（如哈希算法、签名等）；
            'buffer', // 二进制数据处理模块；
            'stream',// 流处理模块（如数据读写流）；
            'util', // 工具函数模块；
            'path', // 文件路径处理模块；
            'assert', // 断言模块（用于代码调试验证）；
            'os' // 操作系统相关信息模块（如获取系统类型、内存等）。
        ],
        // 声明需要在浏览器全局作用域中模拟的 Node.js 全局变量，
        // 键为变量名，值为 true 表示启用。
        globals: {
            Buffer: true, // 在全局暴露 Buffer 对象（Node.js 中用于处理二进制数据的核心对象）；
            global: true, // 在全局暴露 global 对象（Node.js 中的全局命名空间，类似浏览器的 window）；
            process: true, // 在全局暴露 process 对象（Node.js 中用于访问进程信息的对象，如环境变量 process.env）。
        },
        // 启用对 Node.js 协议导入（如 node: 前缀）的支持。
        protocolImports: true, // 允许前端代码使用这种语法，插件会自动将其映射到对应的 polyfill。
    });
}