(function(){
  'use strict';
  angular.module('app')
    .provider('UserSrv', UserProvider);

  function UserProvider(){
    var userKey = 'user';
    this.storageKey = userKey;
    this.$get = UserSrv;

    UserSrv.$inject = ['LocalStorageUtils'];
    function UserSrv(LocalStorageUtils){
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
  }
})();
