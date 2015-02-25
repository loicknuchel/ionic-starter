angular.module('app', ['ionic', 'ngCordova', 'LocalForageModule'])

.config(function($stateProvider, $urlRouterProvider, $provide) {
  'use strict';
  // catch exceptions in angular
  $provide.decorator('$exceptionHandler', ['$delegate', function($delegate){
    return function(exception, cause){
      $delegate(exception, cause);

      var data = {
        type: 'angular'
      };
      if(cause)               { data.cause    = cause;              }
      if(exception){
        if(exception.message) { data.message  = exception.message;  }
        if(exception.name)    { data.name     = exception.name;     }
        if(exception.stack)   { data.stack    = exception.stack;    }
      }

      Logger.track('exception', data);
    };
  }]);
  
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
})

.constant('Config', Config)

.run(function() {
  'use strict';
});

