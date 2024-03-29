const redis = require('redis');
const config = require('../config');
const client = redis.createClient(config.redis_port, config.redis_host);
client.get = require('util').promisify(client.get).bind(client);

// Ensure redis connect on startup
client.on('connect', function() {
    console.log('Redis client connected');
});
client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});


function checkCache(url){
    return client.get(url);
}

function setCache(url, content){
    // set to expire after 1 day to keep content up to date
    // change if quicker or lengthy updates are needed
    return client.set(url, content, 'EX', 60*60*24);
}

module.exports = {
    checkCache,
    setCache
};