const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const { generateJWT } = require('../helpers/generate-jwt');
const { userSeed } = require('../database/userSeed');
const { User, UserSubject, Subject } = require('../models');

const createUser = async (req = request, res = response) => {
  const { body } = req;
  try {
    console.log(body);
    const userId = await User.findOne({
      where: {
        id: body.id,
      },
    });

    if (userId) {
      return res.status(401).json({
        msg: 'Id in use',
      });
    }

    const salt = bcryptjs.genSaltSync();
    const newPassword = bcryptjs.hashSync(body.password, salt);

    const user = await User.create({ ...body, password: newPassword });

    const jwt = await generateJWT(user.id);

    res.status(200).json({
      user,
      jwt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the administrator',
    });
  }
};

const getUsers = async (req = request, res = response) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the administrator',
    });
  }
};

const getUser = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({
        msg: 'User does not exist',
      });
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the administrator',
    });
  }
};

const loginUser = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        msg: 'Credentials invalids',
      });
    }

    const passwordValidate = await bcryptjs.compareSync(
      password,
      user.password
    );

    if (!passwordValidate) {
      return res.status(404).json({
        msg: 'Credentials invalids',
      });
    }

    const jwt = await generateJWT(user.id);

    res.status(200).json({
      user,
      jwt,
    });
  } catch (error) {}
};

const updateUser = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, password, ...userData } = req.body;
  try {
    const user = await User.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        msg: 'The user does not exist',
      });
    }

    const salt = bcryptjs.genSaltSync();
    const newPassword = bcryptjs.hashSync(password, salt);

    await user.update({ password: newPassword });
    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the admin',
    });
  }
};

const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;
  const url = `http://20.51.234.210:8080/university-0.0.1-SNAPSHOT/user/${id}`;
  try {
    const user = await User.findOne({
      where: { id },
    });

    if (!user) {
      res.status(401).json({
        msg: `User id ${id} already exist`,
      });
    }

    const response = await fetch(url, {
      method: 'DELETE',
    });

    const data = await response.json();
    console.log('User removed:', data);

    await user.update({ status: false });
    await user.save();

    res.status(201).json({
      msg: 'User removed',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the administrator',
    });
  }
};

const dataSeed = async (req = request, res = response) => {
  try {
    const salt = bcryptjs.genSaltSync();
    const password = bcryptjs.hashSync(userSeed.password, salt);

    const user = await User.create({ ...userSeed, password });
    const jwt = await generateJWT(user.id);

    res.status(200).json({
      user,
      jwt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the administrator',
    });
  }
};

const createUserSubjectNote = async (req = request, res = response) => {
  const { userId, subjectId } = req.params;
  let { note } = req.body;

  note = Math.round(note * 10) / 10;

  try {
    const newNote = await UserSubject.create({
      userId,
      subjectId,
      note,
    });

    res.status(200).json({
      newNote,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the administrator',
    });
  }
};

const updateUserSubjectNote = async (req = request, res = response) => {
  const { userId, subjectId } = req.params;
  let { note } = req.body;

  note = Math.round(note * 10) / 10;

  try {
    const userSubject = await UserSubject.findOne({
      where: { userId, subjectId },
    });

    if (!userSubject) {
      return res.status(404).json({
        msg: 'The relationship between the user and the subject matter was not found.',
      });
    }

    userSubject.note = note;
    await userSubject.save();

    res.status(201).json({
      userSubject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the administrator',
    });
  }
};

const getStudentAverage = async (req = request, res = response) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ where: { id: userId } });
    const userSubjects = await UserSubject.findAll({
      where: { userId },
      include: [Subject],
    });

    const sum = userSubjects.reduce(
      (acc, userSubject) => acc + userSubject.note,
      0
    );

    const subjects = userSubjects.map((userSubject) => ({
      subject: userSubject.Subject,
      note: userSubject.note,
    }));

    const parcialAverage = sum / userSubjects.length;
    const average = Math.round(parcialAverage * 10) / 10;

    const { name, id } = user;

    res.status(200).json({
      user: {
        id,
        name,
      },
      subjects,
      average,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the administrator',
    });
  }
};

module.exports = {
  createUser,
  createUserSubjectNote,
  dataSeed,
  deleteUser,
  getUser,
  getUsers,
  loginUser,
  updateUser,
  updateUserSubjectNote,
  getStudentAverage,
};
