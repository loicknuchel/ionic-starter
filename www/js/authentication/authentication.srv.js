(function(){
  'use strict';
  angular.module('app')
    .factory('AuthSrv', AuthSrv)
    .factory('AuthInterceptor', AuthInterceptor);

  AuthSrv.$inject = ['$http', 'UserSrv', 'StorageUtils', 'Config'];
  function AuthSrv($http, UserSrv, StorageUtils, Config){
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
        var user = res.data;
        user.logged = true;
        return UserSrv.set(user).then(function(){
          return user;
        });
      });
    }

    function logout(){
      return $http.get(Config.backendUrl+'/logout').then(function(){
        return UserSrv.get().then(function(user){
          user.logged = false;
          return UserSrv.set(user);
        });
      });
    }

    function isLogged(){
      var user = StorageUtils.getSync(UserSrv.storageKey);
      return user && user.logged === true;
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
