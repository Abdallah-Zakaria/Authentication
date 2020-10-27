'use strict';

const supergoose = require('@code-fellows/supergoose');
const jwt = require('jsonwebtoken');
const { server } = require('../src/server.js');
const mockRequest = supergoose(server);
describe('Authentication test', () => {
  it('POST to /signup to create a new user is valid', async () => {
    const obj = { username: 'test1', password: '1234' };
    return mockRequest.post('/signup').send(obj).send(obj).then(result => {
      expect(obj[name]).toEqual(result.body[name]);
    });
  });
  it('POST to /signin to login as a user is valid', () => {
    const obj = { username: 'test2', password: '123' };
    return mockRequest.post('/signup').send(obj).then(result => {
      return mockRequest.post('/signin').auth(obj.username, obj.password).then(() => {
        const token = jwt.verify(result.body.token, '123456789');
        expect(token).toBeDefined();
      });
    });
  });
  it('Error middleware function is valid', () => {
    return mockRequest.get('/foo')
      .then((result) => {
        expect(result.status).toBe(404);
      });
  });
});
