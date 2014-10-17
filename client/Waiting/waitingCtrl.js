angular.module('app')
  .controller('waitingCtrl', function($scope, $modalInstance, $interval){
    $scope.text = 'Waiting for your challenger';
    $scope.secs = 5;

    $scope.ready=false;

    $scope.ok = function(){
      $modalInstance.close();
    };

    $interval(function(){
      $scope.secs--;
      if ($scope.secs === 0){
        $scope.text = "Your challenger is online. Are you ready?";
        $scope.ready = true;
      }
    }, 1000, 5);
    // var id = setInterval(function() {
    //   $scope.secs--;
    //   console.log("ticking: " + $scope.secs);
    //   $scope.apply;
    //   if ($scope.secs === 0) {
    //     // take me to the next 
    //     $scope.ready=true;
    //     clearInterval(id);
    //   }
    // }, 1000);
  });