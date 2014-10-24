angular.module('app')
  .controller('roomCtrl', function($scope, $log, socket) {

     //here are our variables for start theme and prompt
     var theme = "twilight"; 
     var editor = ace.edit("editor");
     $scope.prompt = '//Your prompt will appear when your opponent joins the room \n //Ask a friend to join this room to duel';
    
    //this adds the editor to the view with default settings
     editor.setTheme("ace/theme/"+ theme);
     editor.getSession().setMode("ace/mode/javascript");
     editor.setValue($scope.prompt);
 
     socket.on('joinedRoom', function(room){
       console.log(room + ' has been joined, BABIES');
       $scope.roomname = room;
     });
 
     socket.on('displayPrompt', function(prompt){
       $scope.prompt = prompt;
       editor.setValue(prompt);
     });

    socket.on('destroyPrompt', function(){
       $scope.prompt = '//Your prompt will appear momentarily';
       editor.setValue($scope.prompt);
     });

    socket.on('sendScore', function(codeScore){
      console.log(codeScore, "CODE SCORE");
      var codeResult = codeScore.result;
      $scope.score = codeScore.score;
      editor.setValue('// Your code resulted in: ' + codeResult + ' ||  Your score is: ' + $scope.score);
     });

    socket.on('isWinner', function(isWinner){
      console.log("is Winner??", isWinner);
      setTimeout(function(){
        if(isWinner){
          editor.setValue('YOU HAVE WON! Your score is ' + $scope.score);
        } else {
          editor.setValue('YOU HAVE LOST! Your score is ' + $scope.score);
        }
      }, 1000);
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