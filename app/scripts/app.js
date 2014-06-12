angular.module('IonicBoilerplate', ['ngSanitize', 'ngAnimate', 'ngTouch', 'ngCordova', 'ionic', 'ionic.contrib.ui.cards'])

.run(function($ionicPlatform) {
  'use strict';
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  'use strict';
  $urlRouterProvider.otherwise('/app/home');
  
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'views/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent' :{
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.actionsheet', {
    url: '/actionsheet',
    views: {
      'menuContent' :{
        templateUrl: 'views/actionsheet.html',
        controller: 'ActionsheetCtrl'
      }
    }
  })
  .state('app.swipeablecards', {
    url: '/swipeablecards',
    views: {
      'menuContent' :{
        templateUrl: 'views/swipeablecards.html',
        controller: 'SwipeablecardsCtrl'
      }
    }
  })
  .state('app.chat', {
    url: '/chat',
    views: {
      'menuContent' :{
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl'
      }
    }
  });
});

