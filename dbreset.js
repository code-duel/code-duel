// RESETS the database. Drops the tables and recreates them

var dbLocation = process.argv[2];
console.log(dbLocation);

if (!(dbLocation === 'local' || dbLocation === 'production')) {
	console.log('ERROR in dbreset.js');
	console.log('You must provide a database to reset as an argument');
	console.log('Please provide \'local\' or \'production\' ');
	process.exit();
}

var mysql = require('mysql');
var fs = require('fs');

var dbConnection;

if (dbLocation === 'production') {
	dbConnection = mysql.createConnection({
    host: "us-cdbr-azure-west-a.cloudapp.net",
    user: "bd676bdbd0f5d7",
    password: "89f91f1f",
    database: "as_f2aa6bc5b126b42"
	});
} else {
  dbConnection = mysql.createConnection({
    user: "root",
    password: ""
  });
}

dbConnection.connect();

if (dbLocation === 'local') {
  dbConnection.query('CREATE DATABASE IF NOT EXISTS scoreboard', function(err, results) {
    if (err) { console.log("ERROR setting up DB: " + err); }
  });
  dbConnection.query('USE scoreboard', function(err, results) {
    if (err) { console.log("ERROR setting up DB: " + err); }
  });
}



var count = 0;

fs.readFile('./schema.sql', 'utf8', function(err, data) {
  if (err) {
    console.log("ERROR reading the schema file: " + err);
  } else {
  	// Extract the setup queries from the file and run them
    var setupQueries = data.split(';').slice(0,-1);
    setupQueries.map(function(q) {
      dbConnection.query(q + ';', function(err, results) {
      	count++;
        if (err) { 
          console.log('ERROR RUNNING: ' + q); 
          console.log(err);
        } else {
          console.log('SUCCESS RUNNING: ' + q);
        }
    		if (count === setupQueries.length) {
    			process.exit();
    		}
      });
    });
  }
});