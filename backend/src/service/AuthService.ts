import { Account } from '../types/common'
import BaseService from './BaseService'

class Auth extends BaseService {

  constructor () {
    super()
  }

  async loginAccount (params: Account) {
    let { username, password } = params
    try {
      // if (username == process.env.USERNAME && password == process.env.PASSWORD) {
      if (username.toLocaleUpperCase() == 'ADMIN' && password == 'quiz123456') {
        return { username: 'Admin' }
      }
    } catch (error) {
      return error
    }
  }

}

export default new Auth()