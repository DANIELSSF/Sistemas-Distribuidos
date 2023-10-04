const Subject = require('../models/Subject');
const User = require('../models/User');

const isUniqueSubject = async (id) => {
  const uniqueSubject = await Subject.findOne({
    where: { id },
  });

  if (uniqueSubject) {
    throw new Error(`Subject code in use`);
  }
  return true;
};

const isUniqueEmail = async (email) => {
  const uniqueEmail = await User.findOne({
    where: { email },
  });

  if (uniqueEmail) {
    throw new Error(`Email in use`);
  }
  return true;
};

const isValidUserId = async (userId) => {
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error(`User id ${userId} invalid`);
  }

  if (user.status === false) {
    throw new Error(`The user is already exist`);
  }
  return true;
};

const isValidStudentId = async (userId) => {
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error(`student id ${userId} invalid`);
  }
  if (user.role !== 'student') {
    throw new Error(`The user is not student`);
  }

  if (user.status === false) {
    throw new Error(`The user is already exist`);
  }
  return true;
};

const isValidSubjectId = async (subjectId) => {
  const subject = await Subject.findOne({ where: { id: subjectId } });

  if (!subject) {
    throw new Error(`Subject id ${subjectId} invalid`);
  }

  if (subject.status === false) {
    throw new Error(`The subject is already exist`);
  }
  return true;
};

const isValidNote = async (note) => {
  if (!note) throw new Error('Note is required');

  if (note < 1.0 || note > 5.0) {
    return res.status(400).json({
      msg: 'The score must be between 1.0 and 5.0',
    });
  }
  return true;
};

module.exports = {
  isUniqueEmail,
  isUniqueSubject,
  isValidNote,
  isValidSubjectId,
  isValidUserId,
  isValidStudentId,
};
