angular.module('app', [
  'app.room',
  'app.services',
  'ngRoute',
  'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'Login/loginView.html',
        controller: 'loginCtrl'
      })
      .when('/room', {
        templateUrl: 'Room/roomView.html',
        controller: 'roomCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }); 