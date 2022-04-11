import { ParameterException } from '../exception'
import { isEmptyValue } from '../utils/tools'
import { createError, Validate } from '../utils/validate'
import BaseValidator from './BaseValidator'

class QuizValidator extends BaseValidator {


  constructor () {
    super()
  }

  checkInitQuiz (req: any, res: any, next: any) {
    try {
      next()
    } catch (error) {
      next(error)
    }
  }

  checkGetQuiz (req: any, res: any, next: any) {
    try {
      const { id } = req.params
      const v = Validate(id).Numeric().Between(1, 2, false).check()
      if (!v) throw createError('Wrong ID')
      next()
    } catch (error) {
      next(error)
    }
  }

}

export default new QuizValidator()