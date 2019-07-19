const config = {
    dev: {
        database: 'scraper',
        host: '127.0.0.1',
        username: 'root',
        password: '',
        redis_host: '127.0.0.1',
        redis_port: 6379
    },
};

module.exports = config["dev"];