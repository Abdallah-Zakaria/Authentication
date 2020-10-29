'use strict';
const basicAuth = require('../../src/middleware/basicAuth');
const supergoose = require('@code-fellows/supergoose');
const { server } = require('../../src/server');
const mockRequest = supergoose(server);
let req = {};
let res;
req.headers = '';
const next = jest.fn();
describe('valid basicAuth middleware', () => {
  it(`nothing the headers`, () => {
    basicAuth(req, res, next);
    expect(next).toHaveBeenCalledWith('Invalid Login');
  });
  it(`wrong user`, () => {
    return mockRequest.post('/signup').send({ 'username': 'username1', 'password': 'pass' }).then(async () => {
      req = { 'headers': { 'authorization': 'basicAuth testtest' } };
      await basicAuth(req, res, next);
      expect(next).toHaveBeenCalledWith('Invalid Login');
    });
  });
  it(`Successful signin`, () => {
    return mockRequest.post('/signup').send({ 'username': 'test', 'password': 'test' }).then(async () => {
      req.user = { user: 'test', pass: 'test' };
      await basicAuth(req, res, next);
      expect(next).toHaveBeenCalledTimes(2);
      expect(req.user.user).toEqual('test');
    });
  });
});