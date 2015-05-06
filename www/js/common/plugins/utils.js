(function(){
  'use strict';
  angular.module('app')
    .factory('PluginUtils', PluginUtils);

  function PluginUtils($window, $ionicPlatform, $q, $log){
    var service = {
      onReady: onReady
    };

    function onReady(name, testFn){
      return $ionicPlatform.ready().then(function(){
        if(!testFn()){
          $log.error('pluginNotFound:'+name);
          return $q.reject({message: 'pluginNotFound:'+name});
        }
      });
    }

    return service;
  }
})();
