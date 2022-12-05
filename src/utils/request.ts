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

  downLoad(url: String, data: any) { //下载 上传
    return new Promise((resolve, reject) => {
      server({ url, data, method: 'POST', headers: { 'Content-Type': 'multipart/form-data' } }).then((response: any) => {
        resolve(response.data);
      }, (err: any) => {
        reject(err)
      })
    })
  },
  baseURL
}

export default http

