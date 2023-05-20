const middleware = require('../middleware/middleware');
const { expect } = require('chai');
const sinon = require('sinon');

describe("firebase verification token function test", () => {
  it("verifyFirebaseToken() should call next() if ADMIN user exists and is authenticated", async () => {
    const req = {
      cookies: {
        userRole: "admin"
      },
      session: {
        isAuthenticated: true,
      },
    };
    const res = {};
    const next = sinon.spy();

    await middleware.verifyFirebaseToken(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  it("verifyFirebaseToken() should call next() if REGUSER user exists and is authenticated", async () => {
    const req = {
      cookies: {
        userRole: "regUser"
      },
      session: {
        isAuthenticated: true,
      },
    };
    const res = {};
    const next = sinon.spy();

    await middleware.verifyFirebaseToken(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  it("verifyFirebaseToken() fail branch should call session.destroy(), 'reset' cookie', and send 401 with error msg", async () => {
    const req = {
      cookies: {
        userRole: ""
      },
      session: {
        isAuthenticated: false,
        destroy: sinon.stub(),
      },
    };
    const next = sinon.spy();
    const status = sinon.stub();
    const send = sinon.spy();
    const cookie = sinon.stub().returns('userRole', 'null', { httpOnly: false });
    const res = {
      status,
      send,
      cookie,
    };
    status.returns(res);

    await middleware.verifyFirebaseToken(req, res, next);
    
    expect(req.session.destroy.calledOnce).to.be.true;
    expect(status.calledWith(401)).to.be.true;
    expect(res.send.calledWith('Firebase token unavailable/invalid')).to.be.true;
    expect(res.cookie.calledWith('userRole', 'null', { httpOnly: false })).to.be.true;
  });
});