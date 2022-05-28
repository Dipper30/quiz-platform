import axios from 'axios'
import { BASE_URL as url, PORT as port } from '../config/env'
import { errorMessage, getToken } from '../utils'

const env = import.meta.env
const { MODE } = env
const BASE_URL: string = url[MODE]
const PORT: string = port[MODE]

export const apiBaseURL = 'http://' + BASE_URL +':' + PORT + '/api/v1'
// console.log('base_url', env, apiBaseURL)

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
    default:
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
export const uploadFiles = (url: string, files: File[], param: any): Promise<APIResponse> => {
  const formData = new FormData()
  for (const key in param) {
    formData.append(`${key}`, param[key])
  }
  for (const file of files) formData.append('file', file)
  return http.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8',
    },
  })
}