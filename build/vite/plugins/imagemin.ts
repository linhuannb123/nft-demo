/**
 * @name ConfigImageminPlugin
 * @description 主要用于在项目构建过程中自动压缩图片资源，
 * 减少图片体积以优化项目性能
 */

// 导入 vite-plugin-imagemin 插件，这是一个 Vite 插件，基于多种图片压缩工具
// （如 gifsicle、mozjpeg 等），能在项目打包时自动压缩各类图片资源
// - gifsicl  - 针对 GIF 图片的压缩配置
//      - optimizationLevel:7 表示最高级别的压缩，会尽可能减小 GIF 体积。
//      - interlaced:false 关闭隔行扫描，生成的 GIF 加载时会一次性显示完整图像（而非逐行渐进显示）。
// - mozjpeg  - 针对 JPEG 图片的压缩配置
//      - quality:20 表示以较低质量压缩 JPEG 图片，适合对画质要求不高但追求体积
//  的场景（注意：过低可能导致图片模糊）。
// - optipng - 针对 PNG 图片的压缩配置（基于无损压缩）
//      - optimizationLevel:7 启用最高级别的无损压缩，不会损失 PNG 图片质量，但会尽可能减小体积。
// - pngquant - 针对 PNG 图片的压缩配置（基于有损压缩）
//      - quality:  与 optipng 不同，pngquant 是有损压缩，通过降低颜色精度减小体积，
// quality 范围平衡质量和体积。
//       - speed:4 表示中等压缩速度，兼顾效率和效果。
// - svgo - 针对 SVG 图片的压缩配置
// svgo 是专门处理 SVG 的工具，通过移除冗余代码（如注释、无用属性）压缩体积。
//       removeViewBox：移除 viewBox 可能导致 SVG 无法正确缩放，需根据实际需求启用。
//      removeEmptyAttrs: active:false：禁用移除空属性（如 <path fill="" /> 中的空 fill），避免误删必要
import viteImagemin from "vite-plugin-imagemin";

export const ConfigImageminPlugin = () => {
    const plugin = viteImagemin({

        gifsicle:{
            //导入 vite-plugin-imagemin 插件，这是一个 Vite 插件，
            // 基于多种图片压缩工具（如 gifsicle、mozjpeg 等），
            // 能在项目打包时自动压缩各类图片资源
            optimizationLevel:7, 
             // 是否启用隔行扫描（渐进式加载），false 表示非渐进式
            interlaced:false,
        },
        mozjpeg:{
            quality:20, // 压缩质量（0-100），数值越低压缩率越高，图片质量损失越大
        },
        optipng:{
            optimizationLevel:7,// 优化级别（0-7），数值越高压缩越彻底（无损），耗时越长
        },
        pngquant:{
            quality:[0.8,0.9], // 质量范围（0-1），表示压缩后图片质量在 80%-90% 之间
            speed:4, // 压缩速度（1-11），数值越高速度越快，但压缩效果越差
        },
        svgo:{
            plugins:[
                {
                    name:"removeViewBox", // 移除 SVG 中的 viewBox 属性（可能影响缩放，需谨慎）
                },
                {
                    name:"removeEmptyAttrs", // 关闭“移除空属性”插件（不删除空属性）
                    active:false,
                }
            ],
        },
    });
    return plugin;
}