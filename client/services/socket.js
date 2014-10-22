angular.module('app')
  .factory('socket', function($rootScope){
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
          console.log('i am the listner, everyone shut up a bit and let me do my job');
          socket.on(eventName, function () {  
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
          console.log('i am the emmitor, everybody stand back');
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          });
        }
      };
  });