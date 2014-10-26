angular.module('app')
  .controller('roomCtrl', function($scope, $log, $timeout, socket) {
     
     //timer init variables
     $scope.clock = {
       time: 0,
       min: 0,
       sec: 0,
       timer: null,
       notcalled: true
     };

     $scope.noOpponent = true;
     $scope.finishBeforeOpponent = false;
     $scope.victory=false;
     $scope.defeat=false;

     //here are our variables for start theme and prompt
     var theme = "twilight"; 
     var editor = ace.edit("editor");
     $scope.prompt = '//Your prompt will appear when your opponent joins the room \n //Ask a friend to join this room to duel';
    
    //this adds the editor to the view with default settings
     editor.setTheme("ace/theme/"+ theme);
     editor.getSession().setMode("ace/mode/javascript");
     editor.setValue($scope.prompt);
 
   
     socket.on('joinedRoom', function(roominfo){
       console.log(roominfo.name + ' has been joined, BABIES');
       $scope.roomname = roominfo.name;
       console.log(roominfo.player, "==============")
       $scope.playername = roominfo.player;
       $scope.playerId = roominfo.id;
     });
 
     socket.on('displayPrompt', function(problem){
       console.log('received prompt: ' + JSON.stringify(problem));
       $scope.prompt = problem.prompt;
       $scope.problemName = problem.problemName;
       $scope.noOpponent=false;
       editor.setValue($scope.prompt);
       
       //add opponents to room
       $scope.allPlayers = problem.opponents
       //.splice(problem.opponents.indexOf($scope.playername),1)

       //delay clock 1 second to help sync up clocks
       if($scope.clock.notcalled){
         setTimeout(function(){
           $scope.startTimer();
         }, 1000);
         //only call timer 1x
         $scope.clock.notcalled = false;
       }
     });

    socket.on('destroyPrompt', function(){
       $scope.prompt = '//Your prompt will appear momentarily';
       //2($scope.prompt);
       $scope.stopTimer();
      
     });

    socket.on('sendScore', function(codeScore){
      console.log(codeScore, "CODE SCORE");
      //var codeResult = codeScore.result;
      $scope.score = codeScore;
      $scope.finishBeforeOpponent=true;
      // editor.setValue('// Your score is: ' + $scope.score + '\n // Now waiting for your opponent to finish');
      //editor.setValue('// Your code resulted in: ' + codeResult + ' ||  Your score is: ' + $scope.score);
     });

    socket.on('isWinner', function(isWinner){
      console.log("is Winner??", JSON.stringify(isWinner.isWinner));
      setTimeout(function(){
        if(isWinner.isWinner){
          $scope.opponentScore = isWinner.opponentScore;
          $scope.finishBeforeOpponent=false;
          $scope.victory = true;
          // editor.setValue('// YOU HAVE WON! Your score is ' + $scope.score + '\n// Your oppenents score was ' + isWinner.opponentScore);
        } else {
          $scope.opponentScore = isWinner.opponentScore;
          $scope.finishBeforeOpponent=false;
          $scope.defeat = true;
          // editor.setValue('// YOU HAVE LOST! Your score is ' + $scope.score + '\n// Your oppenents score was ' + isWinner.opponentScore);
        }
      }, 1000);
     });
 
    
    //this is where we will need to test the code
    $scope.submit = function() {
      
      var userCode = editor.getValue();
      console.log('CODE-DUEL: Sending code to be evaluated.');

      socket.emit('sendCode', 
        {
        code: userCode, 
        problemName: $scope.problemName,
        timeTaken: $scope.clock.time,
        player: $scope.playername,
        roomname: $scope.roomname,
        id: $scope.playerId,
        players: $scope.allPlayers
      });
      $scope.stopTimer();
    };
 
    //this resets the editor to the original prompt
    $scope.reset = function() {
      console.log('reset');
      console.log($scope.prompt);
       editor.setValue($scope.prompt);
    };
    
    $scope.startTimer = function() {
      $scope.clock.timer = $timeout(function(){
        $scope.clock.time++;
        $scope.clock.sec++;
        if ($scope.clock.sec === 60) {
          $scope.clock.min++;
          $scope.clock.sec = 0;
        }
        $scope.startTimer();
      }, 1000);
    };

    $scope.stopTimer = function() {
      $timeout.cancel($scope.clock.timer);
      $scope.clock.timer = null;
      $scope.clock.time = 0;
      $scope.clock.notcalled = true;
    };

  });