(function(){
  'use strict';
  angular.module('app', ['ionic', 'ngCordova', 'LocalForageModule'])
    .config(configure)
    .constant('Config', Config)
    .run(runBlock);

  function configure($urlRouterProvider, $provide, $httpProvider, AuthSrvProvider){
    // ParseUtilsProvider.initialize(Config.parse.applicationId, Config.parse.restApiKey);

    // TODO : add loading state which redirect on required view
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

  function runBlock($rootScope, $state, $log, AuthSrv, UserSrv, PushPlugin, ToastPlugin, Config){
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
