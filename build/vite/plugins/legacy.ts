import legacy from '@vitejs/plugin-legacy'
/**
 * @name ConfigLegacy
 * @description 就能实现 ES6 转 ES5 降级，
 * 还会自动注入 polyfill 兼容旧浏览器（如 IE11）
 */
export const ConfigLegacy = () => {
  return legacy({
    targets: [
      '> 1%',
      'not ie 11',
      'not op_mini all',
      'chrome >= 78',
      'edge >= 78',
      'firefox >= 72',
      'safari >= 13',
      'opera >= 67',
    ], // 要兼容的浏览器目标（按需调整）
    additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 补全 async/await 等语法的 polyfill
    renderLegacyChunks: true, //生成 legacy 兼容 chunk 文件
    polyfills: [
      'es.symbol',
      'es.array.filter',
      'es.promise',
      'es.promise.finally',
      'es.object.assign',
      'es.array.includes',
      'es.string.includes',
      'es.array.iterator', // IE11 缺少的迭代器支持
      'es.map', // 若项目用了 Map
      'es.set', // 若项目用了 Set
    ], // 按需添加需要的 polyfill（默认已包含常用的）
    modernPolyfills: true, // 现代浏览器按需加载必要 polyfill，不冗余
  })
}
