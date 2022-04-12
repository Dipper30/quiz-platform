const { sequelize } = require('../../db/models')
export default class BaseService {

  excludeAttributes = ['destroyed', 'createdAt', 'updatedAt']

  dateFormat = '%Y-%m-%d %h:%i:%s'

  formatDate (originalFieldName: string, format: string = this.dateFormat, newFieldName: string = originalFieldName) {
    return [sequelize.fn('date_format', sequelize.col(originalFieldName), format), newFieldName]
  }
  // omitFileds (obj: any): Object {
  //   if (!(obj.dataValues)) return obj
  //   const newObj = {}
  //   Reflect.ownKeys(obj).forEach(key => {
  //     if (!this.fields.includes(key)) {
  //       newObj[key] = obj[key]
  //     }
  //   })
  //   return newObj
  // }
}

