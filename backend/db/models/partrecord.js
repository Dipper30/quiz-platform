'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PartRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PartRecord.init({
    history_id: DataTypes.INTEGER,
    part_id: DataTypes.INTEGER,
    partchoice_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PartRecord',
  });
  return PartRecord;
};