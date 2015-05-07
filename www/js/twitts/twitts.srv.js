(function(){
  'use strict';
  angular.module('app')
    .factory('TwittSrv', TwittSrv);

  // This is a dummy service to use in demo...
  TwittSrv.$inject = ['$http', '$q', '$timeout', 'Utils', 'Config', '_'];
  function TwittSrv($http, $q, $timeout, Utils, Config, _){
    var cachedTwitts = undefined;
    var service = {
      getAll: getAll,
      get: get,
      save: save
    };
    return service;

    function getAll(){
      if(cachedTwitts){
        cachedTwitts.unshift(createRandomTwitt());
        return $q.when(angular.copy(cachedTwitts));
      } else {
        return $http.get(Config.backendUrl+'/twitts.json').then(function(res){
          cachedTwitts = res.data;
          return angular.copy(cachedTwitts);
        });
      }
    }

    function get(id){
      return getAll().then(function(twitts){
        return _.find(twitts, {id: id});
      });
    }

    function save(twitt){
      return asyncTmp(function(){
        var newTwitt = {};
        newTwitt.id = Utils.createUuid();
        newTwitt.user = twitt.user;
        newTwitt.avatar = 'http://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png';
        newTwitt.content = twitt.content;
        cachedTwitts.unshift(newTwitt);
        return angular.copy(newTwitt);
      });
    }

    function createRandomTwitt(){
      var newTwitt = angular.copy(cachedTwitts[Math.floor(Math.random() * cachedTwitts.length)]);
      newTwitt.id = Utils.createUuid();
      return newTwitt;
    }

    function asyncTmp(fn){
      var defer = $q.defer();
      $timeout(function(){
        defer.resolve(fn());
      }, 500);
      return defer.promise;
    }
  }
})();
