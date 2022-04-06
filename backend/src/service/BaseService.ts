import Seq from 'sequelize'

export default class BaseService {
  fields = ['createdAt', 'updatedAt']

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

