angular.module('app')
  .factory('userService', function($http){
    var user = {};

    return {
  
      user: user
      // doLogin: function(){
      //   return $http({
      //     method: 'GET',
      //     url: 'https://api.github.com/zen'
      //   });

      // }
    };
  });