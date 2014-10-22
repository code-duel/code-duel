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
  socket.on('addToRoom', function(room){
    // console.log('username is ', username);
    console.log('room is ', room);
    // variable used to determine number of users in a room
    var roomLen = io.sockets.adapter.rooms[room];

    // if room isn't full, add the user and update the users object
    var addUser =  function(){
      users.socketList.push(userId);
      // users.userNames.push(username);
      // users.userRooms.push([userId, username, room]);
      socket.join(room);

      // console.log(username ,"(",userId,")", "added to", room);
      io.sockets.in(room).emit('joinedRoom', room);
    };

    // when room has a total of 2 people, send prompt to that specific room
    var providePrompt = function(specificRoom){

      // this logic just grabs a random prompt
      var prompts = ["Hello, solve this problem", "Solve this one", "Solve this other one too", "Waa waa waaaaaa", "Prompty Prompt", "abcdefg", "hijklmnop", "phhbbbbbbb"];
      var prompt = prompts[Math.floor(Math.random() * prompts.length)];

      // sends the prompt to a single room (the one pinging providePrompt)
      io.sockets.in(specificRoom).emit('displayPrompt', prompt);
    };

    // user one, room doesn't exist
    if(!roomLen){
      addUser();

    // second user to a single room  
    } else if (Object.keys(roomLen).length < 2 && users.socketList.indexOf(userId) === -1){
      addUser();
      providePrompt(room);
    }

  });

  socket.on('butt', function(){
    console.log('eww gross');
  });

// ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~

  //helper fuction checks if room is full
  socket.on('checkRoom', function(specificRoom){
    console.log('checking room ' + specificRoom);
    var roomLen = io.sockets.adapter.rooms[specificRoom];
    console.log(roomLen);
    var isFull;

    if(!roomLen){
      isFull = false;
    } else {
      isFull = Object.keys(roomLen).length >= 2 ? true : false;
    }

    console.log("Fullness status of", specificRoom, ":", isFull);
    io.emit('roomStatus', isFull);

  });

  // ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~  ***  ~~~~~~~~~~~~~

  // socket.on('scoreSent', function(score){
  //   console.log("Score received:", score);
  // });

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
