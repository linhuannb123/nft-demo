import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'
import { computed, ref, type Ref, type ComputedRef } from 'vue'
// 定义路由元信息接口
export interface RouteMeta {
  title: string
  icon: string
  requiresAuth: boolean
  order: number
}
// 配置文件接口
export interface RouteConfig {
  name: string
  icon: string
  order: number
  isParams: boolean
}
// 扩展RouteRecordRaw类型，添加meta字段类型
export type ExtendedRouteRecordRaw = RouteRecordRaw & {
  meta: RouteMeta
}

const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到', icon: '', requiresAuth: false, order: 1000 },
  },
]
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
// 动态路由加载(基于文件系统自动导入)
const loadDynamicRoutes = async (): Promise<ExtendedRouteRecordRaw[]> => {
  const dynamicRoutes: ExtendedRouteRecordRaw[] = []
  // 使用import.meta.globEager代替eager选项
  const jsonFiles = import.meta.glob<{ default: RouteConfig }>(
    '../views/**/config.json',
    { eager: true },
  )

  for (const [path, module] of Object.entries(jsonFiles)) {
    try {

      // console.log('ss', path, module)
      // path =>  ../views/Home/config.json
      // module => Module{Symbol(Symbol.toStringTag): 'Module'}
      // module => {name: '首页', icon: 'shouye', order: 1}
      // 解析目录名
      const config: RouteConfig = module.default;
      // console.log('config', config)
      // path.split('/') => ['..','views','Home','config.json']
      //  path.split('/').slice(-2,-1) ["Home"]
      const dirName = path.split('/').slice(-2, -1)[0]
      // console.log('dur', dirName)
      // console.log('path', `../views/${dirName}/${config.order == 2 ? capitalizeFirstLetter(dirName) : config.name}.vue`)

      dynamicRoutes.push({
        path:
          config.order === 1
            ? '/'
            : config.isParams
              ? `/${dirName.toLowerCase()}/:tokenId`
              : `/${dirName.toLowerCase()}`,
        name: config.order === 1 ? config.name.toLocaleLowerCase() : dirName,
        component: () =>
          import(
            `../views/${dirName}/${config.order == 2 ? capitalizeFirstLetter(dirName) : config.name}.vue`
          ),
        meta: {
          title: config.name,
          icon: config.icon,
          requiresAuth: false,
          order: config.order,
        },
      })
      // console.log('dynamicRoutes', dynamicRoutes)
    } catch (error) {
      console.log(`Failed to load config for ${path}:`, error)
    }
  }
  const sortRoutes = dynamicRoutes.sort((a, b) => a.meta.order - b.meta.order)
  return sortRoutes
}

// // 创建路由实例到异步函数中
// // 将路由创建封装
// export const createAppRouter = async () => {
//   const dynamicRoutes = await loadDynamicRoutes();

//   const router = createRouter({
//     history: createWebHistory(import.meta.env.BASE_URL),
//     routes: [...dynamicRoutes, ...staticRoutes] as RouteRecordRaw[]
//   })
//   return router;
// }
// // const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [...loadDynamicRoutes(), ...staticRoutes] as RouteRecordRaw[],
// });

// 注册全局组件 (可能不是必需的)
// export const registerCommonComponent = async (app: App) => {
//   const router = await createAppRouter();
//   baseRoutes = router.options.routes as ExtendedRouteRecordRaw[];
//   baseRoutes.slice(0).forEach(route => {
//     if (route.name && typeof route.component === 'function') {
//       app.component(route.name as string, route.component)
//     }
//   })
// }

// 使用 Vueuse的ref存储路由状态
export const routeState: {
  allRoutes: Ref<ExtendedRouteRecordRaw[]>
  visibleRoutes: ComputedRef<ExtendedRouteRecordRaw[]>
  initRouter: () => Promise<ReturnType<typeof createRouter>>
} = {
  // 存储所有路由(包括静态路由)
  allRoutes: ref<ExtendedRouteRecordRaw[]>([]),

  // 存储过滤后的可见路由
  visibleRoutes: computed(() => {
    const allRoutesRef = routeState.allRoutes as Ref<ExtendedRouteRecordRaw[]>
    return allRoutesRef.value.filter(
      (route: ExtendedRouteRecordRaw) => route.name !== 'NotFound',
    )
  }),

  // 初始化路由
  async initRouter() {
    const dynamicRoutes = await loadDynamicRoutes()
    const router = createRouter({
      history: createWebHashHistory(),
      routes: [...dynamicRoutes, ...staticRoutes] as RouteRecordRaw[],
    })

    routeState.allRoutes.value = router.options
      .routes as ExtendedRouteRecordRaw[]
    return router
  },
}

// 默认导出改为异步函数
export default routeState.initRouter
