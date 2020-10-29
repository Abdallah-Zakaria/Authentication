'use strict';

const users = require('./users-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET || '123456789';
class Collection {
  constructor() {
  }
  async save(record) {
    const user = await users.find({ username: record.username });
    if (user.length == 0) {
      record.password = await bcrypt.hash(record.password, 5);
      const newRecord = new users(record);
      return newRecord.save();
    }
    return Promise.reject();
  }
  async authenticate(user, password) {
    const obj = await users.find({ username: user });
    const valid = await bcrypt.compare(password, obj[0].password);
    return valid ? obj : Promise.reject();
  }
  generateToken(user, time) {
    try {
      const token = jwt.sign({ username: user.username }, SECRET, {
        expiresIn: time,
      });
      console.log(token);
      return token;
    } catch (err) {
      console.log(err);
    }
  }
  listAll() {
    let allUser = users.find({});
    return allUser;
  }
  read(element) {
    const query = element ? { username: element } : {};
    return users.find(query);
  }
  async authenticateToken(token) {
    try {
      const tokenObject = jwt.verify(token, SECRET);
      console.log('TOKEN OBJECT', tokenObject);
      let checkDB = await this.read(tokenObject.username);
      if (checkDB) {
        return Promise.resolve(tokenObject);
      } else {
        return Promise.reject();
      }
    } catch (e) {
      return Promise.reject(e.message);
    }
  }
}
module.exports = new Collection();