import axios, { AxiosResponse } from 'axios'
import { BASE_URL as url, PORT as port } from '../config/env'
import { errorMessage, getToken } from '../utils'
import { APIResponse } from '../vite-env'

const env = import.meta.env
const { MODE } = env
const BASE_URL: string = url[MODE]
const PORT: string = port[MODE]

// const apiBaseURL = env.SERVER_URL + '/api/v1'
// const apiBaseURL = process.env.REACT_APP_ENVIRONMENT == 'local' ? 'http://10.215.23.201:8080/api/v1' : 
  // (process.env.REACT_APP_ENVIRONMENT == 'development' ? 'http://localhost:8080/api/v1' : '')
export const apiBaseURL = 'http://' + BASE_URL +':' + PORT + '/api/v1'
console.log('base_url', env, apiBaseURL)
// export const apiBaseURL = `//${window.location.host}/api/v1`;
// export const baseURL = `//${window.location.host}/signing-up`;

export const mHttpConfig = {
  warn: 0,
}

export const http = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  withCredentials: true,
})

http.defaults.headers.post['Content-Type'] = 'application/json'

http.interceptors.request.use(
  (config: any) => {
    let token = getToken()
    config.headers.token = token
    return config
  },
)

http.interceptors.response.use(
  (response: any) => {
    const { data } = response
    const { code, msg } = data
    switch (code) {
    case 0:
      return data
    case 10002:
      // token error
      errorMessage('You are not authorized! Please log in as Admin.')
      return { code, msg }
    // case 10003:
    //   console.log('not authorized')
    //   window.open('no-auth')
    //   break
    default:
      // if (mHttpConfig.warn === 0) {
      //   ElMessage.error('网络错误：' + msg);
      // }
      // throw msg;
      return data
    }
  },
  (error: Error) => error,
)

/**
 * get request
 */
export const get = (url: string, params?: any): Promise<APIResponse> => {
  if (!params) return http.get(url)
  let count = 1
  for (let attr in params) {
    url += count == 1 ? '?' : '&' 
    url += (attr + '=' + params[attr])
    count++
  }
  return http.get(url)
}

/**
 * post request
 */
export const post = (url: string, params?: any): Promise<APIResponse> => {
  if (!params) return http.post(url)
  return http.post(url, params)
}

/**
 * file uploader
 */
export const uploadFiles = (url: string, files: File[], param: any[]) => {
  // const file = e.target.files[0]
  const formData = new FormData()
  for (let p of param) formData.append(p.prop, p.value)
  for (let file of files) formData.append('file', file)
  return http.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8',
    },
  })
}