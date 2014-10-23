angular.module('app.room', [])
  .controller('roomCtrl', function($scope, $modal, $log, roomService, userService) {

    $scope.roomname = userService.user.roomname;
    $scope.username = userService.user.username;

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


   // $scope.open();

    //editor init variables
    var theme = "twilight"; 
    var editor = ace.edit("editor");
    $scope.prompt = '//Your prompt will appear momentarily';
   
   //this adds the editor to the view with default settings
    editor.setTheme("ace/theme/"+ theme);
    editor.getSession().setMode("ace/mode/javascript");
    editor.setValue($scope.prompt);

    socket.on('joinedRoom', function(room){
      console.log(room + ' has been joined, BABIES');
    });

    socket.on('displayPrompt', function(prompt){
      $scope.prompt = prompt;
      console.log('prompt recieved');
      console.log($scope.prompt);
      editor.setValue('//' + prompt);
    });
   

   //this is where we will need to test the code
   $scope.submit = function() {
    var testThisCode = editor.getValue();
    console.log("this needs to be evaluated!: ", testThisCode);
   };

   //this resets the editor to the original prompt
   $scope.reset = function() {
    console.log('reset');
    console.log('//' + $scope.prompt);
    editor.setValue($scope.prompt);
   };

  });