import BaseService from './BaseService'
import { Op } from 'sequelize'
import { GetQuiz, Choice, Domain, InitQuiz, Question, Part, Submission } from '../types'
import { ParameterException, QuizException } from '../exception'
import { errCode } from '../config'
import { isEmptyValue, isError, omitFields } from '../utils/tools'
import fs from 'fs'
import os from 'os'
import FileService from './FileService'

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
  Section: SectionModel,
  RelateQuestion: RelateQuestionModel,
  History: HistoryModel,
  Record: RecordModel,
  PartRecord: PartRecordModel,
} = models

class Quiz extends BaseService {

  constructor () {
    super()
  }

  async initQuiz (data: InitQuiz) {
    const t = await sequelize.transaction()
    const { sections } = data

    try {
      // create quiz
      const newQuiz = await QuizModel.create({
        title: data.title,
        tag: data.tag ?? '',
        description: data.description ?? '',
        total_points: data.totalPoints,
        visible: false, // by default it is invisible
        destroyed: false,
      }, { transaction: t })

      const qid = newQuiz.id

      // create sections

      for (let sIndex = 0; sIndex < sections.length; sIndex++) {
        const section = sections[sIndex]
        const sectionModel = await SectionModel.create({
          title: section.title,
          quiz_id: qid,
          destroyed: false,
        }, { transaction: t })

        const sectionId = sectionModel.id
        const { domains } = section

        // create domains

        for (let dIndex = 0; dIndex < domains.length; dIndex++) {
          const domain = domains[dIndex]
          const domainModel = await DomainModel.create({
            name: domain.domainName,
            proportion: domain.proportion,
            seq: domain.seq,
            section_id: sectionId,
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
              description: part.description,
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
      }

      await t.commit()
      return omitFields(newQuiz.dataValues, ['destroyed'], true)
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  async toggleVisibilityOfQuiz (data: { id: number }) {
    try {
      const quiz = await QuizModel.findByPk(data.id)
      if (!quiz) throw new QuizException(errCode.QUIZ_ERROR, 'Quiz Not Found.')
      
      quiz.visible = !quiz.visible
      await quiz.save()
      return true
    } catch (error) {
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

  /**
   * return all undestroyed quizzes with only their own attributes
   * @param {string} sort, default sorted by 'create' 
   * @param {boolean} showInvisible by default, invisible quizzes will not be queried
   * @returns 
   */
  async getQuizzes (sort: string = 'create', showInvisible: boolean = false) {
    if (!sort) sort = 'create'
    const criteria = showInvisible ? { destroyed: false } : { destroyed: false, visible: true }
    try {
      const order = sort == 'create' ? [['createdAt', 'DESC']] : [['updatedAt', 'DESC']]
      const quizzes = await QuizModel.findAll({
        where: criteria,
        attributes: {
          exclude: this.excludeAttributes,
          include: [this.formatDate('createdAt')],
        },
        order,
      })
      if (!quizzes) return []
      return quizzes
    } catch (error) {
      return error
    }
  }
  
  async createQuestion (data: Question) {
    const t = await sequelize.transaction()

    try {
      const { description, isMulti, partId, partChoices, imgSrc, choices } = data

      const ifExists = await PartChoiceModel.findByPk(partId)
      if (!ifExists) throw new QuizException(errCode.QUIZ_ERROR, 'Part does not exist.')

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
      }, { transaction: t })

      const qid = questionModel.id
      
      for (let partchoiceId of partChoices) {
        await RelateQuestionModel.create({
          question_id: qid,
          partchoice_id: partchoiceId,
        }, { transaction: t })
      }

      const newQuestion = questionModel.dataValues
      newQuestion.choices = []

      // make sure the sequence number is unique
      // const priorChoices = await ChoiceModel.findAll({
      //   where: { part_id: partId, destroyed: false },
      // })
      // let choiceSeq = this.findMaxSeq(priorChoices) + 1

      let choiceSeq = 1

      for (let index = 0; index < choices.length; index++) {
        const choice = choices[index]
        const choiceModel = await ChoiceModel.create({
          seq: choiceSeq++,
          description: choice.description,
          score: choice.score,
          question_id: qid,
          destroyed: false,
        }, { transaction: t })

        newQuestion.choices.push(choiceModel.dataValues)
      }
      await t.commit()
      return newQuestion
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  async updateQuestion (data: Question) {
    try {
      const { id, description, seq, isMulti, partchoiceId, imgSrc } = data
      const question = await QuestionModel.findByPk(id)
      if (!question) throw new QuizException(errCode.QUIZ_ERROR, 'Question not exists.')

      // check if partId is changed
      if (!isEmptyValue(partchoiceId)) {
        const ifExists = await PartModel.findByPk(partchoiceId)
        if (!ifExists) throw new QuizException(errCode.QUIZ_ERROR, 'Part does not exist.')
        question.partchoice_id = partchoiceId
      }

      // make sure the sequence number is unique
      if (!isEmptyValue(seq)) {
        const priorQuestions = await QuestionModel.findAll({
          where: { partchoice_id: question.partchoice_id, destroyed: false },
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

  /**
   * delete question by id
   * @param data 
   * @returns 
   */
  async deleteQuestion (data: { id: number }) {
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
      // const priorChoices = await ChoiceModel.findAll({
      //   where: { part_id: partId, destroyed: false },
      // })
      // let choiceSeq = this.findMaxSeq(priorChoices) + 1
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

      const sectionModels = await SectionModel.findAll({
        where: { quiz_id: quiz.id },
        attributes: { exclude: this.excludeAttributes },
      })

      // append sections to quiz
      quiz.sections = sectionModels.map((v: any) => v.dataValues)

      for (let sIndex = 0; sIndex < quiz.sections.length; sIndex++) {
        const section = quiz.sections[sIndex]
        const domainModels = await DomainModel.findAll({
          where: { section_id: section.id },
          attributes: { exclude: this.excludeAttributes },
        })

        // append domains to quiz
        section.domains = domainModels.map((v: any) => v.dataValues)

        // append parts to each domain
        for (let index = 0; index < section.domains.length; index++) {
          const domain = section.domains[index]
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
      }

      return quiz
    } catch (error) {
      return error
    }
  }

  async getQuestions (data: { pid: Number, pcid: Number }, withScore: Boolean = false) {
    try {
      const { pid, pcid } = data
      let questionModels
      if (pcid) {
        // search questions asscociated with specific part choice
        const realtionModels = await RelateQuestionModel.findAll({
          where: { partchoice_id: pcid },
          attributes: ['question_id'],
        })
        const qids = realtionModels.map((r: any) => r.question_id)

        questionModels = await QuestionModel.findAll({
          where: { part_id: pid, destroyed: false, id: { [Op.in]: qids } },
          attributes: { exclude: this.excludeAttributes },
        }) 
      } else {
        // search all questions in a part
        questionModels = await QuestionModel.findAll({
          where: { part_id: pid, destroyed: false },
          attributes: { exclude: this.excludeAttributes },
        })
      }
      if (!questionModels) throw new QuizException(errCode.QUIZ_ERROR, 'No questions found.')
      const questions: Question[] = questionModels?.map((question: any) => question.dataValues)

      // append choices to each question
      for (let index = 0; index < questions.length; index++) {
        const question = questions[index]

        // show what part choice the question is associated with
        const relations: any = await RelateQuestionModel.findAll({
          where: { question_id: question.id },
        })
        let partchoices: number[] = []
        relations && relations.map((r: any) => {
          partchoices.push(r.dataValues.partchoice_id)
        })
        const partChoiceModels = await PartChoiceModel.findAll({
          where: { id: { [Op.in]: partchoices } },
          attributes: { exclude: this.excludeAttributes },
        })
        question.partChoices = partChoiceModels ? partChoiceModels.map((v: any) => v.dataValues) : []

        const excludeAttributes = withScore ? this.excludeAttributes : ['score', ...this.excludeAttributes]
        const choiceModels = await ChoiceModel.findAll({
          where: { question_id: question.id, destroyed: false },
          attributes: { exclude: excludeAttributes },
        })
        question.choices = choiceModels?.map((choice: any) => choice.dataValues)
      
        const imgList = await FileService.readImage(question.id as number)
        question.imgList = imgList ? imgList : []
      }

      return questions
    } catch (error) {
      return error
    }
  }

  async getQuestionsWithScore (data: { pid: number, pcid: number }, showDestroyed: Boolean = false) {
    try {
      const { pid, pcid } = data
      let questionModels
      if (pcid) {
        // search questions asscociated with specific part choice
        questionModels = await RelateQuestionModel.findAll({
          where: { partchoice_id: pcid },
          include: [{
            model: QuestionModel,
          }]
        })
      } else {
        // search all questions in a part
        questionModels = await QuestionModel.findAll({
          where: { part_id: pid, destroyed: false },
          attributes: { exclude: this.excludeAttributes },
        })
      }

      const questions: Question[] = questionModels?.map((question: any) => question.dataValues)

      // append choices to each question
      for (let index = 0; index < questions.length; index++) {
        const question = questions[index]

        // show what part choice the question is associated with
        const relations: any = await RelateQuestionModel.findAll({
          where: { question_id: question.id },
        })
        let partchoices: number[] = []
        relations && relations.map((r: any) => {
          partchoices.push(r.dataValues.partchoice_id)
        })
        const partChoiceModels = await PartChoiceModel.findAll({
          where: { id: { [Op.in]: partchoices } },
          attributes: { exclude: this.excludeAttributes },
        })
        question.partChoices = partChoiceModels ? partChoiceModels.map((v: any) => v.dataValues) : []

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

  async createHistory (data: Submission) {
    const t = await sequelize.transaction()
    const { quizId, parts } = data
    try {
      const history = await HistoryModel.create({
        quiz_id: quizId,
      }, { transaction: t })
      if (!history) throw new QuizException()
      const history_id = history.id

      for (const part of parts) {
        const partRecord = await PartRecordModel.create({
          history_id,
          part_id: part.pid,
          partchoice_id: part.pcid,
        }, { transaction: t })
        if (!partRecord) throw new QuizException()

        for (const choice of part.choices) {
          const record = await RecordModel.create({
            history_id,
            question_id: choice.qid,
            choice_id: choice.cid.join(',')
          }, { transaction: t })
          if (!record) throw new QuizException()
        }
      }
      await t.commit()
      return history_id
    } catch (error) {
      await t.rollback()
      return error
    }
  }

  async calculateScore (hid: number) {
    try {
      const history = await HistoryModel.findByPk(hid)
      if (!history) throw new QuizException()
      const quizId = history.quiz_id
      const quiz: any = {}
      const quizModel = await QuizModel.findByPk(quizId)
      if (!quizModel) throw new QuizException(errCode.QUIZ_ERROR, 'Quiz Not Found.')
      quiz.id = quizModel.id
      quiz.title = quizModel.title
      quiz.totalPoints = quizModel.total_points

      // get sections
      const sectionModels = await SectionModel.findAll({
        where: {
          quiz_id: quiz.id,
          destroyed: false,
        },
        attributes: ['id', 'title'],
      })
      quiz.sections = sectionModels.map((s: any) => s.dataValues) || []

      // get domains
      for (const section of quiz.sections) {
        const domainModels = await DomainModel.findAll({
          where: { section_id: section.id },
          attributes: ['id', 'name', 'proportion'],
          order: [['createdAt']]
        })
        section.domains = domainModels.map((d: any) => d.dataValues) || []

        // get parts
        for (const domain of section.domains) {
          const partModels = await PartModel.findAll({
            where: { domain_id: domain.id, destroyed: false },
            attributes: ['id', 'name', 'seq'],
            order: [['seq']],
          })

          domain.parts = partModels.map((p: any) => p.dataValues) || []
          
          // get part choices and recommendations
          for (const part of domain.parts) {
            const partChoiceModels = await PartChoiceModel.findAll({
              where: { part_id: part.id },
              attributes: { exclude: this.excludeAttributes },
            })
            const recommendationModels = await RecommendationModel.findAll({
              where: { part_id: part.id },
              attributes: { exclude: this.excludeAttributes },
              order: [['show_under', 'desc']],
            })
            part.choices = partChoiceModels.map((v: any) => v.dataValues)
            part.recommendations = recommendationModels.map((v: any) => v.dataValues)
            
            // get part record
            const partRecordModel = await PartRecordModel.findAll({
              where: { history_id: hid, part_id: part.id }
            })
            if (!partRecordModel || partRecordModel.length == 0) throw new QuizException(errCode.QUIZ_ERROR, 'No Part Record Found.')
            part.partRecord = partRecordModel[0].partchoice_id // part choice selected by user
            
            // get questions
            const questionModels = await QuestionModel.findAll({
              where: { part_id: part.id, destroyed: false },
              attributes: ['id', 'description', 'is_multi'],
              include: [
                {
                  model: ChoiceModel,
                  as: 'choices',
                  order: [['id']],
                  attributes: { exclude: this.excludeAttributes },
                }
              ],
              order: [[ { model: ChoiceModel, as: 'choices' }, 'seq']],
            })
            part.questions = questionModels.map((q: any) => q.dataValues)

            const subQuestionModels = await RelateQuestionModel.findAll({
              where: { partchoice_id: part.partRecord },
              attributes: ['question_id'],
            })
            const subQuestions = subQuestionModels.map((s: any) => s.question_id)

            const recordModels = await RecordModel.findAll({
              where: { history_id: hid, question_id: { [Op.in]: subQuestions } },
              attributes: ['question_id', 'choice_id', 'score'],
            })

            const records = recordModels.map((r: any) => {
              r = r.dataValues
              r.choice_id = r.choice_id.split(',').map((v: any) => Number(v))
              return r
            })
            part.questions.map((question: any) => {
              const qid = question.id
              // calculate question score
              for (const record of records) {
                if (record.question_id == qid) {
                  question.record = record.choice_id
                  let score = 0
                  for (const choice of question.choices) {
                    if (question.record.includes(choice.id)) {
                      if (choice.score === 0) {
                        // selected wrong answer
                        score = 0
                        break
                      } else score += choice.score
                    }
                  }
                  question.score = score
                } 
              }
            })

            // calculate part score
            part.score = part.questions.reduce((prev: number, cur: any) => prev + cur.score || 0, 0)
            part.totalPoints = part.questions.filter((q: any) => subQuestions.includes(q.id))
            .reduce((prev: number, question: any) => prev + question.choices.reduce((prev: number, cur: any) => prev + cur.score, 0), 0)
          }

          // calculate domain score
          domain.score = domain.parts.reduce((prev: number, cur: any) => prev + cur.score, 0)
          domain.totalPoints = domain.parts.reduce((prev: number, cur: any) => prev + cur.totalPoints, 0)
        }

        // calculate section score
        section.score = section.domains.reduce((prev: number, cur: any) => prev + (cur.score ? cur.score / cur.totalPoints * cur.proportion : 0), 0)
      }

      quiz.score = quiz.sections.reduce((prev: number, cur: any) => prev + (cur.score || 0), 0) / quiz.sections.length

      return quiz
    } catch (error) {
      return error
    }
  }

  /**
   * get history ids by quiz id
   * @param qid 
   * @returns {Number[]} an array of history ids
   */
  async findAllHistoriesByQuizId (qid: number) {
    try {
      const histories = await HistoryModel.findAll({
        where: { quiz_id: qid },
        attributes: ['id'],
      })
      if (!histories || histories.length == 0) throw new QuizException(errCode.QUIZ_ERROR, 'No Record')
      return histories.map((h: any) => h.id)
    } catch (error) {
      return error
    }
  }

    /**
   * write score data to csv file according to quiz id
   */
  async initCSVFileByQuizId (qid: number) {
    const outputFileName = `r/score_${qid}.csv`
    // clear file if already exists
    if (fs.existsSync(outputFileName)) {
      await fs.writeFileSync(outputFileName, '')
    }
    const fileCreated = await FileService.mkDirRecursive(outputFileName)
    if (!fileCreated) throw new QuizException(errCode.QUIZ_ERROR, 'File Not Created')
    try {
      const historyIdList = await this.findAllHistoriesByQuizId(qid)
      if (isError(historyIdList)) throw historyIdList

      let data = ''
      let headers = ''
      let line = ''
      // write to file by line
      for (const hid of historyIdList) {
        const record = await this.calculateScore(hid)
        if (!record) break
        line = this.generateScoreLine(record, hid)
        if (!headers) {
          const len = line.split(',').length
          headers = 'hid'
          for (let i = 1; i < len; i++) {
            headers += ',Q' + i
          }
          data += headers + '\n'
        }
        data += line + '\n'
        line = ''
      }

      fs.writeFileSync(outputFileName, data)
      return true
    } catch (error) {
      return error
    }
  }

  async generateDetailedCSVFileByQuizId (qid: number) {
    const outputFileName = `r/detailed_records_${qid}.csv`
    // clear file if already exists
    if (fs.existsSync(outputFileName)) {
      await fs.writeFileSync(outputFileName, '')
    }
    const fileCreated = await FileService.mkDirRecursive(outputFileName)
    if (!fileCreated) throw new QuizException(errCode.QUIZ_ERROR, 'File Not Created')
    try {
      const historyIdList = await this.findAllHistoriesByQuizId(qid)
      if (isError(historyIdList)) throw historyIdList

      let data = ''
      let headers = ''
      let line = ''
      // write to file by line
      for (const hid of historyIdList) {
        const record = await this.calculateScore(hid)
        if (!record) break
        const details = await this.generateDetailedScoreLine(record, hid)
        line = details.line
        if (!headers) {
          const arr = line.split(',')
          console.log('arr ', arr)
          headers = 'hid'
          for (let i = 1; i < arr.length; i++) {
            if (i > details.questionCount) break
            headers += ',Q' + i
          }
          headers += ',Overall Score'
          for (const section of record.sections) {
            headers += `,${section.title}`
          }
          data += headers + '\n'
        }
        data += line + '\n'
        line = ''
      }

      fs.writeFileSync(outputFileName, data)
      return true
    } catch (error) {
      return error
    }
  }

  generateScoreLine (score: any, hid: number) {
    if (!score) return ''
    let line = `${hid}`
    for (const section of score.sections) {
      for (const domain of section.domains) {
        for (const part of domain.parts) {
          for (let index = 0; index < part.questions.length; index++) {
            const score = part.questions[index]?.score ? 1 : 0
            line += (',' + score)
          }
        }
      }
    }
    return line
  }

  async generateDetailedScoreLine (score: any, hid: number) {
    if (!score) return { line: '', questionCount: 0 }
    let line = `${hid}`
    const sequence = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
    let questionCount = 0
    for (const section of score.sections) {
      for (const domain of section.domains) {
        for (const part of domain.parts) {
          for (let index = 0; index < part.questions.length; index++) {
            // get choices from users
            const q = part.questions[index]
            const choiceModels = await RecordModel.findAll({
              where:{
                history_id: hid,
                question_id: q.id,
              }
            })
            let i = 0
            let userChoices = ''
            for (const c of choiceModels) {
              userChoices += sequence[i++]
            }
            line += (',' + userChoices)
            questionCount++
          }
        }
      }
    }
    line += `,${score.score.toFixed(2)}`
    for (const section of score.sections) {
      line += `,${section.score.toFixed(2)}`
    }
    return { line, questionCount }
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