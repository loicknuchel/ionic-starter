(function(){
  'use strict';
  angular.module('app', ['ionic', 'ngCordova', 'LocalForageModule'])
    .config(config)
    .constant('Config', Config)
    .run(run);

  function config($stateProvider, $urlRouterProvider, $provide, $httpProvider, AuthSrvProvider){
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
      .state('app.tabs', {
      url: '/tabs',
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'views/tabs.html',
          controller: 'TabsCtrl'
        }
      }
    })
      .state('app.tabs.twitts', {
      url: '/twitts',
      views: {
        'twitts-tab': {
          templateUrl: 'views/twitts.html',
          controller: 'TwittsCtrl'
        }
      }
    })
      .state('app.tabs.twitt', {
      url: '/twitt/:twittId',
      views: {
        'twitts-tab': {
          templateUrl: 'views/twitt.html',
          controller: 'TwittCtrl'
        }
      }
    })
      .state('app.tabs.chat', {
      url: '/chat',
      views: {
        'chat-tab': {
          templateUrl: 'views/chat.html',
          controller: 'ChatCtrl'
        }
      }
    })
      .state('app.tabs.notifs', {
      url: '/notifs',
      views: {
        'notifs-tab': {
          templateUrl: 'views/notifs.html',
          controller: 'NotifsCtrl'
        }
      }
    });

    if(AuthSrvProvider.isLogged()){
      $urlRouterProvider.otherwise('/app/tabs/twitts');
    } else {
      $urlRouterProvider.otherwise('/login');
    }

    // improve angular logger
    $provide.decorator('$log', ['$delegate', 'customLogger', function($delegate, customLogger){
      return customLogger($delegate);
    }]);

    // configure $http requests according to authentication
    $httpProvider.interceptors.push('AuthInterceptor');
  }

  function run($rootScope, $state, $log, AuthSrv, UserSrv, PushPlugin, ToastPlugin, Config){
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      var logged = AuthSrv.isLogged();
      if(toState.name === 'login' && logged){
        event.preventDefault();
        $log.log('IllegalAccess', 'Already logged in !');
        $state.go('app.tabs.twitts');
      } else if(toState.name !== 'login' && !logged){
        event.preventDefault();
        $log.log('IllegalAccess', 'Not allowed to access to <'+toState.name+'> state !');
        $state.go('login');
      }
    });

    // /!\ To use this, you should add Push plugin : ionic plugin add https://github.com/phonegap-build/PushPlugin
    // registrationId should be uploaded to the server, it is required to send push notification
    PushPlugin.register(Config.gcm.senderID).then(function(registrationId){
      return UserSrv.get().then(function(user){
        if(!user){ user = {}; }
        user.pushId = registrationId;
        return UserSrv.set(user);
      });
    });
    PushPlugin.onNotification(function(notification){
      ToastPlugin.show('Notification received: '+notification.payload.title);
      console.log('Notification received', notification);
    });
  }
})();
