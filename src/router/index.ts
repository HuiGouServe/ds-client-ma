import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router'



const routes: Array<RouteRecordRaw> = [   //基本路由
  {
    path: '/',
    name: '/',
    redirect: '/index',
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/four/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  }

]

export const spuerRoutes: Array<RouteRecordRaw> = [  //超级管理员

  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/index/index.vue'),
    children: [
      {
        path: '/authority',
        name: '权限管理',
        component: () => import('@/views/authorityManagement/index.vue'),
      },
      {
        path: '/map',
        name: '分布管理',
        component: () => import('@/views/mapManagement/index.vue'),
      },
      {
        path: '/data',
        name: '数据管理',
        component: () => import('@/views/dataManagement/index.vue'),
      },
      {
        path: '/user',
        name: '用户管理',
        component: () => import('@/views/user/index.vue'),
        children: [
          {
            path: '/user/backgroundManagement',
            name: '客服管理',
            component: () => import('@/views/user/backgroundManagement/index.vue'),
          },
          {
            path: '/user/clientManagemen',
            name: '客户管理',
            component: () => import('@/views/user/clientManagement/index.vue'),
          },
          {
            path: '/user/indentityManagemen',
            name: '审核管理',
            component: () => import('@/views/user/indentityManagemen/index.vue'),
          }
        ]
      },

      {
        path: '/shop',
        name: '商品管理',
        component: () => import('@/views/shop/index.vue'),
        children: [
          {
            path: '/shop/newShopManagement',
            name: '新增商品管理',
            component: () => import('@/views/shop/newShopManagement/index.vue'),
          },
          {
            path: '/shop/downUpShopManagement',
            name: '下架商品管理',
            component: () => import('@/views/shop/downUpShopManagement/index.vue'),
          }
        ]
      },
      {
        path: '/test',
        name: '测试页面',
        component: () => import('@/views/test/index.vue'),
      },
    ]
  }
]


export const commonRoutes: Array<RouteRecordRaw> = [   //普通管理员
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/index/index.vue'),
    children: [
      {
        path: '/data',
        name: '数据管理',
        component: () => import('@/views/dataManagement/index.vue'),
      },
      {
        path: '/user',
        name: '用户管理',
        component: () => import('@/views/user/index.vue'),
        children: [
          {
            path: '/backgroundManagement',
            name: '客服管理',
            component: () => import('@/views/user/backgroundManagement/index.vue'),
          },
          {
            path: '/clientManagemen',
            name: '客户管理',
            component: () => import('@/views/user/clientManagement/index.vue'),
          }
        ]
      },
      {
        path: '/shop',
        name: '商品管理',
        component: () => import('@/views/shop/index.vue'),
        children: [
          {
            path: '/newShopManagement',
            name: '新增商品管理',
            component: () => import('@/views/shop/newShopManagement/index.vue'),
          },
          {
            path: '/downUpShopManagement',
            name: '下架商品管理',
            component: () => import('@/views/shop/downUpShopManagement/index.vue'),
          }
        ]
      },

    ]
  }
];

export const commonUsers: Array<RouteRecordRaw> = [   //普通用户
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/index/index.vue'),
    children: [{
      path: '/shop',
      name: '商品管理',
      component: () => import('@/views/shop/index.vue'),
      children: [
        {
          path: '/newShopManagement',
          name: '新增商品管理',
          component: () => import('@/views/shop/newShopManagement/index.vue'),
        },
        {
          path: '/downUpShopManagement',
          name: '下架商品管理',
          component: () => import('@/views/shop/downUpShopManagement/index.vue'),
        }
      ]
    }]
  }
];



const router = createRouter({
  history: createWebHashHistory(),
  routes
})




// export function MergeRouter() {
//   let list: any = []
//   routes.forEach((val: any) => {
//     if (val.name == 'index') {
//       list = recursionRouter(val.children, meumList)
//     }
//   })
//   return list
// }


//TODO 后期根据后台限权动态添加路由
// function recursionRouter(allRouter: any, userRouter: any) {
//   const realRoutes: any = []
//   allRouter.forEach((v: any, i: any) => {
//     userRouter.forEach((item: any, index: any) => {
//       if (item.name === v.name) {
//         if (item.children && item.children.length > 0) {
//           v.children = recursionRouter(item.children, v.children);
//         }
//         realRoutes.push(v);
//       }
//     });
//   });
//   return realRoutes;
// }



//  * 递归为所有有子路由的路由设置第一个children.path为默认路由
// function setDefaultRoute(routes) {
//   routes.forEach((v, i) => {
//     if (v.children && v.children.length > 0) {
//       v.redirect = { name: v.children[0].name };
//       setDefaultRoute(v.children);
//     }
//   });
// }





export default router