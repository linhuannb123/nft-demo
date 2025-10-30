import { createApp } from 'vue'
import '@/assets/main.scss';
import router, { routeState } from "./router";
import ArcoVue, { Message } from '@arco-design/web-vue';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import { createPinia } from 'pinia'

import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

async function bootstrap() {
  const app = createApp(App);
  const router = await routeState.initRouter(); // 异步初始化路由
  Message._context = app._context;
  app.
    use(ArcoVue, {
      // 用于改变使用组件时的前缀名称
      componentPrefix: 'arco'
    }).
    use(router).
    use(pinia).
    mount('#app')

}
bootstrap();