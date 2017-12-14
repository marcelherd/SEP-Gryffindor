// const LuisTest = require('../LuisTesting/LuisTest');  // To make sure that this testfile gets executed after LuisTests
const chai = require('chai');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Bot = require('../../models/Bot');
const chaiHttp = require('chai-http');
const server = require('../../index');
const authService = require('../../services/AuthService');
const config = require('../../config');
const jwt = require('jsonwebtoken');
const dockerService = require('../../services/DockerService');

chai.use(chaiHttp);

let idUserA;
let tokenA;


describe('Bots', () => {
  beforeEach((done) => {
    // Before the tests we empty user and bot database
    User.remove({}, (err) => {
      if (err) {
        console.log(err);
      }
    });

    Bot.remove({}, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const payload = {
      username: 'Bjorn',
      password: 'Bjorn',
      admin: true,
    };

    this.token = jwt.sign(payload, config.secret, {
      expiresIn: '1d',
    });


    const userA = {
      username: 'BjornA',
      password: 'BjornA',
    };

    tokenA = jwt.sign(userA, config.secret, {
      expiresIn: '1d',
    });

    // Create fresh user
    chai.request(server)
      .post('/api/v1/manage/users')
      .set('x-access-token', this.token)
      .send(userA)
      .end((err, res) => {
        idUserA = res.body.message._id;
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.message.username).to.equal('BjornA');
        chai.expect(res.body.message.password).to.equal('BjornA');
        done();
      });
  });


  // POSTing new bots
  describe('POST /users/:user_id/bots', () => {
    it('succeeds: a user creates a new bot for himself', (done) => {
      const bot = {
        name: 'Botter1',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

        // UserA creates a bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', tokenA)
        .send(bot)
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.success).to.equal(true);
          chai.expect(res.body.message.greeting).to.equal('Hello');
          done();
        });
    });
    it('fails to create a bot: invalid bot template', (done) => {
      const bot = {
        name: 'Botter2',
        running: false,
        template: 'Invalid-Bot',
        greeting: 'Hello',
      };

      // UserA creates a bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', tokenA)
        .send(bot)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.success).to.equal(false);
          done();
        });
    });
    it('fails: deleted users should not be able to create bots', (done) => {
      let idUserB;

      const bot = {
        name: 'Botter3',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const userB = {
        username: 'BjornB',
        password: 'BjornB',
        admin: 'true',
      };

      const tokenB = jwt.sign(userB, config.secret, {
        expiresIn: '1d',
      });

      // Create userB
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .send(userB)
        .end((err, res) => {
          idUserB = res.body.message._id;
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.message.username).to.equal('BjornB');
          chai.expect(res.body.message.password).to.equal('BjornB');
          // Delete userB
          chai.request(server)
            .delete(`/api/v1/manage/users/${idUserB}`)
            .set('x-access-token', this.token)
            .end((err2, res2) => {
              chai.expect(res2.body.message).equals('User deleted');
              // Deleted userB tries to create bot
              chai.request(server)
                .post(`/api/v1/manage/users/${idUserA}/bots`)
                .set('x-access-token', tokenB)
                .send(bot)
                .end((err3, res3) => {
                  chai.expect(res3).to.have.status(400);
                  done();
                });
            });
        });
    });
    it('fails: deleted admin should not be able to create bots for other users / admins', (done) => {
      let userID;

      const bot = {
        name: 'Botter4',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const userB = {
        username: 'BjornB',
        password: 'BjornB',
        admin: 'true',
      };

      const tokenB = jwt.sign(userB, config.secret, {
        expiresIn: '1d',
      });

      // Create userB
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .send(userB)
        .end((err, res) => {
          userID = res.body.message._id;
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.message.username).to.equal('BjornB');
          chai.expect(res.body.message.password).to.equal('BjornB');
          // Delete userB
          chai.request(server)
            .delete(`/api/v1/manage/users/${userID}`)
            .set('x-access-token', this.token)
            .end((err2, res2) => {
              chai.expect(res2.body.message).equals('User deleted');
              // Deleted userB tries to create bot
              chai.request(server)
                .post(`/api/v1/manage/users/${idUserA}/bots`)
                .set('x-access-token', tokenB)
                .send(bot)
                .end((err3, res3) => {
                  chai.expect(res3).to.have.status(400);
                  done();
                });
            });
        });
    });
    it('fails to create a bot: no user id', (done) => {
      const bot = {
        name: 'Botter5',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      // UserA creates a bot
      chai.request(server)
        .post('/api/v1/manage/users//bots')
        .set('x-access-token', tokenA)
        .send(bot)
        .end((err, res) => {
          chai.expect(res).to.have.status(404);
          done();
        });
    });
    it('fails to create a bot: invalid user id', (done) => {
      const bot = {
        name: 'Botter6',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      // UserA creates a bot
      chai.request(server)
        .post('/api/v1/manage/users/NaN/bots')
        .set('x-access-token', tokenA)
        .send(bot)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          done();
        });
    });
    it('fails to create a bot: invalid user authentication', (done) => {
      const bot = {
        name: 'Botter7',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      // UserA creates a bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', '')
        .send(bot)
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });
    it('fails: a user creates a new bot for another user', (done) => {
      const bot = {
        name: 'Botter8',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const userB = {
        username: 'BjornB',
        password: 'BjornB',
      };

      const tokenB = jwt.sign(userB, config.secret, {
        expiresIn: '1d',
      });

      // Create userB
      chai.request(server)
        .post('/api/v1/manage/users')
        .set('x-access-token', this.token)
        .send(userB)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.message.username).to.equal('BjornB');
          chai.expect(res.body.message.password).to.equal('BjornB');

          // UserB wants to create a bot for userA
          chai.request(server)
            .post(`/api/v1/manage/users/${idUserA}/bots`)
            .set('x-access-token', tokenB)
            .send(bot)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(400);
              chai.expect(res2.body.success).to.equal(false);
              done();
            });
        });
    });
    it('succeeds: a admin creates a new bot for a user', (done) => {
      const bot = {
        name: 'Botter9',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      // Admin creates a bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', this.token)
        .send(bot)
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.success).to.equal(true);
          chai.expect(res.body.message.greeting).to.equal('Hello');
          done();
        });
    });
  });
  after('Remove from databases', (done) => {
    // Before the tests we empty user and bot database
    User.remove({}, (err) => {
      if (err) {
        console.log(err);
      }
    });

    Bot.remove({}, (err) => {
      if (err) {
        console.log(err);
      }
    });
    done();
  });
});
