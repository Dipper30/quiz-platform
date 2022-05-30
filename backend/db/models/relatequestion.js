'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RelateQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RelateQuestion.belongsTo(models.Question, { foreignKey: 'question_id', targetKey: 'id' })
      RelateQuestion.belongsTo(models.PartChoice, { foreignKey: 'partchoice_id', targetKey: 'id' })
    }

  }
  RelateQuestion.init({
    question_id: DataTypes.INTEGER,
    partchoice_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    modelName: 'RelateQuestion',
  });
  return RelateQuestion;
};