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
   // GETting bots
   describe('GET /users/:user_id/bots', () => {
    it('succeeds: user should get all created bots of himself', (done) => {
      const botA = {
        name: 'Botter10',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const botB = {
        name: 'Botter11',
        running: false,
        template: 'FAQ-Bot',
        greeting: 'hi',
      };

      // UserA creates 2 bots
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', tokenA)
        .send(botA)
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.success).to.equal(true);
          chai.expect(res.body.message.greeting).to.equal('Hello');
          chai.request(server)
            .post(`/api/v1/manage/users/${idUserA}/bots`)
            .set('x-access-token', tokenA)
            .send(botB)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(201);
              chai.expect(res2.body.success).to.equal(true);
              chai.expect(res2.body.message.greeting).to.equal('hi');
              // Get bots
              chai.request(server)
                .get(`/api/v1/manage/users/${idUserA}/bots`)
                .set('x-access-token', tokenA)
                .end((err3, res3) => {
                  chai.expect(res3).to.have.status(200);
                  chai.expect(JSON.parse(res3.body.message)).to.have.lengthOf(2);
                  done();
                });
            });
        });
    });
    it('succeeds: admin should get all created bots of an user', (done) => {
      const botA = {
        name: 'Botter12',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const botB = {
        name: 'Botter13',
        running: false,
        template: 'FAQ-Bot',
        greeting: 'hi',
      };

      // UserA creates 2 bots
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', tokenA)
        .send(botA)
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.success).to.equal(true);
          chai.expect(res.body.message.greeting).to.equal('Hello');
          chai.request(server)
            .post(`/api/v1/manage/users/${idUserA}/bots`)
            .set('x-access-token', tokenA)
            .send(botB)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(201);
              chai.expect(res2.body.success).to.equal(true);
              chai.expect(res2.body.message.greeting).to.equal('hi');
              // admin gets bots of userA
              chai.request(server)
                .get(`/api/v1/manage/users/${idUserA}/bots`)
                .set('x-access-token', this.token)
                .end((err3, res3) => {
                  chai.expect(res3).to.have.status(200);
                  chai.expect(JSON.parse(res3.body.user.bots)).to.have.lengthOf(2);
                  done();
                });
            });
        });
    });
    it('fails: user should not be able to get bots of another user', (done) => {
      const botA = {
        name: 'Botter14',
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
              // userB tries to get bots of userA
              chai.request(server)
                .get(`/api/v1/manage/users/${idUserA}/bots`)
                .set('x-access-token', tokenB)
                .end((err3, res3) => {
                  chai.expect(res3).to.have.status(403);
                  done();
                });
            });
        });
    });
    it('fails: user should not get his bots when he uses an invalid authentication', (done) => {
      const botA = {
        name: 'Botter15',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      // UserA creates bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', '')
        .send(botA)
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          chai.expect(res.body.success).to.equal(false);
          done();
        });
    });
  });


  // GETting specific bots
  describe('GET /users/:user_id/bots/:bot_id', () => {
    it('succeeds: user should get a specific bot', (done) => {
      let botID;

      const botA = {
        name: 'Botter16',
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
          // Get bot
          chai.request(server)
            .get(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
            .set('x-access-token', tokenA)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.name).to.equal('Botter16');
              done();
            });
        });
    });
    it('succeeds: admin should get a specific bot of an user', (done) => {
      let botID;

      const botA = {
        name: 'Botter17',
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
          // Admin gets bot
          chai.request(server)
            .get(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
            .set('x-access-token', this.token)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.name).to.equal('Botter17');
              done();
            });
        });
    });
    it('fails: user should not be able to get a specific bot of another user', (done) => {
      let botID;

      const botA = {
        name: 'Botter18',
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
              // userB tries to get specific bot of userA
              chai.request(server)
                .get(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
                .set('x-access-token', tokenB)
                .end((err3, res3) => {
                  chai.expect(res3).to.have.status(403);
                  done();
                });
            });
        });
    });
    it('fails: user should not get his bot when he uses an invalid authentication', (done) => {
      let botID;

      const botA = {
        name: 'Botter19',
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
          // userA tries to get his bot with an invalid authentication
          chai.request(server)
            .get(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
            .set('x-access-token', '')
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(403);
              done();
            });
        });
    });
    it('fails: user tries to get an non-existing bot', (done) => {
      chai.request(server)
        .get(`/api/v1/manage/users/${idUserA}/bots/NaN`)
        .set('x-access-token', tokenA)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
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
