// const request = require('request');

// process.env.NODE_ENV = 'test';

const chai = require('chai');
const mongoose = require('mongoose');
const User = require('../../models/User.js');
const chaiHttp = require('chai-http');
const server = require('../../index');
const authService = require('../../services/AuthService');

let resToken;
let id;

chai.use(chaiHttp);
// Usermanagement testcases
describe('Users', () => {
  beforeEach((done) => { //Before each test we empty the database
    User.remove({}, (err) => {
      if (err) {
        console.log(err);
      } else {
        authService.setupUsers();
        done();
      }
    });
  });

  // already tested in AuthControllerTest but needed here to generate Authentication token
  describe('/POST AUTHENTICATE', () => {
    it('should return authentication token for next test', (done) => {
      const body = {
        username: 'superuser',
        password: '123qwe',
      };
      chai.request(server)
        .post('/api/v1/authenticate')
        .send(body)
        .end((err, res) => {
          const { token } = res.body;
          resToken = token;
          chai.expect(resToken).to.be.a('string');
          chai.expect(res).to.have.status(200);
          done();
        });
    });
  });
  // Test Route: /users/
  describe('/GET USERS', () => {
    it('tests whether the authentication with given token works ', (done) => {
      chai.request(server)
        .get('/api/v1/manage/users')
        .set('x-access-token', resToken)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.be.a('array');
          chai.expect(res.body).to.have.lengthOf(1);
          done();
        });
    });
  });
  describe('/GET USERS', () => {
    it('should fail cause no authentication token is set ', (done) => {
      chai.request(server)
        .get('/api/v1/manage/users')
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });
  });
  describe('/GET USERS', () => {
    it('should fwork with given authentication token ', (done) => {
      chai.request(server)
        .get('/api/v1/manage/users')
        .set('x-access-token', resToken)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('/GET USERS', () => {
    it('should fail cause invalid authentication token is used', (done) => {
      let resToken2 = resToken;
      resToken2 += '@';
      chai.request(server)
        .get('/api/v1/manage/users')
        .set('x-access-token', resToken2)
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });
  });
  describe('/POST USERS', () => {
    it('should fail cause no authentication token is sued', (done) => {
      const body = {
        username: 'Simon',
        password: 'Simon',
      };
      chai.request(server)
        .get('/api/v1/manage/users')
        .send(body)
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });
  });
  describe('/POST USERS', () => {
    it('should save a user with authentication token', (done) => {
      const body = {
        username: 'Simon',
        password: 'Simon',
      };
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', resToken)
        .send(body)
        .end((err, res) => {
          id = res.body.id;
          chai.expect(res.body).to.have.property('id');
          chai.expect(res.body.id).to.not.equal('null');
          chai.expect(res.body.success).to.be.true;
          chai.expect(res).to.have.status(200);
          done();
        });
    });
  });
  // TODO : Stuff with user_id
});
