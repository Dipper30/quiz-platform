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
      const v = Validate(id).Numeric().Between(0, Number.MAX_SAFE_INTEGER, false)
      if (!v.isValid) throw createError('Wrong ID')
      next()
    } catch (error) {
      next(error)
    }
  }

  checkDeleteQuiz (req: any, res: any, next: any) {
    try {
      const { qid } = req.body
      const v = Validate(qid).Number()
      if (!v.isValid) throw createError()
      next()
    } catch (error) {
      next(error)
    }
  }

  async checkVisibility (req: any, res: any, next: any) {
    try {
      const { qid } = req.body
      const v = await Validate(qid).Number()
      if (!v.isValid) throw createError()
      next()
    } catch (error) {
      next(error)
    }
  }

  async checkSubmission (req: any, res: any, next: any) {
    try {
      const { parts, quizId } = req.body
      const p = Validate(parts).Array()
      const q = Validate(quizId).Number()
      if (!p.isValid || !q.isValid) throw createError()
      for (const part of parts) {
        const pid = Validate(part.pid).Number()
        const pcid = Validate(part.pcid).Number()
        const choices = Validate(part.choices).Array()
        if (!pid.isValid || !pcid.isValid ||!choices.isValid) throw createError()
        for (const choice of part.choices) {
          // if (!('qid' in choice) || !('cid' in choice)) throw createError()
          const qid = Validate(choice.qid).Number()
          const cid = Validate(choice.cid).Array()
          if (!qid.isValid || !cid.isValid) throw createError()
          for (const id of choice.cid) {
            const v = Validate(id).Number()
            if (!v.isValid) throw createError()
          }
        }
      }
      next()
    } catch (error) {
      next(error)
    }
  }

}

export default new QuizValidator()