var fs = require('fs');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var db = require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/client'));

// Log server errors
process.on('uncaughtException', function (err) {
    console.log(err);
}); 

// globals
var users = {
  userCount: 0,
  socketList: [],
  userNames: [],
  userRooms: []
};

io.on('connection', function(socket){

  // individual user
  var userId = socket.id;

  // add user to count
  users.userCount++;
  console.log("");
  console.log("Socket", userId, "connected");
  
  //grab all the highscores from the db and send them to login view
  db.getAllScores(function(err, scores){
    socket.emit('getHighScores', scores);
  });

// ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~


  // add to room
  socket.on('addToRoom', function(userInfo){
    // console.log('username is ', username);
    var user = userInfo.username;
    var room = userInfo.roomname;

    console.log('room is ', room);
    // variable used to determine number of users in a room
    var roomLen = io.sockets.adapter.rooms[room];


    // if room isn't full, add the user and update the users object

    var addUser =  function(){
      if (users.socketList.indexOf(userId) === -1){
        users.socketList.push(userId);
        users.userNames.push(user);
        users.userRooms.push([userId, user, room, 0]);
        socket.join(room);
        //send room and user data to room
        var roominfo = {
          name: room,
          id: userId,
          player: user
        };

        console.log(user ,"(",userId,")", "added to", room);
        setTimeout(function() {
          io.sockets.in(userId).emit('joinedRoom', roominfo);
        }, 1000);
      }
    };
     
    
    //   //check if user exist
    // db.checkIfUserExists(user, function(exists){
    //   if(exists){
    //    console.log('exists')
    //     db.updateUser(user, userId);
    //   } else {
    //     console.log('adding user')
    //     db.addUser(user, userId);

    //   }

    // });  


    // when room has a total of 2 people, 
     //prompt to that specific room
    var providePrompt = function(specificRoom){

      // this logic just grabs a random prompt
      var prompts = fs.readdirSync('./problems');
      // the directories in the 'problems' directory must be names after
      // their corresponding functions and there cannot be anything in 
      // 'problems' that isn't a problem directory
      var problemName = prompts[Math.floor(Math.random() * prompts.length)];
      // reads the prompt from the appropriate directory and
      // sends it to a single room (the one pinging providePrompt)
      fs.readFile('./problems/' + problemName + '/prompt.js', 'utf8',
        function(err,data) {
        if (err) {
          console.error(err);
        }
        else {
          var prompt = data;
          io.sockets.in(specificRoom).emit('displayPrompt', {prompt: prompt, problemName: problemName, opponents: users.userNames});
        }
      });
    };


    // user one, room doesn't exist
    if(!roomLen){
      addUser();

    // second user to a single room  
    } else if (Object.keys(roomLen).length === 1 || Object.keys(roomLen).length === 3 && users.socketList.indexOf(userId) === -1){
       // "highScore" is used later to evaluate whether both users in a room have submitted code
      io.sockets.adapter.rooms[room]['highScore'] = 0;
      io.sockets.adapter.rooms[room]['firstPlayer'] = null;
      addUser();
      setTimeout(function(){
        providePrompt(room);
      }, 1000);
    }

  });

// ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~

  //helper fuction checks if room is full
  socket.on('checkRoom', function(specificRoom){
    var roomLen = io.sockets.adapter.rooms[specificRoom];
    var isFull;

    if(!roomLen){
      isFull = false;
    } else {
      // this needs to check for 4 items because 
      // we're adding two extra properties per user the roomLen array
      isFull = Object.keys(roomLen).length > 3 ? true : false;
    }

    console.log("Fullness status of", specificRoom, ":", isFull);
    io.emit('roomStatus', isFull);

  });

  // ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~

  socket.on('sendCode', function(code){


    // get the function evaluated
    eval(code.code);
    // run the tests
    var test = require('./problems/' + code.problemName + '/test.js');
    var percentageRight = test.testFunction(eval(code.problemName));
    // Get the time it took to write the function
    var timeTaken = code.timeTaken;
    // Compute the score

    // The algorithm is mostly based on the tests with time taken
    // used to break ties between people who passed the same tests
    console.log('rwf', percentageRight);
    console.log('rwf', timeTaken);
    var score = Math.floor((percentageRight * 10) + (100/timeTaken));
    console.log("Final score is: " + score);
    // Send the score back to the user
    io.sockets.in(userId).emit('sendScore', score);
    
    // look at the user obj to figure out where we are currently
    for(var i = 0; i < users.userRooms.length; i++){
      if(users.userRooms[i][0] === userId){
        var currentUser = users.userRooms[i][0]
        var currentRoom = users.userRooms[i][2];
        var currentScore = users.userRooms[i][3] = score;
        break;
      }
    }
    
    //find opponent by looking at users object with all peopl in room
    var opponent;
    var findOpponent = function() {
      for (var i =0; i < code.players.length; i++){
        if(code.players[i]!==code.player){
          opponent = code.players[i];
        }
      }
    }();
    

    var date = new Date();
    date = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear(); 
      console.log(date);
    // if first run, this should be set to zero
    if(io.sockets.adapter.rooms[currentRoom]['highScore'] === 0){
      // thus, set the room's highScore to the score of the first submitter
      io.sockets.adapter.rooms[currentRoom]['highScore'] = currentScore;
      // set the room's first submitter to "firstPlayer"
      io.sockets.adapter.rooms[currentRoom]['firstPlayer'] = currentUser;

    } else {
      var roomHighScore = io.sockets.adapter.rooms[currentRoom]['highScore'];
      if(roomHighScore < currentScore){
      
        //compile results to store in db
        var results = {
          winner: code.player,
          loser: opponent,
          score: currentScore,
          loserScore: roomHighScore,
          prompt: code.problemName,
          roomname: code.roomname,
          time: date
        }
        
        db.saveScore(results);
        // second player is the winner
        console.log("SECOND USER WINS");
        io.sockets.in(io.sockets.adapter.rooms[currentRoom]['firstPlayer']).emit('isWinner', {isWinner: false, opponentScore: currentScore});
        io.sockets.in(currentUser).emit('isWinner', {isWinner: true, opponentScore: roomHighScore});  
      } else {
        
        //compile results to store in db
        var results = {
          winner: opponent,
          loser: code.player,
          score: roomHighScore,
          loserScore: currentScore,
          prompt: code.problemName,
          roomname: code.roomname,
          time: date
        }

        db.saveScore(results);
        // first player is the winner
        console.log("FIRST USER WINS");
        io.sockets.in(io.sockets.adapter.rooms[currentRoom]['firstPlayer']).emit('isWinner', {isWinner: true, opponentScore: currentScore});
        io.sockets.in(currentUser).emit('isWinner', {isWinner: false, opponentScore: roomHighScore});  
      }
      
    }

  });


  // ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~

  // detects when socket disconnects and cleans up users obj
  socket.on('disconnect', function(){
    console.log("");
    console.log("Socket", userId, "disconnected");

    for(var i = 0; i < users.userRooms.length; i++){
      if(users.userRooms[i][0] === userId){

        // destroy "room" session for all users
        var currentRoom = users.userRooms[i][2];
        io.sockets.in(currentRoom).emit('destroyPrompt');

        // remove user/room from object
        users.userRooms.splice([i], 1);
        break;
      }
    }

    for(var i = 0; i < users.socketList.length; i++){
      if(users.socketList[i] === userId){
        users.socketList.splice([i], 1);
        users.userNames.splice([i], 1);
        break;
      }
    }

    users.userCount--;
    console.log("Remaining activity:");
    console.log(users);
  });
});

http.listen(port, function(){
  console.log('listening on port:', port);
});
