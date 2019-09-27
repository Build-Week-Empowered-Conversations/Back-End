const server = require('./server');
const request = require('supertest');
const db = require('../database/dbConfig');
// const prepTestDB = require('../helpers/prepTestDB.js');

beforeEach(()=> db('Users').truncate());
// beforeEach(() => restrict.mockClear());
describe('server', () => {
  it('get /', async () => {
    const res = await request(server).get('/restricted');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      "message": "you need a token to play this game",
    });

  });
  it('post /register', async () => {
    const res = await request(server)
    .post('/register')
    .send({
        "firstName":"David",
        "lastName":"Blane",
        "username":"David1234",
        "password":"password",
        "phone":"+13164694360"
    })
    expect(res.status).toBe(201)

  });
});







// describe('pets', () => {
//   it('get /', async () => {
//     restrict.mockImplementationOnce((req, res, next) => {
//       console.log("I ran this test");
//       req.user = { id: 1 };
//       next();
//     });
//     const res = await request(server)
//           .get('/pets');
//     expect(res.status).toBe(200);
//     expect(restrict).toBeCalled();
//   });
//   // not restricted
//   it('get /:id', async () => {
//     const res = await request(server)
//           .get('/pets/1');
//     expect(res.status).toBe(200);
//     expect(restrict).not.toBeCalled();
//   });
//   it('get /:id 404', async () => {
//     const res = await request(server)
//           .get('/pets/900');
//     expect(res.status).toBe(404);
//     expect(restrict).not.toBeCalled();
//   });
// });