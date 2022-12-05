// 引入 defineStore
import { defineStore } from 'pinia'
import { getUserInfo } from "@/utils/cookie"
import { spuerRoutes, commonRoutes, commonUsers } from '@/router/index'
const useRouterStore = defineStore('router', {
  state: (): any => ({
    routers: []
  }),

  actions: {
    getRouters() {
      let userRank = JSON.parse(getUserInfo()).userRank || '超级管理员'
      return new Promise((resolve, reject) => {
        if (userRank == "超级管理员") {
          resolve(spuerRoutes)
          this.routers = spuerRoutes
        }
        if (userRank == "普通管理员") {
          resolve(commonRoutes)
          this.routers = commonRoutes
        }
        if (userRank == "普通用户") {
          resolve(commonUsers)
          this.routers = commonUsers
        }
      })
    }
  }
})
// 导出
export default useRouterStore

