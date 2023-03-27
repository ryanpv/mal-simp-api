const express = require("express");
const router = express.Router();
const { getCode, verifyFirebaseToken } = require('../middleware/middleware')
const cache = require('../middleware/routeCache')
const axios = require ("axios");
const clientId = process.env.MAL_CLIENT_ID;
const clientSecret = process.env.MAL_CLIENT_SECRET;
const malClientHeader = {
  'X-MAL-CLIENT-ID' : clientId
};
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore();

// process.env.NODE_ENV = 'development'

router.route('/').get(function (req, res) {
  res.send('hello world, welcome to MAL SIMP!!!');
});

router.route('/user/saved').get(function (req, res) {
  const loggedIn = false

  if (loggedIn) {
    res.send('successfully logged');
  };
  res.send('you are unauthorized. please log in');

});

// GET list of anime from https://api.myanimelist.net/v2/anime search query
router.route('/animesearch/:offset/anime').get(async function (req, res) {
  // q is query (as string) 
  const query = req.query.q;
  const offset = req.params.offset
  console.log(query);

  try {
    const animeList = await axios.get(`https://api.myanimelist.net/v2/anime?q=${ query }&offset=${ offset }&limit=15&fields=pictures,mean,synopsis`, {
      headers: malClientHeader
    });

    // console.log(query);
    res.send(animeList.data);

  } catch (err) {
    console.log(err);
    res.send('fetch error');
  };
});

// GET anime details of SINGLE result
router.route('/anime/:id/:fields').get(async function (req, res) {
  // anime/30230?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,
  // rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,
  // my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics
  // videos*********** field will provide the trailer URLs
  // some fields cannot be retrieved together
  const id = req.params.id;
  const fields = req.params.fields

  try {
    const animeDetail = await axios.get(`https://api.myanimelist.net/v2/anime/${ id }?fields=${ fields }`, {
      headers: malClientHeader
    });

    // console.log('single anime query: ', animeDetail.data);
    res.send(animeDetail.data);

  } catch (err) {
    console.log(err);
    res.send("search has resulted in error");
  };
});

// GET anime related to the 'RANKING' field
router.route('/anime-ranked/:rankType/:offset').get(async function (req, res) {
  const offset = req.params.offset;
  const rankType = req.params.rankType // 'ranking' type values are fixed (ie. top anime)
  const limit = rankType === 'airing' ? 5 : 8; // only returning 5 results for 'Top airing' page, all other pages return 8 results
  
  try {
    const animeRanking = await axios.get(`https://api.myanimelist.net/v2/anime/ranking?ranking_type=${ rankType }&limit=${ limit }&offset=${ offset }&fields=pictures,status,mean,synopsis,num_episodes`, {
      headers: malClientHeader
    }); // includes an array in payload

    // console.log(JSON.stringify(animeRanking.data, null, 2));

    res.send(animeRanking.data);

  } catch (err) {
    console.log(err);
    res.send('ranked query error');
  };
});

// GET list of SEASONAL anime
router.route('/seasonal-anime/:year/:season/:offset/').get(async function (req, res) {
  // pop() for last anime ???
  const year = req.params.year; // required***
  const season = req.params.season; // required***
  const limit = req.params.limit;
  const offset = req.params.offset;
  const genre = req.params.genre;


  try {
    const seasonalAnime = await axios.get(`https://api.myanimelist.net/v2/anime/season/${ year }/${ season }?limit=8&offset=${ offset }&fields=${ genre },num_episodes,mean,synopsis,status`, {
      headers: malClientHeader
    });
    res.send(seasonalAnime.data);

  } catch (err) {
    console.log(err.data);
    res.json(err.data)
  };
})

//////////////////////////////***AUTHORIZATION FOR MYANIMELIST***////////////////////////////////////////
router.route('/create-challenge').get(getCode, async function (req, res) {
  const pkceCookie = req.cookies.pkce_cookie
  // console.log('***code challenge set***', pkceCookie);

    // await res.redirect('/callback') 
console.log('ENV: ', process.env.NODE_ENV);
    // MUST BE REDIRECTED OTHERWISE MAP API CANNOT VERIFY CODE_CHALLENGE FOR WHATEVER REASON*****************
    if(process.env.NODE_ENV === 'development') {
      await res.redirect('/callback')
    } else {
      await res.redirect('/api/callback')
    } 

  // res.json(pkceCookie.challenger)
  
});

router.route('/callback').get(async function (req, res) { 
  const pkceAuth = req.cookies.pkce_cookie

  // console.log('***redirected code***', pkceAuth.challenger);
  res.json(pkceAuth.challenger)

})


router.route('/mal-auth').post(async function (req, res) {
  const malAuthCode = req.query.code;
  const malpkce = req.cookies.pkce_cookie;
  // console.log('challenge verified', malpkce.challenger);
  // console.log('mal auth params reached with: ', clientId);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*'
  }
  
  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code: malAuthCode,
    // redirect_uri: 'https://mal-simplified.web.app/logcallback',
    redirect_uri: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/logcallback' : 'https://mal-simplified.web.app/logcallback',
    code_verifier: req.cookies.pkce_cookie.challenger,
  }
  
  try {
    // console.log('mal auth try statement reached');
    const malAuth = await axios.post(`https://myanimelist.net/v1/oauth2/token`, data, {headers: headers})
    const tokenReqRes = await malAuth.data
    // console.log('mal token response', tokenReqRes);

    res.cookie('mal_access_token', tokenReqRes, {
      httpOnly: 'true'
    })
    // console.log('mal auth token acquired');

    if (req.cookies.mal_access_token) {
      req.malCookie = tokenReqRes.access_token
      // console.log('mal token acquired with client')
    }

    res.end() //end request in order to access data


  } catch (err) {
    console.log(err.response);
    res.send('verifier error')
  }
})

router.route('/get-mal-username').get(async function (req, res) {
  const tokenData = req.cookies.mal_access_token;
  // console.log('get mal username route hit', tokenData);
  try {
    const malUserDetails = await axios.get('https://api.myanimelist.net/v2/users/@me?fields=anime_statistics', 
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':`Bearer ${ tokenData && tokenData.access_token }` },
        // 'Access-Control-Allow-Origin': '*'
    });
    const getMalUser = await malUserDetails;
    // console.log('mal username ', getMalUser.data)

    res.send(getMalUser.data);

  } catch (err) {
  console.log({ 'error message': err.message, 'error data': err.response.data });
  res.send('MAL access token not available. Login required.')
  }
})

/////// CLEAR COOKIE TO REMOVE MAL TOKEN //////////////
router.route('/clear-mal-cookie').get(async function (req, res) {
  res.clearCookie('mal_access_token');
  // console.log('cookie cleared');
  res.end();
})

router.route('/token-test').get(async function (req, res) {
  const tokenData = req.cookies.mal_access_token
  // console.log('test route', tokenData);
  // return tokenData

  res.send(tokenData)
})


////////////////////////////GET USER LIST

router.route('/user-list/:offset').get(async function (req, res) {
  const tokenData = req.cookies.mal_access_token
  const offset = req.params.offset
  // console.log('MAL user list', tokenData);
  // console.log('req user', req.user);

  try {
    const getUserAnimeList = await 
      axios.get(`https://api.myanimelist.net/v2/users/@me/animelist?fields=mean,synopsis,status,videos,num_episodes&offset=${ offset }&limit=8`, 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':`Bearer ${tokenData.access_token}`}
        }
      )
    const parsedList = await getUserAnimeList

    // console.log('li', parsedList.data.data);
    res.send(parsedList.data)

  } catch (err) {
    console.log(err);
  }
})

////////////////GET USER RECOMMENDATIONS////////////////////

router.route("/user-recommendations/:offset").get(async function (req, res) {
  const tokenData = req.cookies.mal_access_token
  const offset = req.params.offset

  try {
      
      const getUserRecommendations = await
      axios.get(`https://api.myanimelist.net/v2/anime/suggestions?limit=8&offset=${ offset }&fields=synopsis,mean,status,num_episodes`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization':`Bearer ${tokenData.access_token}`
        }
      });
      
      // console.log('recommendations ', getUserRecommendations.data.data);
      res.send(getUserRecommendations.data)

  } catch (error) {
    console.log(error);
    res.status(401).send("Please log into MAL")
  }
})



//////////////FIRE STORE DATABASE ROUTES/////////////////

////////// CREATE A CATEGORY //////////////
router.route('/create-category').post(verifyFirebaseToken, async function (req, res) {
  // should this method use merge to keep all categories in one doc? or have several different docs...
  try {
    const docRef = db.collection('anime-categories').doc();
    await docRef.set({
      userId: req.user.uid,
      categoryName: req.body.categoryName
    });

    console.log('posted successfully');
    res.send('posted successfully');
  } catch (err) {
    console.log('unable to post collection: ', err);
  }
});
//////////// GET USERS CATEGORIES ////////////////////
router.route('/get-categories').get(verifyFirebaseToken, async function (req, res) {
  try {
    const allCategories = await db.collection('anime-categories')
      .where('userId', '==', req.user.uid)
      .orderBy('categoryName') // requires composite index - which has been created
      .get();
    // const categoriesList = await allCategories.docs.map((category) => {return { categoryName: category.data().categoryName}});
    const categoriesList = await allCategories.docs.map((category) => category.data().categoryName);

    // console.log('category list: ', categoriesList);
    res.send(categoriesList);
  } catch (err) {
    console.log('unable to retrieve category list: ', err);
  };
});

//////////// SAVE ANIME TO CATEGORY ////////////
router.route('/add-anime').post(verifyFirebaseToken, cache(), async function (req, res) {

  try {
    const animeDoc = db.collection('mal-simp').doc() // firestore where() allows to query docs without specifying doc id. use random id
    await animeDoc.set({
      userId: req.user.uid,
      animeTitle: req.body.animeTitle,
      categoryName: req.body.categoryName, // req.body sends these details ofc
      animeId: req.body.animeId,
      num_episodes: req.body.num_episodes,
      main_picture: req.body.main_picture,
      mean: req.body.mean
    }, { merge: true });

    // const titlesDoc = db.collection('saved-anime-titles').doc(req.user.uid)
    // const getDoc = await titlesDoc.get()

    // titlesDoc.get()
    //   .then((docSnapshot) => {
    //     if (docSnapshot.exists) {
    //       console.log(getDoc.data());
    //       titlesDoc.update({
    //         animeTitleList: FieldValue.arrayUnion({animeTitle: req.body.animeTitle, animeId: req.body.animeId})
    //       })
    //     } else {
    //       titlesDoc.set({
    //         userId: req.user.uid,
    //         animeTitleList: [{animeTitle: req.body.animeTitle, animeId: req.body.animeId}]
    //       })
    //     }
    //   })
    
    res.send('posted anime');
  } catch (err) {
    console.log('unable to post document: ', err);
  };
});

//////// GET CATEGORY DATA ////////////////
router.route('/get-content/:categoryName').get(verifyFirebaseToken, cache(300), async function (req, res) { // query with parametersz
  try {
    const snapshot = await db.collection('mal-simp')
      .where('userId', '==', req.user.uid)
      .where('categoryName', '==', req.params.categoryName) // req.body.categoryName
      .orderBy('animeTitle')
      // .startAfter('Holo no Graffiti')
      .select('animeTitle', 'categoryName', 'animeId', 'num_episodes', 'main_picture', 'mean') // omits userId which is saved in each doc
      .limit(10)
      .get();

    const last = snapshot.docs[snapshot.docs.length - 1] // last doc from prev query
    const snapReturn = snapshot.docs.map((doc) => doc.data())
    // .then((snaps) => {return snaps.data()}); // get() method will return entire collection
    // const snapReturn = snapshot.get()
    //   .then((snap) => {
      //     return snap.docs.map(doc => doc.data());
      //   }).catch(err => console.log(err))
    // console.log(`no cache hit for ${ req.originalUrl }`);
    // console.log(`snap return ${ JSON.stringify(snapReturn) }`);
    res.send(snapReturn);
    } catch (err) {
      console.log('unable to retrieve category data: ', err);
    };
});

///////////// CATEGORY DATA PAGINATION FOWARD ///////////////////
router.route('/content-paginate-forward/:categoryName/:lastItem').get(verifyFirebaseToken, cache(300), async function (req, res) {
  const lastItem = req.params.lastItem;
  console.log(lastItem);
  try {
    const snapshot = await db.collection('mal-simp')
    .where('userId', '==', req.user.uid)
    .where('categoryName', '==', req.params.categoryName)
    .orderBy('animeTitle')
    .startAfter(lastItem)
    .limit(10)
    .get();

    const snapReturn = snapshot.docs.map((doc) => doc.data());
    // console.log(`no cache hit for ${ req.originalUrl }`);
    res.send(snapReturn);
  } catch (err) {
    console.log('unable to paginate forward: ', err);
  };
});



////////// DELETE CATEGORY ///////////
router.route('/delete-category/:categoryName').delete(verifyFirebaseToken, async function (req, res) {
  try {
    const deleteCategory = await db.collection('anime-categories') // deletes the category
      .where('userId', '==', req.user.uid)
      .where('categoryName', '==', req.params.categoryName);

    deleteCategory.get().then((query) => {
      query.forEach(doc => doc.ref.delete())
    });

    const deleteCategoryContents = await db.collection('mal-simp') // deletes all anime saved to category
      .where('userId', '==', req.user.uid)
      .where('categoryName', '==', req.params.categoryName);

    deleteCategoryContents.get().then((query) => {
     query.forEach(doc => doc.ref.delete())
     console.log('content deleted');
  });

    console.log('delete succsesfully');
    res.end();
  } catch (err) {
    console.log('error in deleting doc: ', err);
  };
});

/////////// DELETE SAVED ANIME ////////////////////
router.route('/remove-anime').delete(verifyFirebaseToken, cache(), async function (req, res) {
  // console.log(req.body);
  try {
    const deleteQuery = await db.collection('mal-simp')
      .where('userId', '==', req.user.uid)
      .where('categoryName', '==', req.body.categoryName)
      .where('animeId', '==', parseInt(req.body.animeId)) // animeId is posted as INT, ensure all reqs are parsed
      .limit(1) // limit 1 so user can only delete one doc at a time - solution for duplicate data
      .get()
      // .then((query) => {
      //   query.forEach((animeDoc) => animeDoc.ref.delete())
      // });
      const deleteDoc = await deleteQuery.docs.map(doc => doc.ref.delete());

    // const deleteTitle = await db.collection('saved-anime-titles')
    //   .where('userId', '==', req.user.uid)
    //   .where('animeId', '==', req.body)
    //   .get()

    //   const result = await deleteTitle.docs.map(doc => console.log('title: ', doc.data()))


      console.log('successfully removed anime');
    res.end();

  } catch (err) {
    console.log('unable to remove anime: ', err);
  };
});

/////////////// SEARCH SAVED ANIME ////////////////////////
router.route('/saved-anime-search/:animeSearch').get(verifyFirebaseToken, async function (req, res) {
  try {
    // console.log(req.params.animeSearch);
    const animeSearch = await db.collection('mal-simp')
      .where('userId', '==', req.user.uid)
      .where('animeTitle', '>=', req.params.animeSearch)
      .where('animeTitle', '<=', '\uf8ff')
      .get()
      .then(query => query.forEach(doc => console.log(doc.data()))) 

      // const searchResult = animeSearch.docs.map((doc) => doc.data())
      // console.log(searchResult);
      res.end();

  } catch (err) {
    console.log('error with search query: ', err);
  };
});




///////// RETRIEVE ENTIRE COLLECTION //////////// *** NOT NECESSARY FOR USERS, ADMIN ONLY
router.route('/get-entire-collection').get(async function (req, res) {
  console.time('Execution Time');
  const collection = await db.collection('mal-simp').get()
  const resArr = []
  // forEach method will automatically be called on the '.docs' property of the QuerySnapshot***
  const result = await collection.forEach((doc) => {
    const data = doc.data();
    data.mrn = doc.id
    resArr.push(data)
    // return {id: doc.id, data: doc.data()}
  })
  const resulting = collection.docs.map(doc => doc.data()); //data() will return data (snapshot object) as a json object (extracts the data from a DocumentSnapshot)***
  // console.log(resArr);
  console.timeEnd('Execution Time');
  res.send(collection);

});






module.exports = router;