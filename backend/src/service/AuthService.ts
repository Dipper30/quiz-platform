import { Account } from '../types/common'
import BaseService from './BaseService'

const models = require('../../db/models/index.js')
const { sequelize } = require('../../db/models')
import { Op } from 'sequelize'

const {
  User: UserModel,
} = models

class Auth extends BaseService {

  constructor () {
    super()
  }

  async loginAccount (params: Account) {
    let { username, password } = params
    try {
      if (username == process.env.USERNAME && password == process.env.PASSWORD) {
        return { username: 'Admin' }
      }

      // if users are allowed to create accounts and login, uncomment codes below
      // const p: string = encryptMD5(password)
      // const lowerUsername: string = username.toLowerCase()
      // const user = await UserModel.findOne({
      //   where: { 
      //     username: sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), lowerUsername),
      //   },
      // })
      // if (!user) {
      //   const created = await UserModel.create({
      //     username,
      //     password: p
      //   })
      //   return created
      // } else {
      //   if (p != user.password) throw new AuthException(errCode.AUTH_ERROR, 'Wrong Password')
      //   else {
      //     return omitFields(user.dataValues, ['password'])
      //   }
      // }
    } catch (error) {
      return error
    }
  }

}

export default new Auth()