/**
 * @name ConfigCompressPlugin
 * @description 监听配置文件修改自动重启Vite
 */
// 主要用于在项目的配置文件发生修改时，自动重启 Vite 开发服务器，
// 确保配置变更能够立即生效，无需手动停止并重启服务。
import ViteRestart from "vite-plugin-restart";

export const ConfigRestartPlugin = () => {
    return ViteRestart({
        restart:['*.config.[jt]s','**/config/*.[jt]s'], //用于定义触发自动重启的文件匹配规则
    });
};