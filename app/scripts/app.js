angular.module('app', ['ionic', 'ngCordova', 'LocalForageModule'])

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
  .state('app.slidebox', {
    url: '/slidebox',
    views: {
      'menuContent' :{
        templateUrl: 'views/slidebox.html',
        controller: 'SlideboxCtrl'
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
})

.constant('Config', Config)

.run(function() {
  'use strict';
});

