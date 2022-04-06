'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PartChoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PartChoice.init({
    description: DataTypes.STRING,
    show_sub: DataTypes.BOOLEAN,
    seq: DataTypes.INTEGER,
    part_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PartChoice',
  });
  return PartChoice;
};