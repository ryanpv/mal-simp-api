const NodeCache = require('node-cache')

const cache = new NodeCache();
// { maxKeys: } to set maximum amount of keys stored in cache 

module.exports = duration => (req, res, next) => {
  // is req a GET?
  // if not, call next
  // if (req.method !== 'GET') {
  //   console.error('Cannot cache non-GET methods');
  //   return next();
  // }
  const key = req.originalUrl.replace(/%20/g, '') + req.session.uid
  const cachedResponse = cache.get(key);
  // cache.keys() to retreive cache keys
  
  if(req.method === "POST" || req.method === "DELETE") {
    // const paramsConcat = req.params.categoryName.replace(/\s+/g, '')
    const categoryNameConcat = req.body.categoryName.replace(/\s+/g, '')
    const cacheFilter = cache.keys().filter(k => k.includes(categoryNameConcat));
    cache.del(cacheFilter)
    // cache.has() check if key exists
    return next();
  }
  // check if key exists in cache
  // console.log('cache keys: ', categoryNameConcat); // returning all keys that match the params
  // console.log('cache keys: ', cache.keys().filter(k => k.includes('/Watch%20Later')));
  // if it exists, send cache result
  if (cachedResponse) {
    // console.log('cached response: ', cachedResponse);
    res.send(cachedResponse);
  } else {
    // if not, replace .send with method to set response to cache
    res.originalSend = res.send;
    res.send = body => {
      res.originalSend(body);
      cache.set(key, body, duration);

    };
    next();
  }
};