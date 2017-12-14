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
const fs = require('fs');
const assert = require('assert');
const waitUntil = require('async-wait-until');
const Luis = require('../../services/LuisService');

chai.use(chaiHttp);

let idUserA;
let tokenA;
let botID;

describe('LUIS and FAQ-Bot tests', () => {
  before((done) => {
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

    // Create fresh userA
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
  describe('FAQ-Bot tests', () => {
    it('succeeds: Users can create empty FAQ-Bots', (done) => {
      const botA = {
        name: 'FAQman',
        running: false,
        template: 'FAQ-Bot',
        greeting: 'Hello',
      };

      // User creates an empty FAQ-Bot
      chai.request(server)
        .post(`/api/v1/manage/users/${idUserA}/bots`)
        .set('x-access-token', tokenA)
        .send(botA)
        .end((err, res) => {
          botID = res.body.message._id;
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.success).to.equal(true);
          done();
        });
    });
    // it('succeeds: The user can add a intent with utterance and answer to the bot', () => {
    //   const botA = {
    //     intents: [{
    //       name: 'QuestionDialog',
    //       answer: {
    //         type: 'text',
    //         value: 'The tickets cost 20 Euro',
    //       },
    //       utterances: [{
    //         text: 'How much are the tickets',
    //         intentName: 'QuestionDialog',
    //       }],
    //     }],
    //   };

    //   chai.request(server)
    //     .patch(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
    //     .set('x-access-token', tokenA)
    //     .send(botA)
    //     .end((err2, res2) => {
    //       chai.expect(res2).to.have.status(200);
    //       chai.expect(res2.body.message.name).to.equal('FAQman');
    //     });
    // }).timeout(5000);
    it('succeeds: The user can add a intent with utterance and answer to the bot', () => {
      const botA = {
        intents: [{
          name: 'lol',
          answer: {
            type: 'text',
            value: '',
          },
          utterances: [{
            text: '',
            intentName: '',
          }],
        }],
      };

      chai.request(server)
        .patch(`/api/v1/manage/users/${idUserA}/bots/${botID}`)
        .set('x-access-token', tokenA)
        .send(botA)
        .end((err2, res2) => {
          chai.expect(res2).to.have.status(200);
          chai.expect(res2.body.message.name).to.equal('FAQman');
        });
    }).timeout(5000);

  // describe('Luis tests', () => {
  //   it('succeeds: ', () => {
  //     const result = Luis.createApp('../Bots/FAQ-Bot/config.json');
  //     console.log(result);
  //   });
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


// UserInput: Utterance, Output: Answer
