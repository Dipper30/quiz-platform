import fs from 'fs'
import os from 'os'
import path from 'path'
// import { Parser } from 'json2csv'
import { ParameterException } from '../exception'
import {
  TokenService,
  QuizService,
} from "../service"
import { Choice, InitQuiz, Question } from "../types"
import { isEmptyValue, isError } from "../utils/tools"
import BaseController from "./BaseController"

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

  async toggleVisibilityOfQuiz (req: any, res: any, next: any): Promise<any> {
    try {
      const data: { qid: number } = req.body

      const quiz = await QuizService.toggleVisibilityOfQuiz({ id: data.qid })

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

  /**
   * show quizzes' abstracts excluding invisible ones
   */
  async getQuizzes (req: any, res: any, next: any): Promise<any> {
    try {
      const { sort } = req.query
      const quizzes = await QuizService.getQuizzes(sort, false)
      
      res.json({
        code: 200,
        msg: 'ok',
        data: {
          quizzes
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * show quizzes' abstracts including invisible ones
   */
  async getAllQuizzes (req: any, res: any, next: any): Promise<any> {
    try {
      const { sort } = req.query
      const quizzes = await QuizService.getQuizzes(sort, true)
      
      res.json({
        code: 200,
        msg: 'ok',
        data: {
          quizzes
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteQuiz (req: any, res: any, next: any): Promise<any> {
    try {
      const data: { qid: number } = req.body
      const deleted = await QuizService.deleteQuiz(data.qid)
      if (isError(deleted)) throw deleted
      
      res.json({
        code: 201,
        msg: 'ok',
        data: null,
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
      const data: { id: number } = req.body
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

  /**
   * get questions by part id 
   */
  async getQuestionsWithScore (req: any, res: any, next: any): Promise<any> {
    try {
      const pid = Number(req.query.pid)
      const pcid = Number(req.query.pcid)
      const data = { pid, pcid }
      const questions = await QuizService.getQuestions(data, true)

      res.json({
        code: 200,
        msg: 'ok',
        data: {
          partId: pcid,
          questions,
        }
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * get questions with choices, except scores of each choice
   */
  async getQuestions (req: any, res: any, next: any): Promise<any> {
    try {
      const pid = Number(req.query.pid)
      const pcid = Number(req.query.pcid)
      const data = { pid, pcid }
      const questions = await QuizService.getQuestions(data, false)

      res.json({
        code: 200,
        msg: 'ok',
        data: {
          partId: pid,
          questions,
        }
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * submit quiz
   */
  async submitQuiz (req: any, res: any, next: any): Promise<any> {
    try {
      const historyId = await QuizService.createHistory(req.body)
      if (isError(historyId)) throw historyId
      
      const quiz = await QuizService.calculateScore(historyId)
      if (isError(quiz)) throw quiz

      res.json({
        code: 200,
        msg: 'ok',
        data: {
          historyId,
          quiz,
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async getHistory (req: any, res: any, next: any): Promise<any> {
    try {
      const historyId = Number(req.params.id)
      const quiz = await QuizService.calculateScore(historyId)
      if (isError(quiz)) throw quiz

      res.json({
        code: 200,
        msg: 'ok',
        data: {
          historyId,
          quiz,
        }
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * get csv file
   */
  async getRecords (req: any, res: any, next: any): Promise<any> {
    const strOutputFileName = 'records/output.csv'
    const fWrite = fs.createWriteStream(strOutputFileName)  
    try {
      const { id } = req.params // quiz id
      if (!id) throw new ParameterException()
      const historyIdList = await QuizService.findAllHistoriesByQuizId(id)
      if (isError(historyIdList)) throw historyIdList

      let headers = ''
      // write to file by line
      for (const hid of historyIdList) {
        const record = await QuizService.calculateScore(hid)
        let line = ''
        for (const section of record.sections) {
          for (const domain of section.domains) {
            for (const part of domain.parts) {
              for (let index = 0; index < part.questions.length; index++) {
                const score = part.questions[index].score || 0
                if (!line) line += score
                else line += (',' + score)
              }
            }
          }
        }
        if (!headers) {
          const len = line.split(',').length
          for (let i = 0; i < len; i++) {
            if (i === 0) headers += 'Q' + (i + 1)
            else headers += ',Q' + (i + 1)
          }  
          fWrite.write(headers + os.EOL)
        }
        fWrite.write(line + os.EOL)
      }

      var options = {
        root: path.join(__dirname)
      }
      res.sendFile('output.csv', { root: 'records' }, function (err: any, data: any) {
        if (err) {
          res.writeHead(404)
          res.end(JSON.stringify(err))
          return
        }
      })
      // fs.readFile('records/output.csv', function (err: any, data: any) {
      //   if (err) {
      //     res.writeHead(404)
      //     res.end(JSON.stringify(err))
      //     return
      //   }
      //   res.header('Content-Type', 'text/csv')
      //   res.writeHead(200)
      //   res.end(data)
      // })
      // const csv = JSONToCSV(req.body, { fields: ["Customer Name", "Business Name", "Customer Email", "Customer ID", "School ID", "Student Count", "Admin Count", "Courses Count" ]})
      // res.header('Content-Type', 'text/csv');
      // res.attachment('output.csv')
      // res.send(csv)
      // res.json({
      //   msg: 'ok'
      // })
    } catch (error) {
      next(error)
    } finally {
      fWrite.close()

    }
  }

}

export default new Quiz()