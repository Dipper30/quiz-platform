import BaseService from "./BaseService"
import { Op } from 'sequelize'
import { InitQuiz } from "../types"

const models = require('../../db/models/index.js')
const { sequelize } = require('../../db/models')
const {
  User: UserModel,
  Quiz: QuizModel,
  Domain: DomainModel,
  Part: PartModel,
  PartChoice: PartChoiceModel,
  Recommendation: RecommendationModel,
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
        destroyed: true,
      })

      const qid = newQuiz.id
      console.log('quiz id', newQuiz.id)

      // create domains
      const newDomains = await DomainModel.bulkCreate(
        domains.map(domain => ({
          name: domain.domainName,
          proportion: domain.proportion,
          quiz_id: qid,
        })
      ))

      console.log('new domains', newDomains)
      newDomains.map((d: any) => console.log(d.name))

      // create parts
      newDomains.map(async (domain: any, index: number) => {
        const { parts } = domains[index]
        const newParts = await PartModel.bulkCreate(
          parts.map(part => ({
            name: part.partName,
            destroyed: false,
            domain_id: domain.id,
          }))
        )

        // create choices
        newParts.map(async (part: any, index: number) => {
          const currentPart = parts[index]
          const { choices, recommendations } = currentPart
          await PartChoiceModel.bulkCreate(
            choices.map(choice => ({
              description: choice.description,
              show_sub: choice.willShowSubQuestions,
              seq: choice.seq,
              part_id: part.id,
            }))
          )
          await RecommendationModel.bulkCreate(
            recommendations.map(recommendation => ({
              show_under: recommendation.showUnder,
              link: recommendation.link,
              part_id: part.id,
            }))
          )
        })
      })

      await t.commit()
      return newQuiz
    } catch (error) {
      await t.rollback()
      return error
    }
  }
}

export default new Quiz()