import axios from 'axios';
import router from '../router';
import { removeToken, getToken } from './cookie'

let baseURL = "http://localhost:8002"

const server = axios.create({
  timeout: 10000,
  baseURL
})


//http request 拦截器
server.interceptors.request.use(
  (config: any) => {
    if (getToken()) {
      config.headers.token = getToken()
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);


//http response 拦截器
server.interceptors.response.use(
  (response: any) => {
    // console.log(response, "response");

    if (response.data.code == 401) { //判断当前用户是否token 失效或空 
      removeToken();
      router.replace({
        path: "/login",
      })
    }
    return response;
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

const http = {
  get(url: String, params = {}) {
    return new Promise((resolve, reject) => {
      server.get(url, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }).then((response: any) => {
        resolve(response.data);
      }).catch((err: any) => {
        reject(err)
      })
    })
  },

  post(url: String, data = {}) {
    return new Promise((resolve, reject) => {
      server.post(url, data, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }).then((response: any) => {
        resolve(response.data);
      }, (err: any) => {
        reject(err)
      })
    })
  },

  downLoad(url: String, data: any) { // 上传
    return new Promise((resolve, reject) => {
      server({ url, data, method: 'POST', headers: { 'Content-Type': 'multipart/form-data' } }).then((response: any) => {
        resolve(response.data);
      }, (err: any) => {
        reject(err)
      })
    })
  },

  upLoad(url: string, data: any, name: string) { // 下载excel
    server({ url, data, method: 'POST', responseType: 'blob' }).then((res: any) => {
      if (res.status == 200) {
        const link = document.createElement('a')
        link.download = name;
        link.style.display = 'none';
        link.href = URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' }));
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
      }
    })
  },
  baseURL
}

export default http

