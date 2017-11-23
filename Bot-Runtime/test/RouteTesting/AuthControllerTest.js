// const request = require('request');

// process.env.NODE_ENV = 'test';

const chai = require('chai');
const mongoose = require('mongoose');
const User = require('../../models/User.js');
const chaiHttp = require('chai-http');
const server = require('../../index');
const authService = require('../../services/AuthService');

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach((done) => { //Before each test we empty the database
    User.remove({}, (err) => {
      if (err) {
        console.log(err);
      } else {
        done();
      }
    });
    authService.setupUsers(); // here we add a superuser which is needed for testing
  });
  // POST AUTHENTICATE
  describe('/POST AUTHENTICATE', () => {
    it('should fail at adding user cause user not registered in database and therefore not authorized', (done) => {
      const body = {
        username: 'simon',
        password: 'simon',
      };
      chai.request(server)
        .post('/api/v1/authenticate')
        .send(body)
        .end((err, res) => {
          chai.expect(res).to.have.status(401);
          done();
        });
    });
  });
  describe('/POST AUTHENTICATE', () => {
    it('should return authentication token', (done) => {
      const body = {
        username: 'superuser',
        password: '123qwe',
      };
      chai.request(server)
        .post('/api/v1/authenticate')
        .send(body)
        .end((err, res) => {
          chai.expect(res.body.token).to.be.a('string');
          chai.expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('/POST AUTHENTICATE', () => {
    it('should fail with bad request', (done) => {
      chai.request(server)
        .post('/api/v1/authenticate')
        .send(null)
        .end((err, res) => {
          chai.expect(res).to.have.status(401);
          done();
        });
    });
  });
});
