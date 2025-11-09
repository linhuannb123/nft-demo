

/**
 * @name ConfigCheckerPlugin
 * @description 让 Vite 构建时自动只检查 “被引用的文件”，同时保留必要的类型校验
 */



import Checker from 'vite-plugin-checker';



export const ConfigCheckerPlugin = () => {
    return Checker({
        typescript: true, // 只检查 Vite 构建过程中涉及的文件
    });
};