(function(){
  'use strict';
  angular.module('app')
    .provider('AuthSrv', AuthProvider)
    .factory('AuthInterceptor', AuthInterceptor);

  AuthProvider.$inject = ['UserSrvProvider', 'LocalStorageUtilsProvider'];
  function AuthProvider(UserSrvProvider, LocalStorageUtilsProvider){
    this.isLogged = isLogged;
    this.$get = AuthSrv;

    function isLogged(){
      return LocalStorageUtilsProvider.getSync(UserSrvProvider.storageKey) !== undefined;
    }

    AuthSrv.$inject = ['$http', 'UserSrv', 'LocalStorageUtils', 'Config'];
    function AuthSrv($http, UserSrv, LocalStorageUtils, Config){
      var service = {
        login: login,
        logout: logout,
        isLogged: isLogged
      };
      return service;

      function login(credentials){
        return $http.get(Config.backendUrl+'/login', {
          login: credentials.login,
          password: credentials.password
        }).then(function(res){
          return UserSrv.set(res.data).then(function(){
            return res.data;
          });
        });
      }

      function logout(){
        return $http.get(Config.backendUrl+'/logout').then(function(){
          return UserSrv.delete();
        });
      }
    }
  }

  AuthInterceptor.$inject = ['$q', '$location', '$log'];
  function AuthInterceptor($q, $location, $log){
    var service = {
      request: onRequest,
      response: onResponse,
      responseError: onResponseError
    };
    return service;

    function onRequest(config){
      // add headers here if you want...
      return config;
    }

    function onResponse(response){
      return response;
    }

    function onResponseError(response){
      $log.warn('request error', response);
      if(response.status === 401 || response.status === 403){
        // user is not authenticated
        $location.path('/login');
      }
      return $q.reject(response);
    }
  }
})();
