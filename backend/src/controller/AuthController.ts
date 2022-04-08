import BaseController from './BaseController'
import { AuthException, ParameterException, TokenException } from '../exception'
import { errCode } from '../config'
import { AuthService, TokenService } from '../service'
import { isError } from '../utils/tools'
import { Account } from '../types/common'

class Auth extends BaseController {

  async login (req: any, res: any, next: any): Promise<any> {
    try {
      const data: Account = req.body
      // const valid: AuthValidator = new AuthValidator(data)
      // if (!valid.checkAuthParam()) throw new ParameterException()

      const user: any = await AuthService.loginAccount(data)
      if (isError(user)) throw user
      if (!user) throw new AuthException(errCode.LOGIN_ERROR, 'Wrong Username or Password I Guess...')

      // logged in, return a token
      const token = TokenService.generateToken({ userID: user.id, username: user.username })

      res.json({
        code: 200,
        data: {
          user,
          token,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async loginByToken (req: any, res: any, next: any): Promise<any> {
    try {
      const userID = TokenService.veryTokenWithID(req.headers.token)
      if (!userID) throw new TokenException()

      const user = await AuthService.findAccountByUserID(userID)
      if (!user) throw new TokenException()

      const newToken = TokenService.generateToken({ userID: user.id, username: user.username })

      res.json({
        code: 200,
        data: {
          user,
          token: newToken,
        },
      })

    } catch (error) {
      next(error)
    }
  }
}

export default new Auth()