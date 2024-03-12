# WorldAnime (MAL-Simplified) - a MyAnimeList project

As someone who enjoys anime and is always looking for a new show to watch, I wanted to create a project that had something to do with anime. I believe that the original MyAnimeList(MAL).net is a fantastic site to get all your anime information, but I wanted to simplify it a bit more. The idea of MAL-Simplified is to be focused solely on anime titles rather than including manga, anime news, etc. Users would be able to quicky search any anime available on the MAL database and view basic information such as scores, synopsis, and trailers.

To check out the live site, visit [WorldAnime](https://mal-simplified.web.app/)

If you'd like to take a look at the front-end source code, go to [mal-simp](https://github.com/ryanpv/mal-simp)

![WorldAnime-Screenshot](https://github.com/ryanpv/mal-simp/blob/main/public/WorldAnime-SS.png)

## Features
* View top upcoming anime, top airing anime, seasonal anime (can query different seasons)
* View trailers through a modal by clicking on the anime poster
* Log into your MyAnimeList account and see MAL's recommended anime titles
* View your saved items from MyAnimeList
* Sign up and login 
* Option to sign in with google 
* CRUD operations
* Create custom categories to save anime titles to
* Delete categories
* Remove anime titles from any saved lists
* Paginate through all content lists
* Error handling for bad requests/server errors

## Technologies

### Front-end
* ReactJS
* Firebase - user authentication

### Back-end
* ExpressJS
* Axios - network requests to MAL API
* Firebase-admin - verify user token 
* Cloud firestore - database (Not Realtime Database)
* Node-cache - cache user's saved list to reduce calls to db

## Future ideas/features
* Search function for user's saved list
* CRUD operations on user's MAL saved list

## Deployment (CI/CD pipeline)
* Front-end is deployed through firebase-hosting
* Back-end is deployed using firebase functions
* Deployment is through github actions
* Tests are run on the back-end code
* Testing with mocha, chai, supertest, sinon
* After test completes eslint is run
* If all actions pass, then updated code is deployed to production with firebase deploy

## Run locally
If anyone wishes to run this locally then start server with "npm run dev" and then client side with "npm run start". Please see package.json files for both for more scripts.