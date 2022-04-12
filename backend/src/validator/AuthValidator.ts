import BaseValidator from './BaseValidator'
import { createError, Validate } from '../utils/validate'

class AuthValidator extends BaseValidator {

  async checkLogin (req: any, res: any, next: any): Promise<any> {
    try {
      const { username, password } = req.body
      const v = Validate(username).Between(4, 18)
        && Validate(password).Between(6, 18)
      if (!v) throw createError()
      next()
    } catch (error) {
      next(error)
    }
  }

}

export default new AuthValidator()