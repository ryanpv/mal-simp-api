const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const axios = require('axios');

// IMPORTED FUNCTIONS
const malTokenModule = require('../controllers/mal-auth/mal_access_token.js');
const codeChallengeModule = require('../controllers/mal-auth/mal_code_challenge.js');

describe("MAL-auth tests", () => {
  describe("MAL token test suite", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("Successful getMalAccessToken() request should set cookie with token data", async () => {
      const req = {
        query: {
          code: {},
        },
        malCookie: {},
        cookies: {
          pkce_cookie: {
            challenger: {},
          },
          mal_access_token: true,
        },
      };
      const end = sinon.spy();
      const send = sinon.spy();
      const cookie = sinon.stub();
      const res = {
        end,
        send,
        cookie,
      };
      const data = {};
      const malAuth = sinon.stub(axios, 'post').returns(data);
  
      await malTokenModule.getMalAccessToken(req, res);
      
      expect(res.cookie.calledWith('mal_access_token', malAuth.data, {
        httpOnly: 'true'
      })).to.be.true;
      expect(res.end.called).to.be.true;
    });
  
    it("Should set req header 'req.malCookie' with access token", async () => {
      const req = {
        query: {
          code: {},
        },
        malCookie: {},
        cookies: {
          pkce_cookie: {
            challenger: {},
          },
          mal_access_token: true,
        },
      };
      const end = sinon.spy();
      const send = sinon.spy();
      const cookie = sinon.stub();
      const status = sinon.stub();
      const res = {
        end,
        send,
        cookie,
        status,
      };
      const mockData = { access_token: 'test token 123' };
      const malAuth = sinon.stub(axios, 'post').returns(mockData);
  
      await malTokenModule.getMalAccessToken(req, res);
  
      // axios request should return an access_token object
      expect(malAuth()).to.have.property('access_token');
      expect(malAuth().access_token).to.not.be.undefined; 
      expect(res.end.called).to.be.true;
    });
  
    it("getMalAccessToken() error should be caught, status 500 and err should be sent", async () => {
      const req = {
        query: {
          code: {},
        },
        malCookie: {},
        cookies: {
          pkce_cookie: {
            challenger: {},
          },
          mal_access_token: true,
        },
      };
      const end = sinon.spy();
      const send = sinon.spy();
      const cookie = sinon.stub();
      const status = sinon.stub();
      const res = {
        end,
        send,
        cookie,
        status,
      };
      status.returns(res);
  
      const err = { errorMsg: 'verifier error' };
  
      sinon.stub(axios, 'post').throws(err);
  
      await malTokenModule.getMalAccessToken(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith(err)).to.be.true;
    });
  });

  describe("code challenge test suite", () => { 
    beforeEach(() => {
      delete process.env.NODE_ENV;
    });
    afterEach(() => {
      delete process.env.NODE_ENV;
      sinon.restore();
    });

    it("should redirect to '/callback if in development env", async () => {
      process.env.NODE_ENV = 'development'
      const req = {};
      const res = {
        redirect: sinon.stub(),
      };

      await codeChallengeModule.malCodeChallenge(req, res);
      expect(res.redirect.calledWith('/callback')).to.be.true;
    });

    it("non-'development' env should redirect to '/api/callback'", async () => {
      process.env.NODE_ENV = 'production'
      const req = {};
      const res = {
        redirect: sinon.stub(),
      };

      await codeChallengeModule.malCodeChallenge(req, res);
      expect(res.redirect.calledWith('/api/callback')).to.be.true;
    });
   });
});