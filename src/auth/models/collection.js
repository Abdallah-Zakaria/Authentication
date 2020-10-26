'use strict';

const users = require('./users-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const obj = await users.find({username :user});
    const valid = await bcrypt.compare(password, obj[0].password);
    return valid ? obj : Promise.reject();
  }
  generateToken(user) {
    const token =  jwt.sign({ username: user.username }, 123456789);
    return token;
  }
  listAll(){
    let allUser =  users.find({});
    return allUser;
  }
  read(element) {
    const query = element ? { username:element } : {};
    return users.find(query);
  }
}
module.exports = new Collection();