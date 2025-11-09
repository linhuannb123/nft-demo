/**
 * @name ConfigCompressPlugin
 * @description 构建显示进度条
 */
//  vite-plugin-progress 插件的 Vite 配置函数，主要用于在
//  项目构建（打包）过程中，在终端显示实时的进度条，直观展示构建进度。
import progress from 'vite-plugin-progress';

export const ConfigProgressPlugin = () => {
    return progress();
}