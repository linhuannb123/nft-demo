/**
 * @name SvgIconsPlugin
 * @description 加载SVG文件，自动引入
 */
// @ts-nocheck
// 主要用于在项目中高效管理和使用 SVG 图标，实现 SVG 图标的自动引入、缓存和按需使用。
import {createSvgIconPlugin} from "vite-plugin-svg-icons";
import path from "path";

export const ConfigSvgIconsPlugin = (isBuild:boolean)=>{
    return createSvgIconPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs:[path.resolve(process.cwd(),'src/assets/icons')],
        // 指定symbolId格式
        symbolId:'icon-[dir]-[name]',
        // 配置是否启用 SVG 优化工具 svgo（用于压缩和清理 SVG 代码，移除冗余信息如注释、无用属性等）。
        svgoOptions:isBuild,
    })
}