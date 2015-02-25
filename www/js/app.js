angular.module('app', ['ionic', 'ngCordova', 'LocalForageModule'])

.config(function($stateProvider, $urlRouterProvider, $provide) {
  'use strict';
  // ParseUtilsProvider.initialize(Config.parse.applicationId, Config.parse.restApiKey);

  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'views/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.twitts', {
    url: '/twitts',
    views: {
      'menuContent' :{
        templateUrl: 'views/twitts.html',
        controller: 'TwittsCtrl'
      }
    }
  })
  .state('app.twitt', {
    url: '/twitt/:twittId',
    views: {
      'menuContent' :{
        templateUrl: 'views/twitt.html',
        controller: 'TwittCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/twitts');

  // improve angular logger
  $provide.decorator('$log', ['$delegate', 'customLogger', function($delegate, customLogger){
    return customLogger($delegate);
  }]);
})

.constant('Config', Config)

.run(function() {
  'use strict';
});

