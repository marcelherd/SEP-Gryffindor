const chai = require('chai');
const request = require('request');
const assert = require('assert');
const chaiHttp = require('chai-http');
const server = require('../index');

chai.use(chaiHttp);

describe('BotMarketplace', () => {
  describe('Get templates', () => {
    it('should return all available bot-templates', (done) => {
      request.get('http://localhost:4000/api/v1/discover', (error, response) => {
        chai.expect(JSON.parse(response.body)).to.be.a('array');
        chai.expect(JSON.parse(response.body)).to.have.lengthOf(2);
        assert.equal(200, response.statusCode);
        done();
      });
    });
  });
  after('close', (done) => {
    server.closeServer();
    done();
  });
});
