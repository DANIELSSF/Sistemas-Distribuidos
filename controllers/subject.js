const { request, response } = require('express');
const { Subject } = require('../models');

const getSubjects = async (req = request, res = response) => {
  try {
    const subjects = await Subject.findAll();

    res.status(201).json({
      subjects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the admin',
    });
  }
};

const getSubject = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findOne({
      where: { id },
    });

    if (!subject) {
      return res.status(400).json({
        msg: 'Subject not found',
      });
    }

    res.status(201).json({
      subject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the admin',
    });
  }
};

const createSubject = async (req = request, res = response) => {
  const { body } = req;

  try {
    const newSubject = await Subject.create(body);
    res.status(201).json({
      newSubject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the admin',
    });
  }
};

const updateSubject = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, id: uid, ...subjectData } = req.body;
  try {
    const subject = await Subject.findOne({
      where: { id },
    });

    if (!subject) {
      return res.status(400).json({
        msg: 'Subject not found',
      });
    }

    if (subjectData.id === subject.id) {
      return res.status(401).json({ msg: 'Subject id already exist' });
    }

    await subject.update(subjectData);
    await subject.save();

    res.status(200).json({ subject });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the admin',
    });
  }
};

const deleteSubject = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findOne({
      where: { id },
    });

    if (!subject) {
      return res
        .status(401)
        .json({ msg: `Subject with the id ${id} already exist` });
    }

    await subject.update({ status: false });
    await subject.save();

    res.status(200).json({ msg: `Subject deleted` });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the admin',
    });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};
