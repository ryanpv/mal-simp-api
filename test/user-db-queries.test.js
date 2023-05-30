const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const { db } = require('../firebase-config.js');
// IMPORTED MODULES
const categoryDataModule = require('../controllers/user-db-queries/category_data.js');
const categoryNextPageModule = require('../controllers/user-db-queries/category_next_page.js');
const createCategoryModule = require('../controllers/user-db-queries/create_category.js');
const deleteAnimeModule = require('../controllers/user-db-queries/delete_anime.js');
const deleteCategoryModule = require('../controllers/user-db-queries/delete_category.js');

describe('Testing for user-db-queries', () => { 
  beforeEach(() => {
    process.env.NODE_ENV = 'dev'
  });
  
  afterEach(() => {
    delete process.env.NODE_ENV
    sinon.restore();
  });

  describe("Testing collection name for getCategoryData()", () => {
    afterEach(() => {
      sinon.restore();
    });

    it("Should expect 'test-mal-simp' collection name", async () => {
      const req = {
        session: {
          uid: 'testId123',
        },
        params: {
          categoryName: 'Adventure',
        },
      };
      const send = sinon.spy();
      const status = sinon.stub();
      const res = {
        send,
        status
      };
      status.returns(res);

      const spy = sinon.spy(db, 'collection');

      await categoryDataModule.getCategoryData(req, res);

      expect(spy.calledWith('test-mal-simp')).to.be.true;
    });

    it("Should expect 'mal-simp' as collection name", async () => {
      process.env.NODE_ENV = 'prod';
      const req = {
        session: {
          uid: 'testId123',
        },
        params: {
          categoryName: 'Adventure',
        },
      };
      const send = sinon.spy();
      const status = sinon.stub();
      const res = {
        send,
        status
      };
      status.returns(res);
      const spy = sinon.spy(db, 'collection');

      await categoryDataModule.getCategoryData(req, res);

      expect(spy.calledWith('mal-simp')).to.be.true;
    });
  });

  describe("Test suite for category_data", () => { 
    afterEach(() => {
      sinon.restore();
    });
    
    it("Should return status 400 and send ''No data available.' if no data matched in db", async () => {
      const req = {
        session: {
          uid: 'testId123',
        },
        params: {
          categoryName: 'mockCategory',
        },
      };
      const send = sinon.spy();
      const status = sinon.stub();
      const res = {
        send,
        status,
      };
      status.returns(res);

      await categoryDataModule.getCategoryData(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith('No data available.')).to.be.true;
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
      const status = sinon.stub();
      const res = {
        send,
        status,
      };
      status.returns(res);

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
    afterEach(() => {
      sinon.restore();
    });
    
    it("Returns status 400 and sends 'No data available.'", async () => {
      const req = {
        session: {
          uid: 'Non-ID',
        },
        params: {
          categoryName: 'Adventure',
          lastItem: 'Mock item',
        },
      };
      const send = sinon.spy();
      const status = sinon.stub();
      const res = {
        send,
        status,
      };
      status.returns(res);

      await categoryNextPageModule.categoryNextPage(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith('No data available.')).to.be.true;
    });

    it("categoryNextPage() should res.send paginated data", async () => {
      const req = {
        session: {
          uid: 'testId123',
        },
        params: {
          categoryName: 'Adventure',
          lastItem: 'Cromartie High School',
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

      expect(res.send.args.flat(2)[0]).to.have.property('animeId');
      expect(res.send.args.flat(2)[0]).to.have.property('mean');
      expect(res.send.args.flat(2)[0]).to.have.property('num_episodes');
      expect(res.send.args.flat(2)[0]).to.have.property('main_picture');
      expect(res.send.args.flat(2)[0]).to.have.property('animeTitle');
      expect(res.send.args.flat(2)[0]).to.have.property('categoryName');
      expect(res.send.args.flat(2)[0]).to.not.have.property('userId');
    });

    it("Caught error should send status 500 and err obj", async () => {
      const req = {};
      const status = sinon.stub();
      const send = sinon.stub();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const err = { errMsg: 'test error message'};
      sinon.stub(db, 'collection').throws(err);

      await categoryNextPageModule.categoryNextPage(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith(err)).to.be.true;
    });
   });
  
  describe("Test suite for category creation", () => { 
    afterEach(() => {
      sinon.restore();
    });

    it("Successful createSaveCategory() should res.send('Category creation successful')", async () => {
      const req = {
        session: {
          uid: 'userId', 
        },
        body: {
          categoryName: 'Comedy',
        },
      };
      const status = sinon.stub();
      const send = sinon.stub();
      const res = {
        status,
        send,
      };
      status.returns(res);

      await createCategoryModule.createSaveCategory(req, res);

      expect(res.send.calledWith('Category creation successful')).to.be.true;
    });

    it("Caught error for createSaveCategory() should send status 500 and err obj", async () => {
      const req = {};
      const status = sinon.stub();
      const send = sinon.stub();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const err = { errMsg: "Failed to create category" };
      sinon.stub(db, 'collection').throws(err);

      await createCategoryModule.createSaveCategory(req,res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith(err)).to.be.true;
    });
   });

  describe("Test suite for deleting anime", () => {
    afterEach(() => {
      sinon.restore();
    });

    it("deleteSavedAnime() send status 200 and 'successfully removed anime'", async () => {
      const req = {
        session: {
          uid: 'testId123',
        },
        body: {
          categoryName: 'Adventure',
          animeId: 21,
        },
      };
      const status = sinon.stub();
      const send = sinon.stub();
      const res = {
        status,
        send,
      };
      status.returns(res);

      await deleteAnimeModule.deleteSavedAnime(req, res);
      
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith('Successfully removed anime')).to.be.true;
    });

    it("Caught error should send status 500 and err obj", async () => {
      const req = {};
      const status = sinon.stub();
      const send = sinon.stub();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const err = { errMsg: 'Failed attempt to delete anime' };

      sinon.stub(db, 'collection').throws(err);

      await deleteAnimeModule.deleteSavedAnime(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith(err)).to.be.true;
    });
  });

  describe("Test suite for delete_category", () => { 
    it("deleteCategory() should return status 200 and send success string", async () => {
      const req = {
        session: {
          uid: "testId123",
        },
        params: {
          categoryName: "Adventure",
        },
      };
      const status = sinon.stub();
      const send = sinon.stub();
      const res = {
        status,
        send,
      };
      status.returns(res);

      await deleteCategoryModule.deleteCategory(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith("Category and its content successfully deleted")).to.be.true;
    });

    it("Caught error sends status 500 and err obj", async () => {
      const req = {};
      const status = sinon.stub();
      const send = sinon.stub();
      const res = {
        status,
        send,
      };
      status.returns(res);
      const err = { errMsg: 'Failed attempt to delete category and its contents' };

      sinon.stub(db, 'collection').throws(err);

      await deleteCategoryModule.deleteCategory(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith(err)).to.be.true;
    });
   });

 });