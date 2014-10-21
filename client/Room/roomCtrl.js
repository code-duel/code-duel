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

    //here are our variables for start theme and prompt
    var theme = "twilight"; 
    var prompt = "//the prompt goes here"
    var editor = ace.edit("editor");

   
   //this adds the editor to the view with default settings
    editor.setTheme("ace/theme/"+ theme);
    editor.getSession().setMode("ace/mode/javascript");
    editor.setValue(prompt);
   
   //this is where we will need to test the code
   $scope.submit = function() {
    var testThisCode = editor.getValue();
    console.log("this needs to be evaluated!: ", testThisCode);
   }

   //this resets the editor to the original prompt
   $scope.reset = function() {
    console.log('reset');
    editor.setValue(prompt);
   }

  });