process.env.NODE_ENV = 'dev';

const app = require('../server.js');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const { 
  generateCodeChallengeFromVerifier, dec2hex, generateCodeVerifier, 
} = require('../middleware/middleware.js');
// const middlewareModule = require('../middleware/middleware.js')
const service = require('../middleware/middleware.js')

describe("CODE CHALLENGE TEST", () => {

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
});

describe('getCode() TEST SUITE FOR CODE CHALLENGE', () => {
  beforeEach(async () => {

  });

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
    const spy1 = sinon.spy(service, "generateCodeChallengeFromVerifier");
    const spy2 = sinon.spy(service, "generateCodeVerifier");


    await service.getCode(req, res, next)
    expect(spy1.calledOnce).to.be.true;
    expect(spy2.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.true;
  });

  it("getCode() fail branch should return status 500 and error string", async () => {
    sinon.stub(service, "generateCodeVerifier").returns("") 
    const status = sinon.stub();
    const cookie = sinon.stub();
    const send = sinon.stub();
    const mNext = sinon.stub(); 
    const req = {};
    const res = {
      cookie,
      status,
      send
    };
    status.returns(res)
  
    await service.getCode(req, res, mNext)

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.send.calledWith("CODE CHALLENGE ERROR")).to.be.true;
  });
});
