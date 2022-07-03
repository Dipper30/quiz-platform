import fs from 'fs'
import os from 'os'
import { errCode } from '../config'
// import { Parser } from 'json2csv'
import { FileException, ParameterException, QuizException } from '../exception'
import {
  TokenService,
  QuizService,
} from "../service"
import FileService from '../service/FileService'
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

      const deleteImage = await FileService.delDirRecursive(`images/questions/${data.id}/all`)
      if (!deleteImage) throw new FileException(errCode.FILE_ERROR, 'images not deleted properly')

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

      const qid = req.body.quizId
      const hid = historyId
      const outputFileName = `r/output${qid}.csv`

      const line = await QuizService.generateScoreLine(quiz, hid)
      if (line && !isError(line)) {
        fs.appendFileSync(outputFileName, line + '\n')
      }

      if (!fs.existsSync(outputFileName)) {
        const init = await QuizService.initCSVFileByQuizId(qid)
        if (isError(init)) throw init
      }

      const exec = require('child_process').exec

      exec(`rscript r/score.R r/output${qid}.csv ${historyId}`, (error: any, stdout: string, stderr: string) => {
        console.log({ error, stdout, stderr })
       
        if (error) {
          quiz.overallScore = 0
          console.log(error)
          res.json({
            code: 200,
            msg: 'ok',
            data: {
              historyId,
              quiz,
            }
          })
        } else {
          const re = /\s(\S+)/g
          const arr = re.exec(stdout)
          const score = (arr && arr.length > 1) ? arr[1] : 0
          quiz.overallScore = score
          res.json({
            code: 200,
            msg: 'ok',
            data: {
              historyId,
              quiz,
            },
          })
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
   * get csv file by quiz id
   */
  async getCSVFileOfScoreRecords (req: any, res: any, next: any): Promise<any> {
    try {
      
      const { id } = req.params // quiz id
      if (!id) throw new ParameterException()
      const init = await QuizService.initCSVFileByQuizId(id)
      if (isError(init)) throw init

      res.sendFile(`output${id}.csv`, { root: 'r' }, function (err: any, data: any) {
        if (err) {
          res.writeHead(404)
          res.end(JSON.stringify(err))
          return
        }
      })

    } catch (error) {
      next(error)
    }
  }

  /**
   * detailed csv file with choices of each question
   */
  async getCSVFileOfDetailedScoreRecords (req: any, res: any, next: any): Promise<any> {
    try {
      const { id } = req.params // quiz id
      if (!id) throw new ParameterException()
      const init = await QuizService.generateDetailedCSVFileByQuizId(id)
      if (isError(init)) throw init

      res.sendFile(`detailed_records_${id}.csv`, { root: 'r' }, function (err: any, data: any) {
        if (err) {
          res.writeHead(404)
          res.end(JSON.stringify(err))
          return
        }
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * get model score by history id
   */
  async getScore (req: any, res: any, next: any): Promise<any> {
    try {
      let { qid, hid } = req.query
      if (!qid || !hid) throw new ParameterException()
      hid = Number(hid) || 0
      qid = Number(qid) || 0
      const outputFileName = `r/output${qid}.csv`

      if (!fs.existsSync(outputFileName)) {
        const init = await QuizService.initCSVFileByQuizId(qid)
        if (isError(init)) throw init
      }
      
      const exec = require('child_process').exec

      exec(`rscript r/score.R output${qid}.csv`, (error: any, stdout: string, stderr: string) => {
        console.log({ error, stdout, stderr })
        if (error) {
          res.json({
            code: errCode.QUIZ_ERROR,
            msg: 'error',
            data: error,
          })
        } else {
          const re = /\s(\S+)/g
          const arr = re.exec(stdout)
          const score = (arr && arr.length > 1) ? arr[1] : 0
          res.json({
            code: 200,
            msg: 'ok',
            data: score,
          })
        }
      })
      
    
    } catch (error) {
      next(error)
    }
  }

  async uploadImage (req: any, res: any, next: any): Promise<any> {
    try {
      const { files } = req
      console.log(req.body)
      console.log(req.file)
      const data: { qid: number } = req.body
      console.log('@file ', files, data)

      if (!files) throw new FileException(errCode.NO_FILE_UPLOADED)
      if (!data || !data.qid) throw new FileException(errCode.FILE_ERROR, 'Require Quesiton ID.')
      
      const uploaded = await FileService.writeImage(files.file, data)
      if(isError(uploaded)) throw uploaded

      if (uploaded) {
        res.json({
          code: 201,
          msg: 'uploaded',
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getImage (req: any, res: any, next: any): Promise<any> {
    try {
      const { qid } = req.query
      if (!qid) throw new ParameterException()

      let imgList = await FileService.readImage(Number(qid))
      if (!imgList || isError(imgList)) imgList = []

      res.json({
        code: 200,
        data: {
          imgList,
        },
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Quiz()