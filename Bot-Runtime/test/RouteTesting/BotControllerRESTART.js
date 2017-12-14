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

  // RESTARTing bots
  describe('RESTART /users/:user_id/bots/:bot_id', () => {
    it('succeeds: user can restart his running bot', (done) => {
      let botID;
      let statusChanged;

      const botA = {
        name: 'Botter42',
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
              statusChanged = res2.body.message.statusChanged;
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.running).to.equal(true);
              // Restart
              chai.request(server)
                .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/restart`)
                .set('x-access-token', tokenA)
                .end((err3, res3) => {
                  chai.expect(res3.body.message.running).to.equal(true);
                  chai.expect(res3.body.message.statusChanged).to.not.equal(statusChanged);
                  done();
                });
            });
        });
    });
    it('succeeds: user restarts his stopped bot', (done) => {
      let botID;
      let statusChanged;

      const botA = {
        name: 'Botter43',
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
          // Restart
          chai.request(server)
            .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/restart`)
            .set('x-access-token', tokenA)
            .end((err3, res3) => {
              chai.expect(res3.body.message.running).to.equal(true);
              chai.expect(res3.body.message.statusChanged).to.equal(statusChanged);
              done();
            });
        });
    });
    it('fails: user tries to restart his running bot with invalid authentication', (done) => {
      let botID;

      const botA = {
        name: 'Botter42',
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
              // Restart
              chai.request(server)
                .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/restart`)
                .set('x-access-token', '')
                .end((err3, res3) => {
                  chai.expect(res2).to.have.status(403);
                  done();
                });
            });
        });
    });
    it('fails: user tries to restart stopped bot of another user', (done) => {
      let botID;
      let statusChanged;

      const botA = {
        name: 'Botter43',
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
          // Create userB
          chai.request(server)
            .post('/api/v1/manage/users')
            .set('x-access-token', this.token)
            .send(userB)
            .end((err2, res2) => {
              chai.expect(res).to.have.status(201);
              chai.expect(res2.body.message.username).to.equal('BjornB');
              chai.expect(res2.body.message.password).to.equal('BjornB');
              // Restart
              chai.request(server)
                .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/restart`)
                .set('x-access-token', tokenB)
                .end((err3, res3) => {
                  chai.expect(res3.body.message.running).to.equal(false);
                  chai.expect(res3.body.message.statusChanged).to.equal(statusChanged);
                  done();
                });
            });
        });
    });
    it('succeeds: admin can restart running bot of another user', (done) => {
      let botID;
      let statusChanged;

      const botA = {
        name: 'Botter42',
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
              statusChanged = res2.body.message.statusChanged;
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.running).to.equal(true);
              // Restart
              chai.request(server)
                .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/restart`)
                .set('x-access-token', this.token)
                .end((err3, res3) => {
                  chai.expect(res3.body.message.running).to.equal(true);
                  chai.expect(res3.body.message.statusChanged).to.not.equal(statusChanged);
                  done();
                });
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
