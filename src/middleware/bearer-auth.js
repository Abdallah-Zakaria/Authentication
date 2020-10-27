'use strict';
const collection = require('../auth/models/collection');
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    const token = req.headers.authorization.split(' ').pop();
    console.log('__TOKEN__', token);
    collection.authenticateToken(token).then((validUser) => {
      console.log(validUser);
      req.user = validUser;
      next();
    })
      .catch(() => {
        next('Invalid Login');
      });
  }
};