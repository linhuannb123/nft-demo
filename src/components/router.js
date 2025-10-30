// 在本例子中，页面最终路径为 /dashboard/workplace
const data = {
  path: 'dashboard',
  name: 'dashboard', // 路由名称
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    locale: 'menu.dashboard',
    requiresAuth: true,
    icon: 'icon-dashboard',
  },
  children: [
    {
      path: 'workplace',
      name: 'workplace',
      component: () => import('@/views/dashboard/workplace/index.vue'),
      meta: {
        locale: 'menu.dashboard.workplace',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: false,
      },
    },
  ],
}
