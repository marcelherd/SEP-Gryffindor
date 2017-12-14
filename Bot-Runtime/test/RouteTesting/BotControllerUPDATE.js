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


  // Update a specific bots
  describe('PATCH /users/:user_id/bots/:bot_id', () => {
    it('succeeds: users can change their bots', (done) => {
      let botID;

      const botA = {
        name: 'Botter24',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const changes = {
        greeting: 'Whatsup',
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
          // User a changes name of created bot
          chai.request(server)
            .patch(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
            .set('x-access-token', tokenA)
            .send(changes)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.greeting).to.equal('Whatsup');
              done();
            });
        });
    });
    it('fails: users cannot change their bots with invalid authentication', (done) => {
      let botID;

      const botA = {
        name: 'Botter25',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const changes = {
        greeting: 'Whatsup',
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
          // User a changes name of created bot
          chai.request(server)
            .patch(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
            .set('x-access-token', '')
            .send(changes)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(403);
              done();
            });
        });
    });
    it('succeeds: admins can change bots of users', (done) => {
      let botID;

      const botA = {
        name: 'Botter26',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const changes = {
        name: 'Bottrop',
        greeting: 'Whatsup',
        running: false,
        environment: 'Production',
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
          // User a changes name of created bot
          chai.request(server)
            .patch(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
            .set('x-access-token', this.token)
            .send(changes)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.name).to.equal('Bottrop');
              chai.expect(res2.body.message.greeting).to.equal('Whatsup');
              chai.expect(res.body.message.environment).to.equal('Production');
              chai.expect(res.body.message.running).to.equal(false);
              done();
            });
        });
    });
    it('fails: user tries to change bots of other users', (done) => {
      let botID;

      const userB = {
        username: 'BjornB',
        password: 'BjornB',
      };

      const tokenB = jwt.sign(userB, config.secret, {
        expiresIn: '1d',
      });

      const botA = {
        name: 'Botter27',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const changes = {
        greeting: 'Whatsup',
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
          // Create userB
          chai.request(server)
            .post('/api/v1/manage/users')
            .set('x-access-token', this.token)
            .send(userB)
            .end((err2, res2) => {
              chai.expect(res).to.have.status(201);
              chai.expect(res2.body.message.username).to.equal('BjornB');
              chai.expect(res2.body.message.password).to.equal('BjornB');
              // UserB tries to change name of userA's created bot
              chai.request(server)
                .patch(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
                .set('x-access-token', tokenB)
                .send(changes)
                .end((err3, res3) => {
                  chai.expect(res3).to.have.status(403);
                  done();
                });
            });
        });
    });
    it('fails: users tries to change a non-existing bot', (done) => {
      const botA = {
        name: 'Botter28',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const changes = {
        name: 'Bottrop',
        greeting: 'Whatsup',
        running: false,
        environment: 'STAGING',
      };

        // UserA creates a bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', tokenA)
        .send(botA)
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.success).to.equal(true);
          chai.expect(res.body.message.greeting).to.equal('Hello');
          // User a changes name of created bot
          chai.request(server)
            .patch(`/api/v1/manage/users/${idUserA}/bots/NaN`)
            .set('x-access-token', tokenA)
            .send(changes)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(400);
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
