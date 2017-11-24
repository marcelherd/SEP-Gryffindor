// const request = require('request');

// process.env.NODE_ENV = 'test';

const chai = require('chai');
const mongoose = require('mongoose');
const User = require('../../models/User');
const chaiHttp = require('chai-http');
const server = require('../../index');
const authService = require('../../services/AuthService');
const config = require('../../config');
const jwt = require('jsonwebtoken');


chai.use(chaiHttp);

describe('User Tests', () => {
  beforeEach((done) => {
    const payload = {
      username: 'Simon',
      admin: true,
    };

    this.token = jwt.sign(payload, config.secret, {
      expiresIn: '1d',
    });
    authService.setupUsers();
    done();
  });
  describe('/GET USERS', () => {
    it('should authenticate with given token ', (done) => {
      chai.request(server)
        .get('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.be.a('array');
          chai.expect(res.body).to.have.lengthOf(1);
          done();
        });
    });

    it('should fail cause no authentication token is set ', (done) => {
      chai.request(server)
        .get('/api/v1/manage/users')
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });

    it('should fail cause invalid authentication token is used', (done) => {
      let resToken = this.token;
      resToken += '@';
      chai.request(server)
        .get('/api/v1/manage/users')
        .set('x-access-token', resToken)
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });
  });
  describe('/POST USERS', () => {
    it('should fail cause no authentication token is used', (done) => {
      const body = {
        username: 'SimonA',
        password: 'SimonA',
      };
      chai.request(server)
        .post('/api/v1/manage/users')
        .send(body)
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });


    it('should save user from body with authentication token', (done) => {
      const body = {
        username: 'Simon',
        password: 'Simon',
      };
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .send(body)
        .end((err, res) => {
          this.id = res.body.id;
          chai.expect(res.body).to.have.property('id');
          chai.expect(res.body.id).to.not.equal('null');
          chai.expect(res.body.success).to.be.true;
          chai.expect(res).to.have.status(200);
          done();
        });
    });
    it('should fail cause invalid authentication token is used', (done) => {
      const body = {
        username: 'SimonS',
        password: 'SimonS',
      };
      let resToken = this.token;
      resToken += '@';
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', resToken)
        .send(body)
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });
  });
  describe('/GET/USERS user_id', () => {
    it('should return the user cause authentication token is set', (done) => {
      chai.request(server)
        .get(`/api/v1/manage/users/${this.id}`)
        .set('x-access-token', this.token)
        .end((err, res) => {
          chai.expect(res.body.username).to.equal('Simon');
          chai.expect(res.body.password).to.equal('Simon');
          chai.expect(res).to.have.status(200);
          done();
        });
    });
    it('should fail cause no authentication token is set(access denied)', (done) => {
      chai.request(server)
        .get(`/api/v1/manage/users/${this.id}`)
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });
    it('should fail cause wrong authenticaton token is used ', (done) => {
      let resToken = this.token;
      resToken += '@';
      chai.request(server)
        .get(`/api/v1/manage/users/${this.id}`)
        .set('x-access-token', resToken)
        .end((err, res) => {
          chai.expect(res.body.success).to.be.false;
          chai.expect(res).to.have.status(403);
          done();
        });
    });
    it('should fail cause user with given id doesnt exist ', (done) => {
      const myId = this.id + 1;
      chai.request(server)
        .get(`/api/v1/manage/users/${myId}`)
        .set('x-access-token', this.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });
  });
  describe('/DELETE/USERS user_id', () => {
    it('should fail cause no user with this id exists', (done) => {
      const id = this.id + 1;
      chai.request(server)
        .delete(`/api/v1/manage/users/${id}`)
        .set('x-access-token', this.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(404);
          done();
        });
    });
    it('should fail cause no authentication token is set(access denied)', (done) => {
      chai.request(server)
        .delete(`/api/v1/manage/users/${this.id}`)
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });
    it('should fail cause wrong authenticaton token is used ', (done) => {
      let resToken = this.token;
      resToken += '@';
      chai.request(server)
        .delete(`/api/v1/manage/users/${this.id}`)
        .set('x-access-token', resToken)
        .end((err, res) => {
          chai.expect(res.body.success).to.be.false;
          chai.expect(res).to.have.status(403);
          done();
        });
    });
    it('should delete the user from the database and check whether it worked ', (done) => {
      chai.request(server)
        .delete(`/api/v1/manage/users/${this.id}`)
        .set('x-access-token', this.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });
    });
    it('checks whether deletion was successful ', (done) => {
      chai.request(server)
        .get(`/api/v1/manage/users/${this.id}`)
        .set('x-access-token', this.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(404);
          done();
        });
    });
  });
});

