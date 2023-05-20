process.env.NODE_ENV = 'dev';

const app = require('../server.js');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');

describe("GET home route", () => {
  it("Should receive status 200 and some hello world string", async () => {
    await request(app)
      .get('/')
      .expect(200)
      .expect('hello world, welcome to the server for MAL SIMP!!!')
  });
});

// describe("TEST FIREBASE TOKEN VERIFICATION ERROR HANDLER", () => {
//   it("Should return 401 and error message if no token detected", async () => {
//     await request(app)
//       .get('/firebase-token-test')
//       .expect(401)
//       .expect('Firebase token unavailable/invalid');
      
//   });
// });

describe("TEST MAL TOKEN MIDDLEWARE", () => {
  it("Should return 401 and message for unavalable/invalid token", async () => {
    await request(app)
      .get('/mal-token-test')
      .expect(401)
      .expect('No MAL token available. Login credentials required.')
  });

  it("Should call next() if valid token exists", async () => {
    await request(app)
      .get('/mal-token-test')
      .set("Cookie", ["mal_access_token=mockValue"])
      .expect(200)
  });
});

describe("CACHE HIT/MISS TEST", () => {
  it("next() should be called with POST request", async () => {
    const cache = require('../middleware/routeCache.js')
    const req = {
      method: "POST",
      session: {
        uid: "testUid"
      },
      originalUrl: "https://test%20url.net",
      body: {
        categoryName: "test Category Value"
      }
    };
    const res = {}
    const mNext = sinon.fake();

    cache(300)(req, res, mNext) // 300 is duration argument for the function

    expect(mNext.calledOnce).to.be.true
  });

  it("next() should be called with DELETE request", async () => {
    const cache = require('../middleware/routeCache.js')
    const req = {
      method: "DELETE",
      session: {
        uid: "testUid"
      },
      originalUrl: "https://test%20url.net",
      body: {
        categoryName: "test Category Value"
      }
    };
    const res = {}
    const mNext = sinon.fake();

    cache(300)(req, res, mNext) // 300 is duration argument for the function

    expect(mNext.calledOnce).to.be.true
  });

  it("should call next() if req.method is !== POST/DELETE and no cache", async () => {
    const cache = require('../middleware/routeCache.js')
    const req = {
      method: "GET",
      session: {
        uid: "testUid"
      },
      originalUrl: "https://test%20url.net",
      body: {
        categoryName: "test Category Value"
      }
    };
    const res = {}
    const mNext = sinon.fake();

    cache(300)(req, res, mNext) // 300 is duration argument for the function

    expect(mNext.calledOnce).to.be.true
  });

});



