import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from './utils/cookie'
import router from './router/index'
import store from '@/store/index'

NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/404'] // 白名单
let registerRouteFresh = true
router.beforeEach((to, from, next) => {

  NProgress.start() // 进度条
  if (getToken()) {
    if (to.path === '/login') {    // 已登录且要跳转的页面是登录页
      next({ path: '/' })
      NProgress.done()
    } else {
      if (registerRouteFresh) {
        store().router.getRouters().then(async (res: any) => {  //动态添加路由
          await res.forEach((element: any) => {
            router.addRoute(element)
          });
          next({ ...to, replace: true }) //处理刷新问题
        })
        registerRouteFresh = false
      } else {
        next()
      }
    }
  } else { // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})



