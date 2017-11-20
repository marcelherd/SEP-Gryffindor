const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const request = require('request');
const chai = require('chai');
const authContoller = require('../controllers/AuthController');
const userController = require('../controllers/UserController');

const config = require('../config');
const authenticateRoutes = require('../routes/authenticate');
const manageRoutes = require('../routes/manage');

// Server init
const app = express();

app.set('secret', config.secret);

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(cors());

app.use(morgan('dev'));

mongoose.connect(config.database, config.databaseOptions);

app.use('/api/v1/authenticate', authenticateRoutes);
app.use('/api/v1/manage', manageRoutes);

const server = app.listen(3000, () => {
  console.log('Bot Runtime is running on port 3000!');

  setTimeout(() => {
    server.close();
  }, 10000);
});

// Usermanagement testcases

// console.log(userController.getUser());
describe('controllers/UserController.js', () => {
  describe('#postUser()', () => {
    it('creates and finds new user', (done) => {
      userController.postUser('username: test, password: 1234');
      userController.getUser('test', (res) => {
        chai.expect(JSON.stringify(res.body)).to.equal('test');
      });
      done();
    }); /*
    it('does not overwrite existing user', (done) => {
      userController.postUser();
      chai.expect(response.username).to.equal('{"Test"}');
      done();
    });
  });
  describe('#getUser()', () => {
    it('does not find invalid user', (done) => {
      userController.getUser();
      chai.expect(response.username).to.equal('{"Test"}');
      done();
    }); */
  });
});

/*
// Routing testcases
describe('routes/manage.js', () => {
  describe('#noTokenProvided', () => {
    it('fails because no token was provided', (done) => {
      request('http://localhost:3000/api/v1/manage/bot/1', (error, response, body) => {
        chai.expect(response.statusCode).to.equal(403);
        chai.expect(response.body).to.equal('{"success":false,"message":"No token provided"}');
        done();
      });
    });
  });
  describe('#getBot', () => {
    it('returns bot string', (done) => {
      request('http://localhost:3000/api/v1/manage/bot/1', (error, response, body) => {
        chai.expect(response.body).to.equal('{"id":1,"name":"First Bot","template":"Welcome-Bot","status":"NOT_RUNNING"}');
        done();
      });
    });
  });
});
*/
