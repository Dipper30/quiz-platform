'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.hasMany(models.Choice, { as: 'choices', foreignKey: 'question_id' })
    }
  }
  Question.init({
    description: DataTypes.STRING,
    seq: DataTypes.INTEGER,
    destroyed: DataTypes.BOOLEAN,
    is_multi: DataTypes.BOOLEAN,
    part_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};