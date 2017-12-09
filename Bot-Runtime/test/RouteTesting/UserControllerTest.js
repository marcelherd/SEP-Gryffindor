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


User.remove({}, (err) => {
  if (err) {
    console.log(err);
  }
});

describe('User Tests', () => {
  beforeEach((done) => {
    const payload = {
      username: 'Simon',
      password: 'Simon',
      admin: true,
    };

    this.token = jwt.sign(payload, config.secret, {
      expiresIn: '1d',
    });

    // authService.setupUsers();

    done();
  });


  describe('GET /users', () => {
    it('should authenticate with given token ', (done) => {
      chai.request(server)
        .get('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.be.a('array');
          // chai.expect(res.body).to.have.lengthOf(1);
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


  describe('POST /users', () => {
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
    it('should fail cause no username was specified', (done) => {
      const body = {
        password: 'SimonA',
      };
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .send(body)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.success).to.have.equal(false);
          done();
        });
    });
    it('should fail cause no password was specified', (done) => {
      const body = {
        username: 'SimonA',
      };
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .send(body)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.success).to.have.equal(false);
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
          this.id = res.body.message._id;
          chai.expect(res.body.message).to.have.property('_id');
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
    it('should fail cause a normal user tries to post a new user', (done) => {
      const userA = {
        username: 'BjornA',
        password: 'BjornA',
      };
      const userB = {
        username: 'BjornB',
        password: 'BjornB',
      };

      const resToken = jwt.sign(userA, config.secret, {
        expiresIn: '1d',
      });

      // Post userA
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .send(userA)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.message.username).to.equal('BjornA');
          chai.expect(res.body.message.password).to.equal('BjornA');
          // Post userB with userA token
          chai.request(server)
            .post('/api/v1/manage/users')
            .set('x-access-token', resToken)
            .send(userB)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(403);
              done();
            });
        });
    });
    // TODO: Ask what should happen, when posting same user with different parameters again
    it('should not overwrite existing user', (done) => {
      let idUserC;

      const userC = {
        username: 'BjornA',
        password: 'A',
      };
      const userD = {
        username: 'BjornA',
        password: 'B',
      };

      // Post userC
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .send(userC)
        .end((err, res) => {
          idUserC = res.body.message._id;
          chai.expect(res).to.have.status(200);
          // Post a new userD instead of updating userC
          chai.request(server)
            .post('/api/v1/manage/users')
            .set('x-access-token', this.token)
            .send(userD)
            .end((err2, res2) => {
              chai.expect(res2.body.message._id).to.not.equal(idUserC);
              chai.expect(res2.body.message.password).to.equal('B');
              chai.expect(res2).to.have.status(200);
              done();
            });
        });
    });
  });


  describe('GET /users/:user_id', () => {
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
          chai.expect(res).to.have.status(400);
          done();
        });
    });
  });


  describe('DELETE /users/:user_id', () => {
    it('should fail cause no user with this id exists', (done) => {
      const id = this.id + 1;
      chai.request(server)
        .delete(`/api/v1/manage/users/${id}`)
        .set('x-access-token', this.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
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
          // chai.expect(res).to.have.status(200);
          chai.expect(res.body.message).equals('User deleted');
          done();
        });
    });
    it('fails: deleted user tries to get data about himself', (done) => {
      chai.request(server)
        .get(`/api/v1/manage/users/${this.id}`)
        .set('x-access-token', this.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          done();
        });
    });
  });


  describe('PATCH /users/:user_id', () => {
    it('succeeds: user should update stagingID and brandID of himself', (done) => {
      let userID;

      const userA = {
        username: 'BjornA',
        password: 'BjornA',
        brandId: 'Skai',
        stagingId: '01234567',
      };

      const changes = {
        brandId: 'Hohnbach',
        stagingId: '76543210',
      };

      const resToken = jwt.sign(userA, config.secret, {
        expiresIn: '1d',
      });

      // Post userA
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .send(userA)
        .end((err, res) => {
          userID = res.body.message._id;
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.message.brandId).to.equal('Skai');
          chai.expect(res.body.message.stagingId).to.equal('01234567');
          // UserA changes his IDs
          chai.request(server)
            .patch(`/api/v1/manage/users/${userID}`)
            .set('x-access-token', resToken)
            .send(changes)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.username).to.equal('BjornA');
              chai.expect(res2.body.message.brandId).to.equal('Hohnbach');
              chai.expect(res2.body.message.stagingId).to.equal('76543210');
              done();
            });
        });
    });
    it('fails: admin tries to change IDs of non-existant user', (done) => {
      const changes = {
        brandId: 'Hohnbach',
        stagingId: '76543210',
      };

      // Admin tries to change IDs
      chai.request(server)
        .patch('/api/v1/manage/users/NaN')
        .set('x-access-token', this.token)
        .send(changes)
        .end((err2, res2) => {
          chai.expect(res2).to.have.status(400);
          done();
        });
    });
    it('fails: user tries to change IDs of another user', (done) => {
      let userID;

      const userA = {
        username: 'BjornA',
        password: 'BjornA',
        brandId: 'Skai',
        stagingId: '01234567',
      };

      const userB = {
        username: 'BjornB',
        password: 'BjornB',
      };

      const resToken = jwt.sign(userA, config.secret, {
        expiresIn: '1d',
      });

      const changes = {
        brandId: 'Hohnbach',
        stagingId: '76543210',
      };

      // Post userA
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .send(userA)
        .end((err, res) => {
          userID = res.body.message._id;
          // Post userB
          chai.request(server)
            .post('/api/v1/manage/users')
            .set('x-access-token', this.token)
            .send(userB)
            .end((err2, res2) => {
              userID = res2.body.message._id;
              chai.expect(res2).to.have.status(200);
              // UserA tries to change IDs od userB
              chai.request(server)
                .patch(`/api/v1/manage/users/${userID}`)
                .set('x-access-token', resToken)
                .send(changes)
                .end((err3, res3) => {
                  chai.expect(res3).to.have.status(200);
                  chai.expect(res3.body.message.username).to.equal('BjornB');
                  chai.expect(res3.body.message.brandId).to.equal('Skai');
                  chai.expect(res3.body.message.stagingId).to.equal('01234567');
                  done();
                });
            });
        });
    });
    it('succeeds: admin can update stagingID and brandID of users', (done) => {
      let userID;

      const userA = {
        username: 'BjornA',
        password: 'BjornA',
        brandId: 'Skai',
        stagingId: '01234567',
      };

      const changes = {
        brandId: 'Hohnbach',
        stagingId: '76543210',
      };

      // Post userA
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .send(userA)
        .end((err, res) => {
          userID = res.body.message._id;
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.message.brandId).to.equal('Skai');
          chai.expect(res.body.message.stagingId).to.equal('01234567');
          // Admin changes IDs of userA
          chai.request(server)
            .patch(`/api/v1/manage/users/${userID}`)
            .set('x-access-token', this.token)
            .send(changes)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.username).to.equal('BjornA');
              chai.expect(res2.body.message.brandId).to.equal('Hohnbach');
              chai.expect(res2.body.message.stagingId).to.equal('76543210');
              done();
            });
        });
    });
  });
});
