angular.module('app')
  .controller('loginCtrl', function($scope, $location, socket) {
    $scope.submitUserRoom = function(){

      socket.emit('checkRoom', $scope.roomname);

      $scope.pickNewRoom = false;

      socket.on('roomStatus', function(isFull){
        $scope.roomfull = isFull;
        console.log($scope.roomname);
        console.log("IS FULL:", isFull);
          if(isFull){
            $scope.pickNewRoom = true;
            console.log("Pick a new room!");
          } else if (isFull === false) {
            socket.emit('addToRoom', { username:$scope.username, roomname: $scope.roomname});
            $location.url('/room'); 
          }
      });

      socket.on('joinedRoom', function(room){
        console.log("You are in room:", room);
      });
    };
  });