const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).json({
      msg: 'Token is required',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_PRIVATE_JWT);
    const userAuth = await User.findOne({
      where: { id: uid },
    });

    if (!userAuth) {
      return res.status(401).json({
        msg: 'Token invalid',
      });
    }

    if (!userAuth.status) {
      return res.status(401).json({
        msg: 'Token invalid',
      });
    }

    req.userAuth = userAuth;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token invalid',
    });
  }
};

module.exports = {
  validateJWT,
};
