import stylelint from "vite-plugin-stylelint";
import dotenv from "dotenv";
// 加载环境变量
dotenv.config();
export const ConfigStyleLintPlugin = () => {
    // StyleLint 配置
    stylelint({
        // 开发模式下自动修复
        fix: true,
        // 只在开发模式启用
        dev: process.env.NODE_ENV === 'development',
        build: process.env.NODE_ENV !== 'development',

        // 检查的文件类型
        include: ['src/**/*.vue', 'src/**/*.scss', 'src/**/*.css', 'src/**/*.less'],
        exclude: ['node_modules/**'],
        // 错误提示级别
        emitWarning: true,
        emitError: false,
    })
}
