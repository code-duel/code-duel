var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/client'));


io.on('connection', function(socket){
  console.log('a user connected');


  socket.on('addToRoom', function(room){
    socket.join(room)
    console.log("JOINED ROOM:", room)
  });

  //helper fuction checks if room is full
  socket.on('checkroom', function(room){

    var roomLen = io.sockets.adapter.rooms[room];
    var isFull;

    if(!roomLen){
      isFull = false;
    } else {
      isFull = Object.keys(roomLen).length >=2 ? true : false;
    }

  io.emit('roomStatus', isFull);

 });

  socket.on('disconnect', function(){
    delete io.sockets.adapter.rooms[socket.id]
    console.log('user disconnected');
  });

});

http.listen(port, function(){
  console.log('listening on port:', port);
});
