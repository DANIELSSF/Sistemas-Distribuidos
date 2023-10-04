const { DataTypes } = require('sequelize');
const database = require('../database/config');

const UserSubject = database.define('UserSubject', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  subjectId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Subjects',
      key: 'id',
    },
  },
  note: {
    type: DataTypes.FLOAT,
    validate: { min: 1.0, max: 5.0 },
  },
});

module.exports = UserSubject;
