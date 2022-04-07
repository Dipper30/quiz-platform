import QuizService from "../service/QuizService";
import { Choice, InitQuiz, Question } from "../types";
import { isEmptyValue, isError } from "../utils/tools";
import BaseController from "./BaseController";

class Quiz extends BaseController {

  async initQuiz (req: any, res: any, next: any): Promise<any> {
    try {
      const data: InitQuiz = req.body

      const quiz = await QuizService.initQuiz(data)

      res.json({
        code: 200,
        msg: 'ok',
        data: {
          quiz
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async createOrUpdateQuestion (req: any, res: any, next: any): Promise<any> {
    try {
      const data: Question = req.body
      const { id } = data
      const question = isEmptyValue(id)
        ? await QuizService.createQuestion(data)
        : await QuizService.updateQuestion(data)
      if (isError(question)) throw question

      res.json({
        code: 201,
        msg: 'ok',
        data: {
          question,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteQuestion (req: any, res: any, next: any): Promise<any> {
    try {
      const data: Question = req.body
      const deleted = await QuizService.deleteQuestion(data)
      if (isError(deleted)) throw deleted

      res.json({
        code: 201,
        msg: 'deleted',
        data: null,
      })
    } catch (error) {
      next(error)
    }
  }

  async createOrUpdateChoice (req: any, res: any, next: any): Promise<any> {
    try {
      const data: Choice = req.body
      const { id } = data
      const choice = isEmptyValue(id)
        ? await QuizService.createChoice(data)
        : await QuizService.updateChoice(data)
      if (isError(choice)) throw choice

      res.json({
        code: 201,
        msg: 'ok',
        data: {
          choice,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteChoice (req: any, res: any, next: any): Promise<any> {
    try {
      const data: Choice = req.body
      const deleted = await QuizService.deleteChoice(data)
      if (isError(deleted)) throw deleted

      res.json({
        code: 201,
        msg: 'deleted',
        data: null,
      })
    } catch (error) {
      next(error)
    }
  }

  async getQuizById (req: any, res: any, next: any): Promise<any> {
    try {
      const data: { id: Number } = req.params
      const quiz = await QuizService.getQuizById(data)

      res.json({
        code: 200,
        msg: 'ok',
        data: {
          quiz,
        }
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Quiz()