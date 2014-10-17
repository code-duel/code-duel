angular.module('app')
  .controller('roomCtrl', function($scope, $modal, $log, userService) {
    $scope.roomname = userService.user.roomname;
    $scope.username = userService.user.username;
    console.log('room controller loads');

    $scope.ready = false;

    $scope.setReady = function(){
      $scope.ready = !$scope.ready;
    };

    $scope.open = function(size){
      var modalInstance = $modal.open({
        templateUrl: 'Waiting/waitingView.html',
        controller: 'waitingCtrl',
        size: size
      });
    };

    console.log('room controller is about to call open');

   $scope.open();
    console.log('room controller has called open');

  });