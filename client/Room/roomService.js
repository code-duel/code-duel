angular.module('app.services', [])
.factory('roomService', function($timeout){
  var data = {
    editor: ace.edit("editor"),
	  timer: null,
	  clock: 0
  };

	var submit =  function() {
      var testThisCode = data.editor.getValue();
      console.log("this needs to be evaluated!: ", testThisCode);
  };
    
  var reset = function(prompt) {
    console.log('reset');
    data.editor.setValue(prompt);
  };

  var startTimer = function() {
    timer = $timeout(function(){
        data.clock++;
        startTimer();
    }, 100);
  };

  var stopTimer = function() {
  	$timeout.cancel(data.timer);
  	data.timer = null;
  }

	return {
		submit: submit,
		reset: reset,
		startTimer: startTimer,
		stopTimer: stopTimer,
		data: data
	}
})