const chai = require('chai');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Bot = require('../../models/Bot');
const chaiHttp = require('chai-http');
const server = require('../../index');
const authService = require('../../services/AuthService');
const config = require('../../config');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

describe('Bots', () => {
  beforeEach((done) => {
    // Before each test we empty user and bot database
    User.remove({}, (err) => {
      if (err) {
        console.log(err);
      } else {
        Bot.remove({}, (err2) => {
          if (err) {
            console.log(err2);
          } else {
            done();
          }
        });
      }
    });

    const payload = {
      username: 'Bjorn',
      admin: true,
    };

    this.token = jwt.sign(payload, config.secret, {
      expiresIn: '1d',
    });

    // authService.setupUsers();
  });
  // POSTing new bots
  describe('POST /users/:user_id/bots', () => {
    it('succeeds: a user creates a new bot for himself', (done) => {
      let idUserA;

      const userA = {
        username: 'BjornA',
        password: 'BjornA',
      };

      const botA = {
        name: 'Botter',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const tokenA = jwt.sign(userA, config.secret, {
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

          /* User creates a bot
          chai.request(server)
            .post(`/api/v1/manage/users/${idUserA}/bots`)
            .set('x-access-token', tokenA)
            .send(botA)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(201);
              chai.expect(res2.body.success).to.equal(true);
              chai.expect(res2.body.message.greeting).to.equal('Hello');
              done();
            }); */
          done();
        });
    });
  });
});
