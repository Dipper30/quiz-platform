'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Domain extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Domain.init({
    name: DataTypes.STRING,
    proportion: DataTypes.NUMBER,
    quiz_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Domain',
  });
  return Domain;
};