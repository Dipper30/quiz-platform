import { errCode } from '../config'
import BaseException from './BaseException'

class QuizException extends BaseException {

  constructor (code: number = errCode.QUIZ_ERROR, message?: string) {
    super(code, message)
  }
}

export default QuizException