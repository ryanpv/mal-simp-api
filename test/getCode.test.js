const app = require('../server.js');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const { 
  generateCodeChallengeFromVerifier, dec2hex, generateCodeVerifier, 
} = require('../middleware/middleware.js');
// const middlewareModule = require('../middleware/middleware.js')
const middleware = require('../middleware/middleware.js')

before(() => {
  process.env.NODE_ENV = 'dev'
});

after(() => {
  delete process.env.NODE_ENV
});

describe("CODE CHALLENGE AND VERIFIER CREATION TEST SUITE", () => {

  it("return string of buffer - values should be mix of letters and numbers", async () => {
    const code_verifier = await generateCodeVerifier();
    const dexToHex = dec2hex(code_verifier);

    expect(dexToHex).to.match(/^[A-Za-z0-9]+$/);
    expect(dexToHex).to.not.match(/^[0-9]+$/);
  });

  it("Should return a code challenge string value of numbers and letters", async () => {
    const codeChallenge = await generateCodeChallengeFromVerifier()

    expect(codeChallenge).to.be.a('string')
    expect(codeChallenge).to.match(/^[A-Za-z0-9]+$/)
    expect(codeChallenge).to.not.match(/^[0-9]+$/) // ensures it returns proper value and not only 0s
  });

  it("Should return status 200 to verify code challenger has been set to cookie", (done) => {
    const pkceAuth = {
      verifier: 'mockVerifier123',
      challenger: 'mockChallenger',
    };

    request(app)
      .get('/callback')
      .set('Cookie', [`pkce_cookie=${ pkceAuth }`])
      .expect(200, done)
    
  });

  it("Should expect status 401 and string 'Challenger does not exist.' if cookie does not exist", (done) => {
    request(app)
      .get('/callback')
      .expect(401)
      .expect('Challenger does not exist.', done)
  });
});

describe('getCode() TEST SUITE FOR CODE CHALLENGE', () => {
  afterEach(() => {
    sinon.restore();
  });

  it("getCode() on success will call next() - generateCodeChallengeFromVerifier() and generateCodeVerifier() must be called once", async () => {
    const cookie = sinon.stub();
    const next = sinon.spy(); 
    const req = {};
    const res = {
      cookie,
    };
    const spy1 = sinon.spy(middleware, "generateCodeChallengeFromVerifier");
    const spy2 = sinon.spy(middleware, "generateCodeVerifier");


    await middleware.getCode(req, res, next)
    expect(spy1.calledOnce).to.be.true;
    expect(spy2.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.true;
  });

  it("getCode() fail branch should return status 500 and error string", async () => {
    sinon.stub(middleware, "generateCodeVerifier").returns("") 
    const status = sinon.stub();
    const cookie = sinon.stub();
    const send = sinon.stub();
    const mNext = sinon.spy(); 
    const req = {};
    const res = {
      cookie,
      status,
      send
    };
    status.returns(res)
  
    await middleware.getCode(req, res, mNext)

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.send.calledWith("CODE CHALLENGE ERROR")).to.be.true;
  });
});
