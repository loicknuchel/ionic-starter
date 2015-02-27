angular.module('app')

// This is a dummy service to use in demo...
.factory('TwittSrv', function($q, $timeout, Utils){
  'use strict';
  var twitts = [
    {id: Utils.createUuid(), user: 'Venkman', avatar: 'http://ionicframework.com/img/docs/venkman.jpg', content: 'Back off, man. I\'m a scientist.'},
    {id: Utils.createUuid(), user: 'Egon', avatar: 'http://ionicframework.com/img/docs/spengler.jpg', content: 'We\'re gonna go full stream.'},
    {id: Utils.createUuid(), user: 'Ray', avatar: 'http://ionicframework.com/img/docs/stantz.jpg', content: 'Ugly little spud, isn\'t he?'},
    {id: Utils.createUuid(), user: 'Winston', avatar: 'http://ionicframework.com/img/docs/winston.jpg', content: 'That\'s a big Twinkie.'},
    {id: Utils.createUuid(), user: 'Tully', avatar: 'http://ionicframework.com/img/docs/tully.jpg', content: 'Okay, who brought the dog?'},
    {id: Utils.createUuid(), user: 'Dana', avatar: 'http://ionicframework.com/img/docs/barrett.jpg', content: 'I am The Gatekeeper!'},
    {id: Utils.createUuid(), user: 'Slimer', avatar: 'http://ionicframework.com/img/docs/slimer.jpg', content: 'Boo!'},
    {id: Utils.createUuid(), user: 'Loïc', avatar: 'https://pbs.twimg.com/profile_images/3133057797/81ea4e63c7078eec0a7c7d6ae57a3ce1.jpeg', content: 'Really nice, isn\'t it ?'}
  ];

  var service = {
    getAll: function(addOne){
      return asyncTmp(function(){
        if(addOne){
          twitts.unshift(createRandomTwitt());
        }
        return twitts;
      });
    },
    get: function(id){
      return asyncTmp(function(){
        return _.find(twitts, {id: id});
      });
    },
    save: function(twitt){
      return asyncTmp(function(){
        var newTwitt = {};
        newTwitt.id = Utils.createUuid();
        newTwitt.user = twitt.user;
        newTwitt.avatar = 'http://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png';
        newTwitt.content = twitt.content;
        twitts.unshift(newTwitt);
      });
    }
  };

  function createRandomTwitt(){
    var newTwitt = angular.copy(twitts[Math.floor(Math.random() * twitts.length)]);
    newTwitt.id = Utils.createUuid();
    return newTwitt;
  }

  function asyncTmp(fn){
    var defer = $q.defer();
    $timeout(function(){
      defer.resolve(fn());
    }, 1000);
    return defer.promise;
  }

  return service;
})

.provider('UserSrv', function(){
  'use strict';
  var userKey = 'user';
  this.storageKey = userKey;

  this.$get = ['LocalStorageUtils', function(LocalStorageUtils){
    var service = {
      storageKey: userKey,
      get: getCurrentUser,
      set: setCurrentUser,
      delete: deleteCurrentUser
    };

    function getCurrentUser(){
      return LocalStorageUtils.get(userKey);
    }

    function setCurrentUser(user){
      return LocalStorageUtils.set(userKey, user);
    }

    function deleteCurrentUser(){
      return LocalStorageUtils.clear(userKey);
    }

    return service;
  }];
})

.provider('AuthSrv', function(UserSrvProvider, LocalStorageUtilsProvider){
  'use strict';
  function isLogged(){
    return LocalStorageUtilsProvider.getSync(UserSrvProvider.storageKey) !== undefined;
  };

  this.isLogged = isLogged;

  this.$get = ['$http', '$q', 'UserSrv', 'LocalStorageUtils', 'Config', function($http, $q, UserSrv, LocalStorageUtils, Config){
    var service = {
      login: login,
      logout: logout,
      isLogged: isLogged
    };

    function login(credentials){
      // return $http.post(Config.backendUrl+'/login', {
      return $q.when({
        login: credentials.login,
        password: credentials.password
      }).then(function(user){
        return UserSrv.set(user).then(function(){
          return user;
        });
      });
    }

    function logout(){
      // return $http.post(Config.backendUrl+'/logout').then(function(){
      return $q.when().then(function(){
        return UserSrv.delete();
      });
    }

    return service;
  }];
})

.factory('AuthInterceptor', function($q, $location, $log){
  'use strict';
  var service = {
    request: onRequest,
    response: onResponse,
    responseError: onResponseError
  };

  function onRequest(config){
    // add headers here if you want...
    return config;
  }

  function onResponse(response){
    return response;
  }

  function onResponseError(response){
    $log.warn('request error', response);
    if(response.status === 401 || response.status === 403) {
      // user is not authenticated
      $location.path('/login');
    }
    return $q.reject(response);
  }

  return service;
});
