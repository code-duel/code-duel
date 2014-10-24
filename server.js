var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/client'));


// globals
var users = {
  userCount: 0,
  socketList: [],
  userNames: [],
  userRooms: []
}

io.on('connection', function(socket){

  // individual user
  var userId = socket.id;

  // add user to count
  users.userCount++;
  console.log("");
  console.log("Socket", userId, "connected");


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
      users.socketList.push(userId);
      users.userNames.push(user);
      users.userRooms.push([userId, user, room, 0]);
      socket.join(room);
     
      console.log(user ,"(",userId,")", "added to", room);
      io.sockets.in(room).emit('joinedRoom', room);
    };


    // when room has a total of 2 people, send prompt to that specific room
    var providePrompt = function(specificRoom){

      // this logic just grabs a random prompt
      var prompts = ["Write a function that calulates 2 + 2.", "Write a function that calculates 2+2. Recursively.", "Write a function that calculates the nth digit of PI.", "Implement underscore\'s reduceRight method. Your solution should work for objects and for arrays.", "Write DOOM. In JavaScript."];
      var prompt = prompts[Math.floor(Math.random() * prompts.length)];
      
      // sends the prompt to a single room (the one pinging providePrompt)
      io.sockets.in(specificRoom).emit('displayPrompt', prompt);
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
      setTimeout(function(){providePrompt(room);}, 1000);
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
      isFull = Object.keys(roomLen).length === 4 ? true : false;
    }

    console.log("Fullness status of", specificRoom, ":", isFull);
    io.emit('roomStatus', isFull);

  });

  // ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~

  socket.on('sendCode', function(code){
    var codeScore = {};

    var result = []; 
    result.push(eval(code));
    var score = Math.floor(Math.random() * 10) + 1;  
      

      // wait for eval to return...
        setTimeout(function(){
          console.log("Code evaluates to:", result.toString());
          console.log("Score is:", score);
          
          codeScore.result = result.toString();
          codeScore.score = score;

          // look at the user obj to figure out where we are currently
          for(var i = 0; i < users.userRooms.length; i++){
            if(users.userRooms[i][0] === userId){
              var currentUser = users.userRooms[i][0]
              var currentRoom = users.userRooms[i][2];
              var currentScore = users.userRooms[i][3] = score;
              break;
            }
          }

          io.sockets.in(userId).emit('sendScore', codeScore);

          // if first run, this should be set to zero
          if(io.sockets.adapter.rooms[currentRoom]['highScore'] === 0){
            // thus, set the room's highScore to the score of the first submitter
            io.sockets.adapter.rooms[currentRoom]['highScore'] = currentScore;
            // set the room's first submitter to "firstPlayer"
            io.sockets.adapter.rooms[currentRoom]['firstPlayer'] = currentUser;

          } else {
            
            if(io.sockets.adapter.rooms[currentRoom]['highScore'] < currentScore){
              // second player is the winner
              console.log("SECOND USER WINS");
              io.sockets.in(io.sockets.adapter.rooms[currentRoom]['firstPlayer']).emit('isWinner', false);
              io.sockets.in(currentUser).emit('isWinner', true);  
            } else {
              // first player is the winner
              console.log("FIRST USER WINS");
              io.sockets.in(io.sockets.adapter.rooms[currentRoom]['firstPlayer']).emit('isWinner', true);
              io.sockets.in(currentUser).emit('isWinner', false);  
            }
            
          }

        }, 1000); // this can be lengthened to give the impression of processing time, haha

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
