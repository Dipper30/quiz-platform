'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recommendation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Recommendation.init({
    show_under: DataTypes.INTEGER,
    link: DataTypes.STRING,
    part_id: DataTypes.INTEGER
  }, {
    sequelize,
    // timestamps: false,
    modelName: 'Recommendation',
  });
  return Recommendation;
};