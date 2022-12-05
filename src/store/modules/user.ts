// 引入 defineStore
import { defineStore } from 'pinia'
import { getToken, setToken, removeToken, setUserInfo, getUserInfo, removeUserInfo } from "@/utils/cookie"
import http from '@/utils/request'
const useUserStore = defineStore('user', {
  state: (): any => ({
    token: getToken(),
    userInfo: getUserInfo()
  }),

  actions: {
    // 退出
    logOut() {
      return new Promise((resolve, reject) => {
        http.post("/user/logout", {
          userId: this.userInfo.userId,
        }).then((res: any) => {
          if (res.code == 200) {
            removeToken()
            removeUserInfo()
            resolve(true)
            window.location.reload()
          } else {
            reject(false)
          }
        }).catch(() => reject(false))
      })
    },
    // 获取用户信息
    login(params: any) {
      return new Promise((resolve, reject) => {
        http.post("/user/login", {
          userAccount: params.account,
          password: params.password,
        }).then((res: any) => {
          if (res.code == 200) {
            this.userInfo = res.data.userInfo
            setToken(res.data.token)
            setUserInfo(res.data.userInfo)
            resolve(true)
          } else {
            reject(res.message)
          }
        }).catch((e) => reject(e))
        // 拉取信息
      })
    }
  }
})
// 导出
export default useUserStore

