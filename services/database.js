const mysql = require('mysql2');
const config = require('../config');
const escape = require('escape-html');


// create the connection to database
const connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
});

connection.query(
    `CREATE TABLE IF NOT EXISTS jobs(
              id int(11) NOT NULL AUTO_INCREMENT,
              jobId char(36) NOT NULL,
              content longtext DEFAULT NULL,
              PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB AUTO_INCREMENT=363 DEFAULT CHARSET=latin1;
            `,
    (err, result) => {
        if (err) {
            console.log(err);
            console.log('Unable to create table. Please manually create table jobs');
        }
    }
    );

function addJob(id, content){
    return new Promise((resolve, reject) =>{
        content = escape(content);
        const sql = `INSERT INTO jobs (jobId, content) VALUES ("${id}", "${content}")`;
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
            `SELECT * FROM jobs WHERE JobId = '${id}'`,
            function(err, results) {
                if (err) return reject(err);
                return resolve(results);
            }
        );
    });
}

module.exports = {addJob, getJob};