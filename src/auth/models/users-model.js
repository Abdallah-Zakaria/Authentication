'use strict';
const mongoose = require('mongoose');

const users = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: { type: String,require: true, default: 'user' },
});

module.exports = mongoose.model('users ', users);