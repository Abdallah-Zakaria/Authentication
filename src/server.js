'use strict';

// dependency
const express = require('express');
const app = express();
require('dotenv').config();
// modules 
const userModel = require('./auth/models/collection');
// middleware require
const finder = require('./middleware/model-finder')
// middleware 
app.use(express.json());
// app.use(finder)
// routes
app.get('/', () => {
  console.log('hi')
})
app.post('/signup', sginup);
app.post('/signin', finder, signin);
app.get('/users' , finder,listAll)

// handler
function sginup(req, res) {
  userModel.save(req.body).then((user) => {
    userModel.generateToken(user).then(token => {
      res.json({ token });
    })
  });
}
function signin(req, res) {
  userModel.authenticate(req.data[0], req.data[1]).then(record => {
    res.json({ token: req.token, user: record })
  })
}
async function listAll(req,res){
  const allUser = await userModel.listAll()
  res.json(allUser)
}
// export server
module.exports = {
  server: app,
  start: (port) => {
    port = process.env.PORT || port;
    app.listen(port, () => {
      console.log(`listing to port ${port}`);
    });
  },
};