var cache = require('memory-cache');
function getCache(request, response) {

    var cacheItems = cache.get('connections');

    console.log('Connection Cache Dump');
    console.log(cacheItems);

    response.send(cacheItems);
}



function init(app) {
    app.get('/debug/cache', getCache);

    console.log("Debug Controller Setup");
}

module.exports = init;