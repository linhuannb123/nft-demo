import { createHtmlPlugin as CreateHtmlPlugin } from 'vite-plugin-html';


export const ConfigCreateHtmlPlugin =() => {
    return CreateHtmlPlugin({
        minify: true,
        entry: '/src/main.ts',
        inject: {
            data: {
                title: 'Vite + Vue + TS',
            },
        },
    });
};