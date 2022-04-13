'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Choice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async getTotalPointsByQuestionId(id) {
      return await Choice.findAll({
        where: { question_id: id },
        attributes: [[sequelize.fn('sum', sequelize.col('score')), 'totalPoints']],
      })
    }
  }
  Choice.init({
    description: DataTypes.STRING,
    seq: DataTypes.INTEGER,
    question_id: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    destroyed: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Choice',
  });
  return Choice;
};