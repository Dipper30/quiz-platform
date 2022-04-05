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
    }
  }
  Question.init({
    description: DataTypes.STRING,
    seq: DataTypes.NUMBER,
    destroyed: DataTypes.BOOLEAN,
    is_multi: DataTypes.BOOLEAN,
    part_id: DataTypes.NUMBER,
    img_src: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};