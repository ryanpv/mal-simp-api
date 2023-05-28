const setClaimsModule = require('../controllers/admin/set-claims.js');
const { expect } = require('chai');
const sinon = require('sinon');
const firebaseAdminAuth = require('firebase-admin/auth');
const sessionStart = require('../controllers/admin/user-session.js');

describe('firebase user data: setUserClaims() test', () => { 
  afterEach(() => {
    sinon.restore();
  });

  it("setUserClaims() should call next() if user token includes 'isRegUser' property", async () => {
    const req = {
      body: {
        accessToken: true
      }
    };
    const next = sinon.spy();
    const status = sinon.stub();
    const res = {
      status,
      send: sinon.spy()
    };
    status.returns(res)

    const verifiedToken = { 
      isRegUser: true,
      isMockValue: true,
    };
    const verifyIdToken = sinon.stub(firebaseAdminAuth.getAuth(), 'verifyIdToken')
    verifyIdToken.returns(verifiedToken)

    await setClaimsModule.setUserClaims(req, res, next)

    expect(next.calledOnce).to.be.true;
  });

  it("setUserClaims() creates user claims if isRegUser id property not detected", async () => {
    const req = {
      body: {
        accessToken: true,
      },
    };
    const status = sinon.stub();
    const next = sinon.spy();
    const res = {
      status,
      send: sinon.spy(),
    };
    const verifiedToken = {
      isRegUser: false,
      isMockValue: true,
    };
    const user = {
      uid: {}
    };
    const verifyIdToken = sinon.stub(firebaseAdminAuth.getAuth(), 'verifyIdToken');
    verifyIdToken.returns(verifiedToken);

    const setCustomUserClaims = sinon.stub(firebaseAdminAuth.getAuth(), 'setCustomUserClaims')

    await setClaimsModule.setUserClaims(req, res, next);

    expect(setCustomUserClaims.calledWith(user.uid, { isRegUser: true }));
    expect(next.calledOnce).to.be.true;
  });
});

describe('user-session testing', () => { 
  afterEach(() => {
    sinon.restore();
  });

  it("if user is ADMIN then return admin cookie", async () => {
    const req = {
      body: {
        accessToken: true,
      },
      session: {
        isAuthenticated: true,
        user: true,
        uid: true,
        accessToken: true,
      },
    };
    const status = sinon.stub();
    const cookie = sinon.stub();
    const send = sinon.spy();
    const res = {
      cookie,
      status,
      send
    };
    status.returns(res);

    const user = {
      isAdmin: true,
      isRegUser: false,
    }

    const verifiedToken = sinon.stub(firebaseAdminAuth.getAuth(), 'verifyIdToken')
    verifiedToken.returns(user);

    await sessionStart(req, res);

    expect(res.cookie.calledWith('userRole', 'admin', { httpOnly: false })).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
  });

  it("if user is REGUSER then return regUser cookie", async () => {
    const req = {
      body: {
        accessToken: true,
      },
      session: {
        isAuthenticated: true,
        user: true,
        uid: true,
        accessToken: true,
      },
    };
    const status = sinon.stub();
    const cookie = sinon.stub();
    const send = sinon.spy();
    const res = {
      cookie,
      status,
      send
    };
    status.returns(res);

    const user = {
      isAdmin: false,
      isRegUser: true,
    }

    const verifiedToken = sinon.stub(firebaseAdminAuth.getAuth(), 'verifyIdToken')
    verifiedToken.returns(user);

    await sessionStart(req, res);

    expect(res.cookie.calledWith('userRole', 'regUser', { httpOnly: false })).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
  });

  it("if neither regUser/admin detected return null cookie", async () => {
    const req = {
      body: {
        accessToken: true,
      },
      session: {
        isAuthenticated: true,
        user: true,
        uid: true,
        accessToken: true,
      },
    };
    const status = sinon.stub();
    const cookie = sinon.stub();
    const send = sinon.spy();
    const res = {
      cookie,
      status,
      send
    };
    status.returns(res);

    const user = {
      isAdmin: false,
      isRegUser: false,
    }

    const verifiedToken = sinon.stub(firebaseAdminAuth.getAuth(), 'verifyIdToken')
    verifiedToken.returns(user);

    await sessionStart(req, res);

    expect(res.cookie.calledWith('userRole', 'null', { httpOnly: false })).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
  });
});