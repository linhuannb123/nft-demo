/**
 * @name ConfigImagePlugin
 * @description 描述代码的在 Vue 项目中简化图片的引入和使用
 */

import ViteImages from 'vite-plugin-vue-images';


export const ConfigImagePlugin = () =>{
    return ViteImages({
        dirs: ['src/assets'],// 图像目录的相对路径
        extensions: ['jpg', 'jpeg', 'png', 'svg', 'webp'],// 有效的图像扩展
        customResolvers: [], // 覆盖名称->图像路径解析的默认行为
        customSearchRegex: '([a-zA-Z0-9]+)' // 重写搜索要替换的变量的Regex。
    })
}