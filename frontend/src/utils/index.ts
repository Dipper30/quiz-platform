import reduxStore from '../store'
import { message } from 'antd'

/**
 * check if the result from request is instance of Error
 * if true, notify error and return false
 * else notify success message and return true
 * @param {APIResponse} res 
 * @param {boolean} notifySuccess 
 * @returns 
 */
export const handleResult = (res: APIResponse, notifySuccess = true, notifyMessage = 'Success!') => {
  if (isError(res) && res.code != 10002) {
    errorMessage(res.msg)
    return false
  } else {
    if (notifySuccess) {
      successMessage(notifyMessage)
    }
    return true
  }
}

/**
 * check if the parameter is an Error
 * @param {APIResponse} res
 * @returns boolean
 */
export const isError = (res: APIResponse) => {
  return res?.code != 200 && res?.code != 201
}

/**
 * If value is null | undefined | NaN, returns true
 */
export const isEmptyValue = (v: any) => !v && v != 0 && v != ''

export const getUID = () => {
  const store = reduxStore.getState()
  return store?.user?.id || Number(localStorage.getItem('uid')) || null
}

export const getUsername = () => {
  const store = reduxStore.getState()
  return store?.user?.username || 'offline'
}

export const getToken = () => {
  return localStorage.getItem('token') || null
}

export const getUser = () => {
  const store = reduxStore.getState()
  return store?.user || null
}

export const successMessage = (msg: string) => {
  message.success(msg)
}

export const errorMessage = (msg: string) => {
  message.error(msg)
}

export const warningMessage = (msg: string) => {
  message.warning(msg)
}

export const getLocalStorage = (key: string) => localStorage.getItem(key)

export const setLocalStorage = (key: string, value: string) => localStorage.setItem(key, value)

export const isObject = (obj: any): boolean => {
  return Object.prototype.toString.call(obj) == '[object Object]'
}

export const isArray = (arr: any): boolean => {
  return Object.prototype.toString.call(arr) == '[object Array]'
}

export const deepClone: (<T>(obj: T) => T) = (obj) => {
  if (!isObject(obj) && !isArray(obj)) {
    return obj
  }
  if (isArray(obj)) {
    const arr: any = []
    for (let o of (obj as any)) {
      arr.push(deepClone(o))
    }
    return arr
  }
  if (isObject(obj)) {
    const o: any = {}
    for (let key in obj) {
      o[key] = deepClone(obj[key])
    }
    return o
  }
  return obj
}

