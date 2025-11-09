/**
 * @name ConfigVisualizerConfig
 * @description ，主要用于在项目构建后生成可视化的打包体积分析报告，
 * 帮助开发者分析代码打包后的体积构成，找出大型依赖或冗余代码，
 * 从而优化项目性能。
 */

import {visualizer} from "rollup-plugin-visualizer";

export function ConfigVisualizerConfig() {
    return visualizer({
        filename:'./node_modules/.cache/visualizer/stats.html', //指定生成的可视化报告文件的路径和名称。
        open:false, // 控制构建完成后是否自动在浏览器中打开生成的报告。
        gzipSize:true, // 启用 gzip 压缩后的体积计算。
        brotliSize:true,//启用 brotli 压缩后的体积计算（brotli 是比 gzip 压缩率更高的算法，部分服务器支持）
    })
}