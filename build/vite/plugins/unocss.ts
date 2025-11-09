
/**
 * @name ConfigUnocssPlugin
 * @description 监听配置修改自动重启Vite
 */

// Unocss
// 这段代码是基于 Unocss（一个原子化 CSS 引擎）的 Vite
//  插件配置函数，主要用于在项目中集成 Unocss，实现原子化
//   CSS 类的实时解析和生成，提升样式开发效率。需要注意的
//   是，注释中 “监听配置修改自动重启 Vite” 可能是笔误，
//   Unocss 核心功能是处理 CSS
// @ts-nocheck
import Unocss from 'unocss/vite';

export const ConfigUnocssPlugin = () => {
    return Unocss();
}