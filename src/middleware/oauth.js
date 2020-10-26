'use strict';

require('dotenv').config();
const collection = require('../auth/models/collection');
const superagent = require('superagent');
const tokenServerUrl = 'https://github.com/login/oauth/access_token';
const remoteAPI = 'https://api.github.com/user';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;

module.exports = async (req, res, next) => {
  const code = req.query.code;
  console.log('1. CODE', code);
  const access_token = await exchangeCodeForToken(code);
  console.log('2. TOKEN', access_token);
  const remoteUser = await getRemoteUserInfo(access_token);
  console.log('3. REMOTE USER \n', remoteUser);
  const [user, token] = await getUser(remoteUser);
  console.log('USER & TOKEN', user, token);
  req.user = user;
  console.log('this is is ', req.user);
  req.token = token;
  next();
};

async function exchangeCodeForToken(code) {
  const tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });
  return tokenResponse.body.access_token;
}

async function getRemoteUserInfo(token) {
  const userResponse = await superagent
    .get(remoteAPI)
    .set('Authorization', `token ${token}`)
    .set('user-agent', 'express-app');

  return userResponse.body;
}

async function getUser(remoteUser) {
  const record = {
    username: remoteUser.login,
    password: 'oauthpassword',
  };
  const check = await collection.read(record.username);
  console.log('checkkkkkk ' ,check);
  if (check.length > 0) {
    const user = check;
    const token = collection.generateToken(user);
    return [user, token];
  } else {
    const user = await collection.save(record);
    const token = collection.generateToken(user);
    return [user, token];
  }
}