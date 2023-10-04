const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRET_PRIVATE_JWT,
      {
        expiresIn: '4h',
      },
      (err, jwt) => {
        if (err) {
          console.log(err);
          return reject('Error to generate jwt');
        }
        resolve(jwt);
      }
    );
  });
};

module.exports = {
  generateJWT,
};
