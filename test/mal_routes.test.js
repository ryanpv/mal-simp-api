const chai = require('chai');
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised)
const sinon = require('sinon');
const axios = require('axios');
const malRoutesModule = require('../controllers/mal-api-routes/mal_ranking_type_query.js');
const malSearch = require('../controllers/mal-api-routes/search_mal.js');
const seasonalQueryModule = require('../controllers/mal-api-routes/seasonal_query.js');
const singleQueryModule = require('../controllers/mal-api-routes/single_query_mal.js');

describe('mal-api-routes tests', () => { 
  afterEach(() => {
    sinon.restore();
  });

  describe('mal_ranking_type_query test suite', () => {
    afterEach(() => {
      sinon.restore();
    });
    
    it("animeRankingQuery() should return json object 'getAnimeRanking.data'", async () => {
      const req = {
        params: {
          rankType: 'airing', // own default value
          offset: 5,
        },
      };
      const send = sinon.stub();
      const status = sinon.stub();
      const res = {
        send,
        status
      };
      status.returns(res)

      const getAnimeRanking = {
        data: {}
      };

      const stub = sinon.stub(axios, 'get')
      stub.resolves(getAnimeRanking) // can use stub.resolves for promises, but async/await already used

      await malRoutesModule.animeRankingQuery(req, res);
      expect(stub.calledOnce).to.be.true;
      expect(res.send.calledWith(getAnimeRanking.data)).to.be.true;

    });

    it("error for animeRankQuery() should send status 400 and err", async () => {
      const req = {
        params: {
          rankType: 'airing', // own default value
          offset: 5,
        },
      };
      const send = sinon.stub();
      const status = sinon.stub()
      const res = {
        send,
        status
      };
      status.returns(res);
      const err = new Error('mock error')
      sinon.stub(axios, 'get').throws(err)

      await malRoutesModule.animeRankingQuery(req, res)

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith(err)).to.be.true;
    });
    });

  describe("search_mal test suit", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("searchMalAnime() method should return animeSearchResults.data json object", async () => {
      const req = {
        query: {
          q: {}
        },
        params: {
          offset: 10 // default value used in app
        },
      };
      const send = sinon.stub();
      const status = sinon.stub();
      const res = {
        send,
        status,
      };
      status.returns(res);
  
      const animeSearchResults = {
        data: {}
      };
      const stub = sinon.stub(axios, 'get');
      stub.resolves(animeSearchResults);
      await malSearch.searchMalAnime(req, res);
  
      expect(res.send.calledWith(animeSearchResults.data)).to.be.true;
  
    });
  
    it("error handle for searchMalAnime() should return status 400 and send err", async () => {
      const req = {
        query: {
          q: {}
        },
        params: {
          offset: 10
        },
      };
      const send = sinon.spy();
      const status = sinon.stub();
      const res = {
        send,
        status,
      };
      status.returns(res);
      const err = new Error('mock error')
  
      sinon.stub(axios, 'get').rejects(err);
      await malSearch.searchMalAnime(req, res);
    
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith(err)).to.be.true;
    });
  });

  describe("seasonal_query test suite", () => {
    afterEach(() => {
      sinon.restore();
    });

    it("querySeasonalAnime() success call should return seasonalQuery.data", async () => {
      const req = {
        params: {
          year: true,
          season: true,
          offset: 8,
        },
      };
      const status = sinon.stub();
      const send = sinon.stub();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const data = {
        dataObj: 'mock data obj'
      }
      const seasonalQuery = sinon.stub(axios, 'get').returns(data)
      await seasonalQueryModule.querySeasonalAnime(req, res);

      expect(res.send.calledWith(seasonalQuery.data)).to.be.true;
    });

    it("false req.params.year/season should throw new error", async () => {
      const req = {
        params: {
          offset: 8,
          // season: 'winter',
          // year: 2020,
          genre: 'adventure'
        },
      };
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const err = 'Missing seasonal query parameters'
    
      seasonalQueryModule.querySeasonalAnime(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.args[0].toString()).to.equal(err)
   });

   it("catch querySeasonalAnime() error", async () => {
    const req = {
      params: {
        offset: 8,
        season: 'summer',
        year: 2023,
        genre: 'comedy',
      },
    };
    const status = sinon.stub();
    const send = sinon.spy();
    const res = {
      status,
      send,
    };
    status.returns(res);
    const err = { message: 'Seasonal anime query error' }
    sinon.stub(axios, 'get').throws(err);

    seasonalQueryModule.querySeasonalAnime(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.send.calledWith(err.message)).to.be.true;
   });
  });

  describe("single anime query test suite", () => {
    it("singleAnimeQuery() should send retrieved data", async () => {
      const req = {
        params: {
          id: "mockId",
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
        mockData: "mock data"
      };

      const animeQuery = sinon.stub(axios, 'get').returns(data);

      await singleQueryModule.singleAnimeQuery(req, res);

      expect(res.send.calledWith(animeQuery.data)).to.be.true;
    });

    it("catch singleAnimeQuery() error should send status 400 and err", async () => {
      const req = {
        params: {
          id: "mockId",
          fields: "popularity"
        },
      };
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);

      const err = new Error("Single anime query error")

      sinon.stub(axios, 'get').rejects(err);
      await singleQueryModule.singleAnimeQuery(req, res)

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith(err)).to.be.true;
    });
  });

});
