const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const axios = require('axios');
// IMPORTED MODULES
const malSavedListModule = require('../controllers/mal-user-data/mal_saved_list');
const malRecommendationModule = require('../controllers/mal-user-data/mal_user_recommendations.js');
const malUsernameModule = require('../controllers/mal-user-data/mal_username.js');

describe("Testing for mal-user-data", () => {
  describe("Test suite for mal_saved_list", () => { 
    afterEach(() => {
      sinon.restore();
    });

    it("Should send status 401 and message for no MAL token", async () => {
      const req = {
        cookies: {
          mal_access_token: false,
        },
        params: {
          offset: 8,
        },
      };
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);

      await malSavedListModule.getMalSavedList(req, res);
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.send.calledWith('No MAL token')).to.be.true;
    });

    it("Should res.send data if mal_access_token cookie exists", async () => {
      const req = {
        cookies: {
          mal_access_token: true,
        },
        params: {
          offset: 8,
        },
      };
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);

      const data = {
        mockObj: {},
      };
      const getUserAnimeList = sinon.stub(axios, 'get').returns(data);

      await malSavedListModule.getMalSavedList(req, res);
      expect(res.send.calledWith(getUserAnimeList.data)).to.be.true;
    });

    it("Caught error should send err.message and err.response", async () => {
      const req = {
        cookies: {
          mal_access_token: true,
        },
        params: {
          offset: 8,
        },
      };
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const err = {
        message: 'some error',
        response: 'error data',
      };

      sinon.stub(axios, 'get').rejects(err);

      await malSavedListModule.getMalSavedList(req, res);
      expect(res.send.calledWith({ 'error message': err.message, 'error data': err.response })).to.be.true;
    });
   });

  describe("Test suite for MAL user recommendations", () => { 
    afterEach(() => {
      sinon.restore();
    });

    it("Should return status 401 if MAL token cookie does NOT exist", async () => {
      const req = {
        cookies: {
          mal_access_token: false,
        },
        params: {
          offset: 8,
        },
      };
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);

      await malRecommendationModule.userRecommendations(req, res);
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.send.calledWith('No MAL token')).to.be.true;
    });

    it("Should res.send data if MAL token cookie EXISTS", async () => {
      const req = {
        cookies: {
          mal_access_token: true,
        },
        params: {
          offset: 8,
        },
      };
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const data = {
        mockData: {},
      };

      const getUserRecommendations = sinon.stub(axios, 'get').returns(data);
      await malRecommendationModule.userRecommendations(req, res);

      expect(res.send.calledWith(getUserRecommendations.data)).to.be.true;
    });

    it("Caught error should return status 401 and object with err.message and err.response", async () => {
      const req = {
        cookies: {
          mal_access_token: true,
        },
        params: {
          offset: 8,
        },
      };
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const err = {
        message: 'error message',
        response: 'error data',
      };

      sinon.stub(axios, 'get').throws(err);

      await malRecommendationModule.userRecommendations(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith({ 'error message': err.message, 'error data': err.response })).to.be.true;
    });
  });

  describe("Test suite for mal_username", () => {
    afterEach(() => {
      sinon.restore();
    });

    it("Should return status 401 if MAL token cookie does NOT exist", async () => {
      const req = {
        cookies: {
          mal_access_token: false,
        },
      };
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);

      await malUsernameModule.getMalUsername(req, res);
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.send.calledWith('No MAL token')).to.be.true;
    });

    it("Should res.send malUserDetails.data if token EXISTS", async () => {
      const req = {
        cookies: {
          mal_access_token: true,
        },
      };
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const data = {
        mockData: {},
      };

      const malUserDetails = sinon.stub(axios, 'get').returns(data);
      await malUsernameModule.getMalUsername(req, res);

      expect(res.send.calledWith(malUserDetails.data)).to.be.true;
    });

    it("Caught error should return status 401 and object with err.message and err.response", async () => {
      const req = {
        cookies: {
          mal_access_token: true,
        },
      };
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const err = {
        message: 'error message',
        response: 'error data',
      };

      sinon.stub(axios, 'get').throws(err);

      await malUsernameModule.getMalUsername(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith({ 'error message': err.message, 'error data': err.response })).to.be.true;
    });
  });
});