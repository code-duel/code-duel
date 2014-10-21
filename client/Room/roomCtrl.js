angular.module('app.room', [])
  .controller('roomCtrl', function($scope, $modal, $log, roomService, userService) {
    $scope.roomname = userService.user.roomname;
    $scope.username = userService.user.username;
    console.log('room controller loads');

    $scope.ready = false;
    $scope.data = roomService;

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

    //editor init variables
    var theme = "twilight"; 
    var prompt = "\n//the prompt goes here"
    var editor = ace.edit("editor");

   
   //this adds the editor to the view with default settings
    editor.setTheme("ace/theme/"+ theme);
    editor.getSession().setMode("ace/mode/javascript");
    editor.setValue(prompt);
   
     $scope.submit = roomService.submit;
     $scope.stopTimer = roomService.stopTimer;
     $scope.startTimer = roomService.startTimer;
    
     $scope.reset = function(){
      roomService.reset(prompt)
     }
     
    
  });