angular.module('app')
  .controller('roomCtrl', function($scope, $modal, $log, socket) {

     //here are our variables for start theme and prompt
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
       editor.setValue('//' + prompt);
     });
    
    //this is where we will need to test the code
    $scope.submit = function() {
     var userCode = editor.getValue();
     console.log('CODE-DUEL: Sending code to be evaluated.');
     socket.emit('sendCode', userCode);
    };
 
    //this resets the editor to the original prompt
    $scope.reset = function() {
     console.log('reset');
     console.log('//' + $scope.prompt);
     editor.setValue($scope.prompt);
    };

  });