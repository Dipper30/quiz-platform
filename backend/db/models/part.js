'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Part extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Part.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    destroyed: DataTypes.BOOLEAN,
    domain_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Part',
  });
  return Part;
};