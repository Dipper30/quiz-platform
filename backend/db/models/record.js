'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Record.init({
    question_id: DataTypes.INTEGER,
    choice_id: DataTypes.STRING,
    score: DataTypes.INTEGER,
    history_id: DataTypes.INTEGER
  }, {
    sequelize,
    // timestamps: false,
    modelName: 'Record',
  });
  return Record;
};