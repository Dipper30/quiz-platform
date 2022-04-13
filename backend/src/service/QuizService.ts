import BaseService from "./BaseService"
import { Op } from 'sequelize'
import { GetQuiz, Choice, Domain, InitQuiz, Question, Part } from "../types"
import { ParameterException, QuizException } from "../exception"
import { errCode } from "../config"
import { isEmptyValue, omitFields } from "../utils/tools"
import { domainToASCII } from "url"

const models = require('../../db/models/index.js')
const { sequelize } = require('../../db/models')
const {
  User: UserModel,
  Quiz: QuizModel,
  Domain: DomainModel,
  Part: PartModel,
  PartChoice: PartChoiceModel,
  Recommendation: RecommendationModel,
  Question: QuestionModel,
  Choice: ChoiceModel,
} = models

class Quiz extends BaseService {

  constructor () {
    super()
  }

  async initQuiz (data: InitQuiz) {
    const t = await sequelize.transaction()
    const { domains } = data

    try {
      // create quiz
      const newQuiz = await QuizModel.create({
        title: data.title,
        tag: data.tag ?? '',
        description: data.description ?? '',
        total_points: data.total_points,
        destroyed: false,
      }, { transaction: t })

      const qid = newQuiz.id

      // create domains

      for (let dIndex = 0; dIndex < domains.length; dIndex++) {
        const domain = domains[dIndex]
        const domainModel = await DomainModel.create({
          name: domain.domainName,
          proportion: domain.proportion,
          seq: domain.seq,
          quiz_id: qid,
        }, { transaction: t })

        const domainId = domainModel.id
        const { parts } = domain

        // append parts
        for (let pIndex = 0; pIndex < parts.length; pIndex++) {
          const part = parts[pIndex]
          const partModel = await PartModel.create({
            name: part.partName,
            seq: part.seq,
            destroyed: false,
            domain_id: domainId,
          }, { transaction: t })

          const partId = partModel.id

          // append choices and recommendaitons
          const { choices, recommendations } = part
          await PartChoiceModel.bulkCreate(
            choices.map(choice => ({
              description: choice.description,
              show_sub: choice.willShowSubQuestions,
              seq: choice.seq,
              part_id: partId
            })), { transaction: t }
          )
          await RecommendationModel.bulkCreate(
            recommendations.map(recommendation => ({
              show_under: recommendation.showUnder,
              link: recommendation.link,
              part_id: partId,
            })), { transaction: t }
          )

        }
      }

      await t.commit()
      return omitFields(newQuiz.dataValues, ['destroyed'], true)
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  async deleteQuiz (qid: number) {
    try {
      const quiz = await QuizModel.findByPk(qid)
      if (!quiz) throw new QuizException(errCode.QUIZ_ERROR, 'Quiz Not Found.')
      quiz.destroyed = true
      await quiz.save()
      return true
    } catch (error) {
      return error
    }
  }

  async getQuizzes (sort: string = 'create') {
    if (!sort) sort = 'create'
    try {
      const order = sort == 'create' ? [['createdAt', 'DESC']] : [['updatedAt', 'DESC']]
      const quizzes = await QuizModel.findAll({
        where: { destroyed: false },
        attributes: {
          exclude: this.excludeAttributes,
          include: [this.formatDate('createdAt')],
        },
        order,
      })
      if (!quizzes) return []
      return quizzes
      // return omitFields(quizzes, ['destroyed'], false)
    } catch (error) {
      return error
    }
  }
  
  async createQuestion (data: Question) {
    try {
      const { description, isMulti, partId, imgSrc, choices } = data

      const ifPartExists = await PartModel.findByPk(partId)
      if (!ifPartExists) throw new QuizException(errCode.QUIZ_ERROR, 'Part does not exist.')

      // make sure the sequence number is unique
      const priorQuestions = await QuestionModel.findAll({
        where: { part_id: partId, destroyed: false },
      })
      const seq = this.findMaxSeq(priorQuestions) + 1

      const questionModel = await QuestionModel.create({
        description,
        seq,
        is_multi: isMulti,
        part_id: partId,
        destroyed: false,
        imgSrc: imgSrc || null,
      })

      const qid = questionModel.id
      const newQuestion = questionModel.dataValues
      newQuestion.choices = []
      let choiceSeq = this.findMaxSeq(priorQuestions) + 1
      for (let index = 0; index < choices.length; index++) {
        const choice = choices[index]
        // make sure the sequence number is unique
        const priorChoices = await ChoiceModel.findAll({
          where: { question_id: qid, destroyed: false },
        })
        
        const choiceModel = await ChoiceModel.create({
          seq: choiceSeq++,
          description: choice.description,
          score: choice.score,
          question_id: qid,
          destroyed: false,
        })

        newQuestion.choices.push(choiceModel.dataValues)
      }

      return newQuestion
    } catch (error) {
      return error
    }
  }

  async updateQuestion (data: Question) {
    try {
      const { id, description, seq, isMulti, partId, imgSrc } = data
      const question = await QuestionModel.findByPk(id)
      if (!question) throw new QuizException(errCode.QUIZ_ERROR, 'Question not exists.')

      // check if partId is changed
      if (!isEmptyValue(partId)) {
        const ifPartExists = await PartModel.findByPk(partId)
        if (!ifPartExists) throw new QuizException(errCode.QUIZ_ERROR, 'Part does not exist.')
        question.part_id = partId
      }

      // make sure the sequence number is unique
      if (!isEmptyValue(seq)) {
        const priorQuestions = await QuestionModel.findAll({
          where: { part_id: question.part_id, destroyed: false },
        })
        if (priorQuestions && priorQuestions.find((q: any) => q.seq == seq && q.id != question.id)) {
          throw new QuizException(errCode.QUIZ_ERROR, 'Duplicate Seq Number!')
        }
        question.seq = seq
      }

      if (!isEmptyValue(description)) question.description = description
      if (!isEmptyValue(isMulti)) question.is_multi = isMulti
      if (!isEmptyValue(imgSrc)) question.img_src = imgSrc

      await question.save()

      return omitFields(question.dataValues, ['destroyed'], true)
    } catch (error) {
      return error
    }
  }

  async deleteQuestion (data: Question) {
    try {
      const { id } = data
      const deleted = await QuestionModel.update(
        { destroyed: true },
        { where: { id } },
      )
      return Boolean(deleted)
    } catch (error) {
      return error
    }
  }

  async createChoice (data: Choice) {
    // try {
    //   const { description, questionId, score } = data
    //   const ifQuestionExists = await QuestionModel.findByPk(questionId)
      
    //   if (!ifQuestionExists) throw new QuizException(errCode.QUIZ_ERROR, 'Question does not exist.')

    //   // make sure the sequence number is unique
    //   const priorChoices = await ChoiceModel.findAll({
    //     where: { question_id: questionId, destroyed: false },
    //   })
    //   if (priorChoices && priorChoices.find((c: any) => c.seq == seq)) {
    //     throw new QuizException(errCode.QUIZ_ERROR, 'Duplicate Seq Number!')
    //   }

    //   const newChoice = await ChoiceModel.create({
    //     description,
    //     seq,
    //     question_id: questionId,
    //     destroyed: false,
    //     score,
    //   })

    //   return omitFields(newChoice.dataValues, ['destroyed'], true)

    // } catch (error) {
    //   return error
    // }
  }

  async updateChoice (data: Choice) {
    try {
      const { id, description, seq, questionId, score } = data
      const choice = await ChoiceModel.findByPk(id)
      if (!choice) throw new QuizException(errCode.QUIZ_ERROR, 'Choice not exists.')

      // check if questionId is changed
      if (!isEmptyValue(questionId)) {
        const ifQuestionExists = await PartModel.findByPk(questionId)
        if (!ifQuestionExists) throw new QuizException(errCode.QUIZ_ERROR, 'Question does not exist.')
        choice.question_id = questionId
      }

      // make sure the sequence number is unique
      if (!isEmptyValue(seq)) {
        const priorChoices = await ChoiceModel.findAll({
          where: { question_id: choice.question_id, destroyed: false },
        })
        if (priorChoices && priorChoices.find((c: any) => c.seq == seq && c.id != choice.id)) {
          throw new QuizException(errCode.QUIZ_ERROR, 'Duplicate Seq Number!')
        }
        choice.seq = seq
      }

      if (!isEmptyValue(description)) choice.description = description
      if (!isEmptyValue(score)) choice.score = score

      await choice.save()

      return omitFields(choice.dataValues, ['destroyed'], true)
    } catch (error) {
      return error
    }
  }

  async deleteChoice (data: Choice) {
    try {
      const { id } = data
      const deleted = await QuestionModel.update(
        { destroyed: true },
        { where: { id } },
      )
      return Boolean(deleted)
    } catch (error) {
      return error
    }
  }

  async getQuizById (data: { id: Number }, showDestroyed: Boolean = false) {
    try {
      const { id } = data
      const quizModel = await QuizModel.findByPk(id, { 
        attributes: {
          include: [this.formatDate('createdAt')],
          exclude: this.excludeAttributes,
        },
      })
      if (!quizModel || (!showDestroyed && quizModel.destroyed == true)) throw new QuizModel(errCode.QUIZ_ERROR, 'Quiz Not Found.')

      const quiz: GetQuiz = quizModel.dataValues

      const domainModels = await DomainModel.findAll({
        where: { quiz_id: quiz.id },
        attributes: { exclude: this.excludeAttributes },
      })

      // append domains to quiz
      quiz.domains = domainModels.map((v: any) => v.dataValues)
      
      // append parts to each domain
      for (let index = 0; index < quiz.domains.length; index++) {
        const domain = quiz.domains[index]
        const partModels = await PartModel.findAll({
          where: { domain_id: domain.id },
          attributes: { exclude: this.excludeAttributes },
        })
        domain.parts = partModels.map((v: any) => v.dataValues)

        for (let pIndex = 0; pIndex < domain.parts.length; pIndex++) {
          const part = domain.parts[pIndex]

          // calculate total points
          const questionModels = await QuestionModel.findAll({
            where: { part_id: part.id },
            attributes: { include: ['id'] },
          })
          let sum = 0
          for (let qIndex = 0; qIndex < questionModels.length; qIndex++) {
            const qid = questionModels[qIndex].id
            const total = await ChoiceModel.getTotalPointsByQuestionId(qid)
            sum += total
          }
          part.totalPoints = sum

          // append choices and recommendations to each part
          const partChoiceModels = await PartChoiceModel.findAll({
            where: { part_id: part.id },
            attributes: { exclude: this.excludeAttributes },
          })
          const recommendationModels = await RecommendationModel.findAll({
            where: { part_id: part.id },
            attributes: { exclude: this.excludeAttributes },
          })
          part.choices = partChoiceModels.map((v: any) => v.dataValues)
          part.recommendations = recommendationModels.map((v: any) => v.dataValues)
        }
      }
      
      return quiz
    } catch (error) {
      return error
    }
  }

  async getQuestions (data: { pid: Number }, withAuth: Boolean = false, showDestroyed: Boolean = false) {
    try {
      const { pid } = data
      
      const questionModels = await QuestionModel.findAll({
        where: { part_id: pid, destroyed: false },
        attributes: { exclude: this.excludeAttributes },
      })

      const questions: Question[] = questionModels?.map((question: any) => question.dataValues)
      
      // append choices to each question
      for (let index = 0; index < questions.length; index++) {
        const question = questions[index]
        const choiceModels = await ChoiceModel.findAll({
          where: { question_id: question.id, destroyed: false },
          attributes: { exclude: this.excludeAttributes },
        })
        question.choices = choiceModels?.map((choice: any) => choice.dataValues)
      }

      return questions
    } catch (error) {
      return error
    }
  }

  async getQuestionsWithAuth (data: { pid: Number }, showDestroyed: Boolean = false) {
    try {
      const { pid } = data
      // const questions =       
    } catch (error) {
      return error
    }
  }

  findMaxSeq (arr: any[]): number {
    let max = 0
    arr.map(v => {
      if (v.seq > max) max = v.seq
    })
    return max
  }
}

export default new Quiz()