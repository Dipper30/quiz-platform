import BaseValidator from './BaseValidator'
import { isBetween, createError, Validate } from '../utils/validate'
import v from 'validator'

class AuthValidator extends BaseValidator {

  async checkLogin (req: any, res: any, next: any): Promise<any> {
    try {
      const { username, password } = req.body
      console.log(username, password)
      const v = Validate(username).Between(4, 18).check()
        && Validate(password).Between(6, 18).check()
      if (!v) throw createError()
      next()
    } catch (error) {
      next(error)
    }
  }


}

export default new AuthValidator()