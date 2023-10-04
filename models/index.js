const User = require('./User');
const Subject = require('./Subject');
const UserSubject = require('./UserSubject');

User.belongsToMany(Subject, {
  through: UserSubject,
  foreignKey: 'userId',
  as: 'subjects',
});

Subject.belongsToMany(User, {
  through: UserSubject,
  foreignKey: 'subjectId',
  as: 'students',
});

UserSubject.belongsTo(User, {
  foreignKey: 'userId',
});
UserSubject.belongsTo(Subject, {
  foreignKey: 'subjectId',
});

const syncTables = async () => {
  return Promise.all([
    await User.sync({ alter: true }),
    await Subject.sync({ alter: true }),
    await UserSubject.sync({ alter: true }),
  ]);
};

syncTables()
  .then(() => {
    console.log('Tablas creadas');
  })
  .catch((error) => {
    console.error('Error al crear las tablas:', error);
  });

module.exports = { User, Subject, UserSubject };
