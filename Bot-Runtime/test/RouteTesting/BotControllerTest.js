//
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
        name: 'Botter',
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
        name: 'Botter',
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
    it('fails to create a bot: no user id', (done) => {
      const bot = {
        name: 'Botter',
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
        name: 'Botter',
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
        name: 'Botter',
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
        name: 'Botter',
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
        name: 'Botter',
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


  // GETting bots
  describe('GET /users/:user_id/bots', () => {
    it('succeeds: user should get all created bots of himself', (done) => {
      const botA = {
        name: 'Botter',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const botB = {
        name: 'Botter',
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
                  chai.expect(res3.body.message.user.bots).to.have.lengthOf(2);
                  done();
                });
            });
        });
    });
    it('succeeds: admin should get all created bots of an user', (done) => {
      const botA = {
        name: 'Botter',
        running: false,
        template: 'Welcome-Bot',
        greeting: 'Hello',
      };

      const botB = {
        name: 'Botter',
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
                  chai.expect(res3.body.user.bots).to.have.lengthOf(2);
                  done();
                });
            });
        });
    });
    it('fails: user should not be able to get bots of another user', (done) => {
      const botA = {
        name: 'Botter',
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
        name: 'Botter',
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
        name: 'Botter',
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
              chai.expect(res2.body.message.name).to.equal('Botter');
              done();
            });
        });
    });
    it('succeeds: admin should get a specific bot of an user', (done) => {
      let botID;

      const botA = {
        name: 'Botter',
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
              chai.expect(res2.body.message.name).to.equal('Botter');
              done();
            });
        });
    });
    it('fails: user should not be able to get a specific bot of another user', (done) => {
      let botID;

      const botA = {
        name: 'Botter',
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
        name: 'Botter',
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


  // DELETE specific bots
  describe('DELETE /users/:user_id/bots/:bot_id', () => {
    it('succeeds: user can delete his created bot', (done) => {
      let botID;

      const botA = {
        name: 'Botter',
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
        name: 'Botter',
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
        name: 'Botter',
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
        name: 'Botter',
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


  // Update a specific bots
  describe('PATCH /users/:user_id/bots/:bot_id', () => {
    it('succeeds: users can change their bots', (done) => {
      let botID;

      const botA = {
        name: 'Botter',
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
        name: 'Botter',
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
        name: 'Botter',
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
              chai.expect(res.body.message.environment).to.equal('STAGING');
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
        name: 'Botter',
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
        name: 'Botter',
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

  /* START specific bots
  describe('START /users/:user_id/bots/:bot_id', () => {
    it('succeeds: user can start a stopped bot', (done) => {
      let botID;

      const botA = {
        name: 'Botter',
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
              done();
            });
        });
    });
    it('fails: user tries to start a bot with invalid authentication', (done) => {
      let botID;

      const botA = {
        name: 'Botter',
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
            .set('x-access-token', '')
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(403);
              done();
            });
        });
    });
    it('succeeds: admin can start a stopped bot of an user', (done) => {
      let botID;

      const botA = {
        name: 'Botter',
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
          // Admin starts the created bot
          chai.request(server)
            .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/start`)
            .set('x-access-token', this.token)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(200);
              chai.expect(res2.body.message.running).to.equal(true);
              done();
            });
        });
    });
    it('fails: user tries to start bot of different user', (done) => {
      let botID;

      const botA = {
        name: 'Botter',
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
          // UserB tries to start the created bot
          chai.request(server)
            .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/start`)
            .set('x-access-token', tokenB)
            .end((err2, res2) => {
              chai.expect(res2).to.have.status(403);
              done();
            });
        });
    });
    it('fails: user tries to start a non-existing bot', (done) => {
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots/NaN/start`)
        .set('x-access-token', tokenA)
        .end((err2, res2) => {
          chai.expect(res2).to.have.status(400);
          done();
        });
    });
    it('fails: non-existing user tries to start non-existing bot with valid user token', (done) => {
      chai.request(server)
        .post('/api/v1/manage/users/NaN/bots/NaN/start')
        .set('x-access-token', tokenA)
        .end((err2, res2) => {
          chai.expect(res2).to.have.status(400);
          done();
        });
    });
    it('should not restart the bot when starting the bot while it is running', (done) => {
      let botID;
      let statusChanged;

      const botA = {
        name: 'Botter',
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
              // Start the created bot again
              chai.request(server)
                .post(`/api/v1/manage/users/${idUserA}/bots/${botID}/start`)
                .set('x-access-token', tokenA)
                .end((err3, res3) => {
                  chai.expect(res3.body.message.running).to.equal(true);
                  chai.expect(res3.body.message.statusChanged).to.equal(statusChanged);
                  done();
                });
            });
        });
    });
  });


  // STOPping bots
  describe('STOP /users/:user_id/bots/:bot_id', () => {
    it('succeeds: a user can stop his started bot', (done) => {
      let botID;

      const botA = {
        name: 'Botter',
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
        name: 'Botter',
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
        name: 'Botter',
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
        name: 'Botter',
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
        name: 'Botter',
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
        name: 'Botter',
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

  // RESTARTing bots
  describe('RESTART /users/:user_id/bots/:bot_id', () => {
    it('succeeds: user can restart his running bot', (done) => {

    });
    it('fails: user tries to restart his stopped bot', (done) => {

    });
    it('fails: user tries to restart his running bot with invalid authentication', (done) => {

    });
    it('fails: user tries to restart running bot of another user', (done) => {

    });
    it('succeeds: admin can restart running bot of another user', (done) => {

    });
  }); */
});
