import QuizService from "../service/QuizService";
import { InitQuiz } from "../types";
import BaseController from "./BaseController";

class Quiz extends BaseController {

  async initQuiz (req: any, res: any, next: any): Promise<any> {
    try {
      const data: InitQuiz = req.body

      const quiz = await QuizService.initQuiz(data)
      // const valid: AuthValidator = new AuthValidator(data)
      // if (!valid.checkAuthParam()) throw new ParameterException()

      // const user: any = await AuthService.loginAccount(data)
      // if (isError(user)) throw user
      // if (!user) throw new AuthException(errCode.LOGIN_ERROR, 'Wrong Username or Password I Guess...')

      // // logged in, return a token
      // const t = new TokenService({ userID: user.id, username: user.username })
      // const token = t.generateToken()

      res.json({
        code: 200,
        data: {
          quiz
        },
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new Quiz()