import { errCode, keys } from '../config'
import { TokenException } from '../exception'
import { Exception } from '../types/common'
import { getUnixTS } from '../utils/tools'
import { createError, Validate } from '../utils/validate'
import BaseValidator from './BaseValidator'

const jwt = require('jsonwebtoken')

class TokenValidator extends BaseValidator {

  constructor () {
    super()
  }

  verifyToken (req: any, res: any, next: any) {
    const { token } = req.headers
    if (!token) throw new TokenException()
    try {
      const res: { exp: Number } = jwt.verify(token, keys.TOKEN_PRIVATE_KEY) || {}
      const { exp } = res
      const current = getUnixTS()
      // if current timestamp is larger than the expire time, return false
      if (current > exp) throw new TokenException(errCode.TOKEN_ERROR, 'Token Expires.')
      next()
    } catch (error) {
      next(error)
    }
  }

  checkGetQuiz (req: any, res: any, next: any) {
    try {
      const { id } = req.params
      const v = Validate(id).Numeric().Between(1, 2, false)
      if (!v) throw createError('Wrong ID')
      next()
    } catch (error) {
      next(error)
    }
  }

}

export default new TokenValidator()