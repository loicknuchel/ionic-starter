(function(){
  'use strict';
  angular.module('app')
    .config(configure);

  function configure($stateProvider){
    $stateProvider
      .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'js/layout/menu.html',
      controller: 'MenuCtrl'
    })
      .state('app.tabs', {
      url: '/tabs',
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'js/layout/tabs.html',
          controller: 'TabsCtrl'
        }
      }
    });
  }
})();
