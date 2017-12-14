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


  // DELETE specific bots
  describe('DELETE /users/:user_id/bots/:bot_id', () => {
    it('succeeds: user can delete his created bot', (done) => {
      let botID;

      const botA = {
        name: 'Botter20',
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
          // userA tries to delete his bot
          chai.request(server)
            .delete(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
            .set('x-access-token', tokenA)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
              done();
            });
        });
    });
    it('fails: user tries to delete an invalid bot', (done) => {
      // userA tries to delete his bot
      chai.request(server)
        .delete(`/api/v1/manage/users/${idUserA}/bots/NaN`)
        .set('x-access-token', tokenA)
        .end((err2, res2) => {
          chai.expect(res2).to.have.status(400);
          done();
        });
    });
    it('fails: user should not be able to delete a specific bot of another user', (done) => {
      let botID;

      const botA = {
        name: 'Botter21',
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
              // userB tries to delete specific bot of userA
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
    it('fails: user tries to delete his created bot with invalid authentication', (done) => {
      let botID;

      const botA = {
        name: 'Botter22',
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
          // userA tries to delete his bot
          chai.request(server)
            .delete(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
            .set('x-access-token', '')
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(403);
              done();
            });
        });
    });
    it('succeeds: admin can delete bot of userA', (done) => {
      let botID;

      const botA = {
        name: 'Botter23',
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
          // Admin tries to delete bot of userA
          chai.request(server)
            .delete(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
            .set('x-access-token', this.token)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
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
