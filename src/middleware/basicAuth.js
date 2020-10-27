const base64 = require('base-64');
const collection = require('../auth/models/collection');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    // headers = {authorization: 'basic klajdaksd'}
    const basicAuth = req.headers.authorization.split(' ').pop();
    const [user, pass] = base64.decode(basicAuth).split(':'); // => mahmoud:1234 => ['mahmoud','1234]
    collection.authenticate(user, pass)
      .then(async (validUser) => {
        req.token = await collection.generateToken(validUser[0]);
        req.data = [user, pass];
        next();
      })
      .catch((err) => next('Invalid Login'));
  }
};

