'use strict';

const express = require('express');
const router = express.Router();
// modules
const userModel = require('./models/collection');
// middleware require
const finder = require('../middleware/basicAuth');
const oauth = require('../middleware/oauth');
router.use(express.json());

router.get('/oauth', oauth, (req, res) => {
  res.json({ token: req.token });
});

// routes
router.post('/signup', sginup);
router.post('/signin', finder, signin);
router.get('/users', finder, listAll);

// handler
function sginup(req, res) {
  userModel.save(req.body).then((user) => {
    const token = userModel.generateToken(user ,'15min');
    res.json({ token });
  });
}
async function signin(req, res) {
  await userModel.authenticate(req.user.user, req.user.pass).then(record => {
    res.json({ token: req.token, user: record });
  });
}
async function listAll(req, res) {
  const allUser = await userModel.listAll();
  res.json(allUser);
}

module.exports = router;