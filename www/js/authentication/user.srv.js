(function(){
  'use strict';
  angular.module('app')
    .factory('UserSrv', UserSrv);

  UserSrv.$inject = ['StorageUtils'];
  function UserSrv(StorageUtils){
    var userKey = 'user';
    var service = {
      storageKey: userKey,
      get: getCurrentUser,
      set: setCurrentUser,
      delete: deleteCurrentUser
    };
    return service;

    function getCurrentUser(){
      return StorageUtils.get(userKey);
    }

    function setCurrentUser(user){
      return StorageUtils.set(userKey, user);
    }

    function deleteCurrentUser(){
      return StorageUtils.clear(userKey);
    }
  }
})();
