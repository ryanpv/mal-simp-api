const setClaimsModule = require('../controllers/admin/set-claims.js');
const { expect } = require('chai');
const sinon = require('sinon');
const firebaseAdminAuth = require('firebase-admin/auth');

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