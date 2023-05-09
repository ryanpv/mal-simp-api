process.env.NODE_ENV = 'dev';

const app = require('../server.js');
const request = require('supertest');
const sinon = require('sinon');
const {expect} = require('chai');
const { generateCodeChallengeFromVerifier } = require('../middleware/middleware.js')

describe("GET home route", () => {
  it("Should receive status 200 and some hello world string", async () => {
    await request(app)
      .get('/')
      .expect(200)
      .expect('hello world, welcome to the server for MAL SIMP!!!')
  });
});

describe("CODE CHALLENGE TEST", () => {
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

describe("TEST FIREBASE TOKEN VERIFICATION ERROR HANDLER", () => {
  it("Should return 401 if no token detected", async () => {
    await request(app)
      .get('/firebase-token-test')
      .expect(401)
      .expect('Firebase token unavailable/invalid');
      
  });
});

describe("TEST MAL TOKEN MIDDLEWARE", () => {
  it("Should return 401 ifor unavalable/invalid token", async () => {
    await request(app)
      .get('/mal-token-test')
      .expect(401)
      .expect('No MAL token available. Login credentials required.')
  });
});
