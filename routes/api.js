const express = require('express');
const router = express.Router();
const Scraper = require('../services/Scraper');
const uuidv4 = require('uuid/v4');
const validate = require('validate.js');


/* Route to scrape a website
@query
    - url : string
    - force : string (optional)
 */
router.post('/', async (req, res) => {
    let { url, force } = req.query;
    force = force === 'true' || parseInt(force) === 1 ? true : null;
    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) url = `https://${url}`;
    const constraints = {
        url: {
            presence: true,
            type: 'string',
            length: { minimum: 1, maximum: 150 },
            url: {
                allowLocal: true,
                schemes: ['http', 'https', ''],
            }
        },
    };
    const validation = validate({ url }, constraints);
    if (validation) return res.status(400).json({ error: validation });

    const jobId = uuidv4();
    res.status(200).json({ jobId });
    Scraper.add(jobId, url, force);
});

/* Route to see if a scrape has finished
@query
    - id : string
 */
router.get('/', async (req, res) => {
    const { id } = req.query;
    const constraints = {
        id: {
            presence: true,
            type: 'string',
            length:{ is: 36 }
        },
    };
    const validation = validate({ id }, constraints);
    if (validation) return res.status(400).json({ error: validation });
    let job = await Scraper.get(id);
    if(job.length < 1) job = 'Job not found. The website may still be processing or you may have entered an invalid jobId';
    return res.status(200).json({ result: job });
});

module.exports = router;
