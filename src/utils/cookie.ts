import Cookies from 'js-cookie';

const TokenKey = 'token'
const UserINfoKey = 'UserINfo'
const RouterTagkey = "routerTagkey"

interface breadcrumb { name: string, path: string }

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token || '')
}

export function removeToken() {
  Cookies.remove(TokenKey)
}

export function setUserInfo(UserINfo: object) {
  return Cookies.set(UserINfoKey, JSON.stringify(UserINfo) || '')
}

export function getUserInfo() {
  return Cookies.get(UserINfoKey) || ''
}

export function removeUserInfo() {
  Cookies.remove(UserINfoKey)
}

export function getRouterTags() {
  return Cookies.get(RouterTagkey) || ''
}
export function setRouterTags(tags: breadcrumb[]) {
  return Cookies.set(RouterTagkey, JSON.stringify(tags) || '')
}

