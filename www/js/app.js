(function(){
  'use strict';
  angular.module('app', ['ionic', 'ngCordova', 'LocalForageModule'])
    .config(configure)
    .run(runBlock);

  configure.$inject = ['$urlRouterProvider', '$provide', '$httpProvider'];
  function configure($urlRouterProvider, $provide, $httpProvider){
    // ParseUtilsProvider.initialize(Config.parse.applicationId, Config.parse.restApiKey);

    $urlRouterProvider.otherwise('/loading');

    // improve angular logger
    $provide.decorator('$log', ['$delegate', 'customLogger', function($delegate, customLogger){
      return customLogger($delegate);
    }]);

    // configure $http requests according to authentication
    $httpProvider.interceptors.push('AuthInterceptor');
  }

  function runBlock($rootScope, $state, $log, AuthSrv, UserSrv, PushPlugin, ToastPlugin, Config){
    checkRouteRights();
    setupPushNotifications();

    ////////////////

    function checkRouteRights(){
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if(toState && toState.data && Array.isArray(toState.data.restrictAccess)){
          var restricted = toState.data.restrictAccess;
          var logged = AuthSrv.isLogged();
          if(logged && restricted.indexOf('notLogged') > -1){
            event.preventDefault();
            $log.log('IllegalAccess', 'State <'+toState.name+'> is restricted to non logged users !');
            $state.go('loading');
          } else if(!logged && restricted.indexOf('logged') > -1){
            event.preventDefault();
            $log.log('IllegalAccess', 'State <'+toState.name+'> is restricted to logged users !');
            $state.go('loading');
          }
        }
      });
    }

    function setupPushNotifications(){
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
  }
})();
