import reduxStore from '../store'
import { message } from 'antd';

/**
 * check if the result from request is instance of Error
 * if true, notify error and return false
 * else notify success message and return true
 * @param {any} res 
 * @param {boolean} notifySuccess 
 * @returns 
 */
export const handleResult = (res: any, notifySuccess = true, notifyMessage = 'Success!') => {
  if (isError(res)) {
    // if (res?.code == 10003) {
    //   router.push('/no-auth')
    // }
    // if (res?.code == 10002) {
    //   return true
    // }
    errorMessage(res.msg)
    // generator.generateNotify(res.msg || 'Unknown Error', 3200, 'error')
    return false
  } else {
    if (notifySuccess) {
      successMessage(notifyMessage)
      // generator.generateNotify(notifyMessage, 3000, 'success')
    }
    return true
  }
}

/**
 * check if the parameter is an Error
 * @param {any} p  
 * @returns boolean
 */
export const isError = (p: any) => {
  return p?.code != 200 && p?.code != 201
}

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
  message.success(msg);
}

export const errorMessage = (msg: string) => {
  message.error(msg);
}

export const warningMessage = (msg: string) => {
  message.warning(msg);
}