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
      Choice.belongsTo(models.Question, { foreignKey: 'question_id', targetKey: 'id' })
    }

    // static getTotalPointsByQuestionId = async function (id) {
    //   const choices = await Choice.findAll({
    //     where: { question_id: id },
    //   })
    //   return choices.reduce((prev, cur) => prev + cur.score, 0)
    // }

  }
  Choice.init({
    description: DataTypes.STRING,
    seq: DataTypes.INTEGER,
    question_id: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    destroyed: DataTypes.BOOLEAN,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Choice',
  });
  // Choice.getTotalPointsByQuestionId = async function (id) {
  //   const choices = await Choice.findAll({
  //     where: { question_id: id },
  //   })
  //   return choices.reduce((prev, cur) => prev + cur.score, 0)
  // }
  return Choice;
};