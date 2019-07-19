const mysql = require('mysql2');
const escape = require('escape-html');


// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'scraper'
});

function addJob(id, content){
    return new Promise((resolve, reject) =>{
        content = escape(content);
        const sql = `INSERT INTO Jobs (jobId, content) VALUES ("${id}", "${content}")`;
        connection.query(
            sql,
            function(err, results) {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
}

function getJob(id){
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM Jobs WHERE JobId = '${id}'`,
            function(err, results) {
                if (err) return reject(err);
                return resolve(results);
            }
        );
    });
}

module.exports = {addJob, getJob};