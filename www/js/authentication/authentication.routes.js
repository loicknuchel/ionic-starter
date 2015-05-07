(function(){
  'use strict';
  angular.module('app')
    .config(configure);

  function configure($stateProvider){
    $stateProvider
      .state('login', {
      url: '/login',
      templateUrl: 'js/authentication/login.html',
      controller: 'LoginCtrl',
      data: {
        restrictAccess: ['notLogged']
      }
    });
  }
})();
