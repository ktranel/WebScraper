const axios = require('axios');
const db = require('./database');
const cache = require('./cache');
const MAX_SCRAPES = 1000;

// number of jobs currently running
let jobs = 0;

// Scraping Queues
const pendingQueue = [];

function pendingDequeue(){
    return pendingQueue.shift();
}

function pendingEnqueue(url){
    return pendingQueue.push(url);
}

/*
@args
    - jobId : string (the reference for this job)
    - url : string (the url to be scraped)
    - force : bool (force a cache update)
Recursive call that will see if an item has already been cached.
If not the function checks if a limit has been reached. If it has, the item is
added to a queue for later processing. If not the item is processed when
the loop becomes available again.
 */
async function scrape(jobId, url, force){
    let cachedItem = null;
    if (!force) cachedItem = await cache.checkCache(url);

    if (cachedItem){
        db.addJob(jobId, cachedItem);
    }else{
        // add to pending queue if some number of jobs is exceeded
        if (jobs > MAX_SCRAPES) return pendingEnqueue({jobId, url, force});

        // scrape site
        ++jobs;
        const content = await axios.get(url)
            .catch(e => console.log(e));
        if (content.data) {
            cache.setCache(url, content.data);
            db.addJob(jobId, content.data);
        }
        --jobs;
    }

    // get next job from pending queue if new jobs have been added
    if (pendingQueue.length > 0) {
        const item = pendingDequeue();
        scrape(item.jobId, item.url, item.force);
    }
}

function getCompleted(id){
    return db.getJob(id);
}

module.exports = {
    add: scrape,
    get: getCompleted
};