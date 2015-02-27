angular.module('app', ['ionic', 'ngCordova', 'LocalForageModule'])

.config(function($stateProvider, $urlRouterProvider, $provide, $httpProvider, AuthSrvProvider) {
  'use strict';
  // ParseUtilsProvider.initialize(Config.parse.applicationId, Config.parse.restApiKey);

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  })
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

  if(AuthSrvProvider.isLogged()){
    $urlRouterProvider.otherwise('/app/twitts');
  } else {
    $urlRouterProvider.otherwise('/login');
  }

  // improve angular logger
  $provide.decorator('$log', ['$delegate', 'customLogger', function($delegate, customLogger){
    return customLogger($delegate);
  }]);

  // configure $http requests according to authentication
  $httpProvider.interceptors.push('AuthInterceptor');
})

.constant('Config', Config)

.run(function($rootScope, $state, $log, AuthSrv, UserSrv, PushPlugin, ToastPlugin, Config){
  'use strict';
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    var logged = AuthSrv.isLogged();
    if(toState.name === 'login' && logged){
      event.preventDefault();
      $log.log('IllegalAccess', 'Already logged in !');
      $state.go('app.twitts');
    } else if(toState.name !== 'login' && !logged){
      event.preventDefault();
      $log.log('IllegalAccess', 'Not allowed to access to <'+toState.name+'> state !');
      $state.go('login');
    }
  });

  // registrationId should be uploaded to the server, it is required to send push notification
  PushPlugin.register(Config.gcm.senderID).then(function(registrationId){
    return UserSrv.get().then(function(user){
      user.pushId = registrationId;
      return UserSrv.set(user);
    });
  });
  PushPlugin.onNotification(function(notification){
    ToastPlugin.show('notificationReceived: '+notification.title);
    console.log('notificationReceived', notification);
  });
});

