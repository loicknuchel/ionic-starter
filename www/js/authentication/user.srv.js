(function(){
  'use strict';
  angular.module('app')
    .factory('UserSrv', UserSrv);

  UserSrv.$inject = ['LocalStorageUtils'];
  function UserSrv(LocalStorageUtils){
    var userKey = 'user';
    var service = {
      storageKey: userKey,
      get: getCurrentUser,
      set: setCurrentUser,
      delete: deleteCurrentUser
    };
    return service;

    function getCurrentUser(){
      return LocalStorageUtils.get(userKey);
    }

    function setCurrentUser(user){
      return LocalStorageUtils.set(userKey, user);
    }

    function deleteCurrentUser(){
      return LocalStorageUtils.clear(userKey);
    }
  }
})();
