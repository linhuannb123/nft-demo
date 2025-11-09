/**
 * @name ConfigMockPlugin
 * @description 引入mockjs，本地模拟接口
 */

// @ts-nocheck
import {viteMockServe} from "vite-plugin-mock";

export const ConfigMockPlugin = (isBuild:boolean) => {
    return viteMockServe({
        ignition: /^\/_/, //用于匹配需要被 mock 插件拦截的请求路径的正则表达式。
        mockPath:"mock", //指定存放 mock 接口定义文件的目录路径（相对于项目根目录）。
        enable: !isBuild, //制 mock 功能是否启用
         // https://github.com/anncwb/vite-plugin-mock/issues/9
    })
}