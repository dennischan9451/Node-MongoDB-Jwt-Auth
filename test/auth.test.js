const chai = require('chai');
const request = require('supertest');
const app = require('../src/app');
const user = require('./fixtures/user.json');

chai.should();

global.token = '';
global.bearerToken = '';

describe('Authentication', () => {
  describe('register', () => {
    it('should success in register', (done) => {
      request(app)
        .post('/api/auth/register')
        .send(user)
        .expect('Content-Type', /json/)
        .expect((res) => {
          res.status.should.equal(200);
          res.body.message.should.be.equal('Registered successfully');
        })
        .end(done);
    });

    it('should error in register', (done) => {
      request(app)
        .post('/api/auth/register')
        .send(user)
        .expect('Content-Type', /json/)
        .expect((res) => {
          res.status.should.equal(409);
          res.body.message.should.be.equal('Email has already been taken');
        })
        .end(done);
    });
  });

  describe('login', () => {
    it('should error in login', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({ username: user.email, password: `@${user.password}@` })
        .expect('Content-type', /json/)
        .expect((res) => {
          res.status.should.equal(401);
          res.body.message.should.be.equal('Invalid username or password');
        })
        .end(done);
    });

    it('should success in login', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({ username: user.email, password: user.password })
        .expect('Content-type', /json/)
        .expect((res) => {
          res.status.should.equal(200);
          res.body.message.should.be.equal('Login Successful!');
          global.token = res.header.authorization;
          global.bearerToken = `Bearer ${res.header.authorization}`;
        })
        .end(done);
    });
  });

  describe('user', () => {
    it('should get authenticated user', (done) => {
      request(app)
        .get('/api/auth/user')
        .set('Authorization', global.bearerToken)
        .expect((res) => {
          res.status.should.equal(200);
          res.body.data.email.should.equal(user.email);
        })
        .end(done);
    });

    it('should not get authenticated user', (done) => {
      request(app)
        .get('/api/auth/user')
        .expect((res) => {
          res.status.should.equal(401);
          res.body.message.should.equal('No authorization token was found');
        })
        .end(done);
    });
  });
});
