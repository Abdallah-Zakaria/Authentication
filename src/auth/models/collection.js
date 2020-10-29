'use strict';

const users = require('./users-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET || '123456789';
const permissions = { user: ['read'], writer: ['read', 'create'], editor: ['read', 'create', 'update'], admin: ['read', 'create', 'update', 'delete'] };
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
  async can(permission) {
    const userData = await users.find({ username: permission.user });
    const role = userData[0].permissions;
    const check = permissions[role].includes(permission.capability);
    if (check) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = new Collection();