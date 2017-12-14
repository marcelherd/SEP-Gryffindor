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


  // STOPping bots
  describe('STOP /users/:user_id/bots/:bot_id', () => {
    it('succeeds: a user can stop his started bot', (done) => {
      let botID;

      const botA = {
        name: 'Botter34',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      // UserA creates a bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', tokenA)
        .send(botA)
        .end((err, res) => {
          botID = res.body.message._id;
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.success).to.equal(true);
          chai.expect(res.body.message.greeting).to.equal('Hello');
          // Start the created bot
          chai.request(server)
            .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/start`)
            .set('x-access-token', tokenA)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.running).to.equal(true);
              // Stop the created bot
              chai.request(server)
                .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/stop`)
                .set('x-access-token', tokenA)
                .end((err3, res3) => {
                  chai.expect(res3.body.message.running).to.equal(false);
                  done();
                });
            });
        });
    });
    it('fails: a user tries to stop his started bot with invalid authentication', (done) => {
      let botID;

      const botA = {
        name: 'Botter35',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      // UserA creates a bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', tokenA)
        .send(botA)
        .end((err, res) => {
          botID = res.body.message._id;
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.success).to.equal(true);
          chai.expect(res.body.message.greeting).to.equal('Hello');
          // Start the created bot
          chai.request(server)
            .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/start`)
            .set('x-access-token', tokenA)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.running).to.equal(true);
              // Try to stop the created bot
              chai.request(server)
                .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/stop`)
                .set('x-access-token', '')
                .end((err3, res3) => {
                  chai.expect(res3).to.have.status(403);
                  done();
                });
            });
        });
    });
    it('succeeds: admin stops bot of user', (done) => {
      let botID;

      const botA = {
        name: 'Botter36',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      // UserA creates a bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', tokenA)
        .send(botA)
        .end((err, res) => {
          botID = res.body.message._id;
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.success).to.equal(true);
          chai.expect(res.body.message.greeting).to.equal('Hello');
          // Start the created bot
          chai.request(server)
            .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/start`)
            .set('x-access-token', tokenA)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.running).to.equal(true);
              // Admins stops the created bot
              chai.request(server)
                .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/stop`)
                .set('x-access-token', this.token)
                .end((err3, res3) => {
                  chai.expect(res3.body.message.running).to.equal(false);
                  done();
                });
            });
        });
    });
    it('fails: user tries to stop non-existing bot', (done) => {
      const botA = {
        name: 'Botter37',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      // UserA tries to stop bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots/NaN/stop`)
        .set('x-access-token', tokenA)
        .send(botA)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          done();
        });
    });
    it('fails: non-existing user tries to stop non-existing bot', (done) => {
      const botA = {
        name: 'Botter38',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      // UserA tries to stop bot
      chai.request(server)
        .post('/api/v1/manage/users/NaN/bots/NaN/stop')
        .set('x-access-token', tokenA)
        .send(botA)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          done();
        });
    });
    it('should not stop the bot while it is already stopped', (done) => {
      let botID;
      let statusChanged;

      const botA = {
        name: 'Botter39',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      // UserA creates a bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', tokenA)
        .send(botA)
        .end((err, res) => {
          botID = res.body.message._id;
          statusChanged = res.body.message.statusChanged;
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.success).to.equal(true);
          chai.expect(res.body.message.greeting).to.equal('Hello');
          // Stop the stopped bot
          chai.request(server)
            .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/stop`)
            .set('x-access-token', tokenA)
            .end((err2, res2) => {
              chai.expect(res2.body.message.running).to.equal(false);
              chai.expect(res2.body.message.statusChanged).to.equal(statusChanged);
              done();
            });
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
