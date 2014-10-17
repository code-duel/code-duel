angular.module('app')
  .controller('loginCtrl', function($scope, $location, userService) {
    $scope.submitUserRoom = function(){
      //send $scope.username and $scope.roomname to our sockets service somehow.
      console.log('you clicked the button');
      userService.user.username = $scope.username;
      userService.user.roomname = $scope.roomname;

      $location.url('/room');
    }
  });