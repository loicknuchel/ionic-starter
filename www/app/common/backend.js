(function(){
  'use strict';
  angular.module('app')
    .factory('Backend', Backend);

  function Backend($http, Storage, C){
    return {
      getTwitts: getTwitts
    };

    function getTwitts(){
      return $http.get(C.backendUrl+'/twitts.json').then(function(res){
        return Storage.setTwitts(res.data).then(function(){
          return res.data;
        });
      });
    }
  }
})();
