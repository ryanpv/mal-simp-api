const setClaimsModule = require('../controllers/admin/set-claims.js');
const { expect } = require('chai');
const sinon = require('sinon');
const firebaseAdminAuth = require('firebase-admin/auth');

describe('firebase user data: setUserClaims() test', () => { 
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
});