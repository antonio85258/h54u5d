const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Course = sequelize.define('Course', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Course;
