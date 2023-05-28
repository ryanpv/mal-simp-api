const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const { db } = require('../firebase-config.js');
// IMPORTED MODULES
const categoryDataModule = require('../controllers/user-db-queries/category_data.js');
const categoryNextPageModule = require('../controllers/user-db-queries/category_next_page.js');

describe('Testing for user-db-queries', () => { 
  before(() => {
    process.env.NODE_ENV = 'test'
  });
  
  after(() => {
    delete process.env.NODE_ENV
  });

  
  describe("Test suite for category_data", () => { 
    afterEach(() => {
      sinon.restore();
    });
    it("getCategoryData() should res.send data retrieved from db", async () => {
      const req = {
        session: {
          uid: 'testId123',
        },
        params: {
          categoryName: 'Adventure',
        },
      };
      const send = sinon.spy();
      const res = {
        send,
      };

      await categoryDataModule.getCategoryData(req, res);

      expect(res.send.args.flat(2)[0]).to.have.property('animeId');
      expect(res.send.args.flat(2)[0]).to.have.property('mean');
      expect(res.send.args.flat(2)[0]).to.have.property('num_episodes');
      expect(res.send.args.flat(2)[0]).to.have.property('main_picture');
      expect(res.send.args.flat(2)[0]).to.have.property('animeTitle');
      expect(res.send.args.flat(2)[0]).to.have.property('categoryName');
      expect(res.send.args.flat(2)[0]).to.not.have.property('userId');
    });

    it("Caught error for getCategoryData() should send status 500 and err obj", async () => {
      const req = {};
      const status = sinon.stub();
      const send = sinon.spy();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const err = { errMsg: 'test error message'};
      sinon.stub(db, 'collection').throws(err);

      await categoryDataModule.getCategoryData(req, res)

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith(err)).to.be.true;
    });
   });

  describe("Test suite for category_next_page", () => { 
    it("categoryNextPage() should res.send paginated data", async () => {
      const req = {
        session: {
          uid: 'testId123',
        },
        params: {
          categoryName: 'Adventure',
          lastItem: '',
        },
      };
      const send = sinon.stub();
      const status = sinon.stub();
      const res = {
        send,
        status,
      };
      status.returns(res);

      await categoryNextPageModule.categoryNextPage(req, res);

      console.log('args', res.send.args[0]);
    });
   });
 });