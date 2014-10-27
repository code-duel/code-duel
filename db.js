var mysql = require('mysql');
var fs = require('fs');

var dbConnection;

if (process.env.NODE_ENV === 'production') {
  dbConnection = mysql.createConnection({
    host: "us-cdbr-azure-west-a.cloudapp.net",
    user: "bd676bdbd0f5d7",
    password: "89f91f1f",
    database: "as_f2aa6bc5b126b42"
  });
} else {
  dbConnection = mysql.createConnection({
    user: "root",
    password: "",
    database: "scoreboard"
  });
}

dbConnection.connect();

exports.getAllScores = function(callback){
  var query = 'SELECT * from scores ORDER BY score DESC;';
  dbConnection.query(query, function(err,results){
    if(err) { console.log(err); }
    callback(err, results);  
  });
};

exports.saveScore = function(results){
  var query = 'INSERT INTO Scores(winner, loser, score, loserscore, roomname, prompt, time) VALUES (?, ?, ?, ?, ?, ?, ?);';
  dbConnection.query(query, [results.winner, results.loser, results.score, results.loserScore, results.roomname, results.prompt, results.time], function(err, results){
    console.log(err, results, "loooooooooooooooooook  ");
  });
};

//for tallying running score not
// exports.addScoreToUsersTable = function(data, callback){
//   var query = 'INSERT INTO users(username, socketid) VALUES (?,?);';
//   dbConnection.query(query, [data.player, data.id ], function(err, results){
//     callback(err, results);
//   });
// }

exports.findUsername = function() {
  var query = 'SELECT socketid FROM users WHERE username =?;';
  dbConnection.query(query, [], function(err, results){
    callback(err, results);
  });
};


exports.checkIfUserExists = function(username, callback){
  var query = 'SELECT username FROM users WHERE username = ?;'
  dbConnection.query(query, username, function(err, results){
    if(results.length > 0) {
      callback(true);
      console.log(results);
    } else {
      callback(false);
    }
  });
}

exports.addUser = function(username, socketid, password, callback){
  console.log('adding user as well')
  var query = 'INSERT INTO users (username, socketid, password) VALUES (?,?,?);'
  dbConnection.query(query, [username, socketid, password], function(err,results){
    if(err){ console.log(err) };
  })
}

exports.updateUser = function(username, socketid){
  var query = 'UPDATE users SET socketid = ? WHERE username = ?;'
  dbConnection.query(query, [socketid, username], function(err,results){
    if(err) { console.log(err) };
  })
}