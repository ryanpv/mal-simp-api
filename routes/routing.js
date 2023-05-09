const express = require("express");
const router = express.Router();
const { getCode, verifyFirebaseToken } = require('../middleware/middleware')
const { checkMalToken } = require('../middleware/mal_token_check')
const cache = require('../middleware/routeCache')

const { malCodeChallenge } = require("../controllers/mal-auth/mal_code_challenge.js");
const { getMalAccessToken } = require("../controllers/mal-auth/mal_access_token.js");
const { getMalUsername } = require("../controllers/mal-user-data/mal_username.js");
const { searchMalAnime } = require("../controllers/mal-api-routes/search_mal.js");
const { singleAnimeQuery } = require("../controllers/mal-api-routes/single_query_mal.js");
const { animeRankingQuery } = require("../controllers/mal-api-routes/mal_ranking_type_query.js");
const { querySeasonalAnime } = require("../controllers/mal-api-routes/seasonal_query.js");
const { getMalSavedList } = require("../controllers/mal-user-data/mal_saved_list.js");
const { userRecommendations } = require("../controllers/mal-user-data/mal_user_recommendations.js");
const { createSaveCategory } = require("../controllers/user-db-queries/create_category.js");
const { fetchUserCategories } = require("../controllers/user-db-queries/get_user_categories.js");
const { saveAnimeToCategory } = require("../controllers/user-db-queries/save_anime.js");
const { getCategoryData } = require("../controllers/user-db-queries/category_data");
const { categoryNextPage } = require("../controllers/user-db-queries/category_next_page");
const { deleteSavedAnime } = require("../controllers/user-db-queries/delete_anime");
const { deleteCategory } = require("../controllers/user-db-queries/delete_category");
const { savedAnime } = require("../controllers/user-db-queries/query_saved_anime");
const { getDbCollection } = require("../controllers/admin/retrieve_collection");


router.route('/').get(function (req, res) {
  res.status(200).send('hello world, welcome to the server for MAL SIMP!!!');
});

// GET list of anime from https://api.myanimelist.net/v2/anime search query
router.route('/animesearch/:offset/anime')
  .get(searchMalAnime);

// GET anime details of SINGLE result
router.route('/anime/:id/:fields')
  .get(singleAnimeQuery)

// GET anime related to the 'RANKING' field
router.route('/anime-ranked/:rankType/:offset')
  .get(animeRankingQuery)

// GET list of SEASONAL anime
router.route('/seasonal-anime/:year/:season/:offset/')
  .get(querySeasonalAnime);


// ********** AUTHORIZATION FOR MYANIMELIST **********

router.route('/create-challenge')
  .get(getCode, malCodeChallenge);

router.route('/callback')
  .get(function (req, res) { 
    const pkceAuth = req.cookies.pkce_cookie;

    if (!pkceAuth) {
      res.status(401).send('challenger does not exist.')
    } else {
      res.status(200).json(pkceAuth.challenger);
    }

    // console.log('***redirected code***', pkceAuth.challenger);
  });

router.route('/mal-auth')
  .post(getMalAccessToken);


/////// CLEAR COOKIE TO REMOVE MAL TOKEN //////////////
router.route('/clear-mal-cookie')
  .get(async function (req, res) {
    res.clearCookie('mal_access_token');
  // console.log('cookie cleared');
    res.end();
  });

router.route('/token-test')
  .get(async function (req, res) {
    const tokenData = req.cookies.mal_access_token
    // console.log('test route', tokenData);

    res.send(tokenData)
  })

// ********** MAL AUTHORIZED ROUTES **********

///// MAL TOKEN TEST /////
router.route('/mal-token-test')
  .get(checkMalToken, (req, res) => res.status(200).send('MAL token VERIFIED'));

  ///////// MAL USERNAME /////////
router.route('/get-mal-username')
  .get(checkMalToken, getMalUsername);

 //////////GET USER LIST

router.route('/user-list/:offset')
  .get(checkMalToken, getMalSavedList);

////////////////GET USER RECOMMENDATIONS////////////////////

router.route("/user-recommendations/:offset")
  .get(checkMalToken, userRecommendations)


// ********** FIRE STORE DATABASE ROUTES **********

///// TEST ROUTE FOR FIREBASE TOKEN /////
router.route('/firebase-token-test')
  .get(verifyFirebaseToken, (req, res) => res.status(200).send('Token verification success!') )

////////// CREATE A CATEGORY //////////////
router.route('/create-category')
  .post(verifyFirebaseToken, createSaveCategory);

//////////// GET USERS CATEGORIES ////////////////////
router.route('/get-categories')
  .get(verifyFirebaseToken, fetchUserCategories);

//////////// SAVE ANIME TO CATEGORY ////////////
router.route('/add-anime')
  .post(verifyFirebaseToken, cache(), saveAnimeToCategory);

//////// GET CATEGORY DATA ////////////////
router.route('/get-content/:categoryName')
  .get(verifyFirebaseToken, cache(), getCategoryData);

///////////// CATEGORY DATA PAGINATION FOWARD ///////////////////
router.route('/content-paginate-forward/:categoryName/:lastItem')
  .get(verifyFirebaseToken, cache(), categoryNextPage);

////////// DELETE CATEGORY ///////////
router.route('/delete-category/:categoryName')
  .delete(verifyFirebaseToken, deleteCategory);

/////////// DELETE SAVED ANIME ////////////////////
router.route('/remove-anime')
  .delete(verifyFirebaseToken, cache(), deleteSavedAnime);

/////////////// SEARCH SAVED ANIME ////////////////////////
router.route('/saved-anime-search/:animeSearch').get(verifyFirebaseToken, savedAnime);


///////// RETRIEVE ENTIRE COLLECTION //////////// *** NOT NECESSARY FOR USERS, ADMIN ONLY
router.route('/get-entire-collection').get(getDbCollection);



module.exports = router;