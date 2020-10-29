'use strict';

const supergoose = require('@code-fellows/supergoose');
const { server } = require('../src/server.js');
const mockRequest = supergoose(server);
const collection = require('../src/auth/models/collection');
describe('auth test', () => {
  it('signup test', async () => {
    const obj = { username: 'username1', password: 'pass' };
    return mockRequest.post('/signup').send(obj).then(record => {
      expect(record.status).toEqual(200);
    });
  });
  it('signin test', () => {
    const obj = { username: 'username2', password: 'pass' };
    return mockRequest.post('/signup').send(obj).then(async () => {
      return mockRequest.post('/signin').auth(obj.username, obj.password).then((record) => {
        expect(record.status).toEqual(200);
      });
    });
  });
  it('error', () => {
    return mockRequest.get('/foo').then((record) => {
      expect(record.status).toBe(404);
    });
  });
  it('vaild secret route', () => {
    const obj = { username: 'username3', password: 'pass' };
    return mockRequest.post('/signup').send(obj).then(() => {
      return mockRequest.post('/signin').auth(obj.username, obj.password).then((data) => {
        return mockRequest.get('/secret').set({ 'Authorization': `bearer ${data.body.token}` }).then((record) => {
          expect(record.status).toEqual(200);
        });
      });
    });
  });
  it('optional expired time for the user', () => {
    const obj = { username: 'username4' };
    const testToken = collection.generateToken(obj, '10min');
    return mockRequest.get('/secret').set({ 'Authorization': `bearer ${testToken}` }).then((record) => {
      expect(record.status).toEqual(200);
    });
  });
  it('test after expired time', () => {
    const obj = { username: 'username5' };
    const testToken = collection.generateToken(obj, '0second');
    return mockRequest.get('/secret').set({ 'Authorization': `bearer ${testToken}` }).then((record) => {
      expect(record.status).toEqual(500);
    });
  });
});
