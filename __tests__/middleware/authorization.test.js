'use stict';

const supergoose = require('@code-fellows/supergoose');
const { server } = require('../../src/server');
const mockRequest = supergoose(server);

describe('Authorize Routes', () => {
  const user = {
    'username': 'a1',
    'password': 'a1',
    'permissions': 'user',
  };
  const writer = {
    'username': 'b1',
    'password': 'b1',
    'permissions': 'writer',
  };
  const editor = {
    'username': 'c1',
    'password': 'c1',
    'permissions': 'editor',
  };
  const admin = {
    'username': 'd1',
    'password': 'd1',
    'permissions': 'admin',
  };
  let tk;
  describe('User permissions',()=>{
    it('User can read', async () => {
      return mockRequest.post('/signup').send(user).then((data) => {
        return mockRequest.get('/read').set({ 'Authorization': `bearer ${data.body.token}` }).then((result) => {
          tk = data.body.token;
          expect(result.status).toEqual(200);
        });
      });
    });
    it(`User can't write`, async () => {
      return mockRequest.post('/add').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(500);
      });
    });
    it(`User can't update`, async () => {
      return mockRequest.put('/change').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(500);
      });
    });
    it(`User can't delete`, async () => {
      return mockRequest.delete('/remove').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(500);
      });
    });
  });
  describe('Writer permissions',()=>{
    it('Writer can read', async () => {
      return mockRequest.post('/signup').send(writer).then((data) => {
        return mockRequest.get('/read').set({ 'Authorization': `bearer ${data.body.token}` }).then((result) => {
          tk = data.body.token;
          expect(result.status).toEqual(200);
        });
      });
    });
    it(`Writer can write`, async () => {
      return mockRequest.post('/add').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(201);
      });
    });
    it(`Writer can't update`, async () => {
      return mockRequest.put('/change').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(500);
      });
    });
    it(`Writer can't delete`, async () => {
      return mockRequest.delete('/remove').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(500);
      });
    });
  });
  describe('Editor permissions',()=>{
    it('Editor can read', async () => {
      return mockRequest.post('/signup').send(editor).then((data) => {
        return mockRequest.get('/read').set({ 'Authorization': `bearer ${data.body.token}` }).then((result) => {
          tk = data.body.token;
          expect(result.status).toEqual(200);
        });
      });
    });
    it(`Editor can write`, async () => {
      return mockRequest.post('/add').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(201);
      });
    });
    it(`Editor can update`, async () => {
      return mockRequest.put('/change').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(202);
      });
    });
    it(`Editor can't delete`, async () => {
      return mockRequest.delete('/remove').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(500);
      });
    });
  });
  describe('Admin permissions',()=>{
    it('Admin can read', async () => {
      return mockRequest.post('/signup').send(admin).then((data) => {
        return mockRequest.get('/read').set({ 'Authorization': `bearer ${data.body.token}` }).then((result) => {
          tk = data.body.token;
          expect(result.status).toEqual(200);
        });
      });
    });
    it(`Admin can write`, async () => {
      return mockRequest.post('/add').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(201);
      });
    });
    it(`Admin can update`, async () => {
      return mockRequest.put('/change').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(202);
      });
    });
    it(`Admin can delete`, async () => {
      return mockRequest.delete('/remove').set({ 'Authorization': `bearer ${tk}` }).then((result) => {
        expect(result.status).toEqual(202);
      });
    });
  });
});