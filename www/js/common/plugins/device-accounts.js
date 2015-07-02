(function(){
  'use strict';
  angular.module('app')
    .factory('DeviceAccountsPlugin', DeviceAccountsPlugin);

  // for DeviceAccounts plugin : https://github.com/loicknuchel/cordova-device-accounts
  function DeviceAccountsPlugin($window, $q, $log, PluginUtils){
    var pluginName = 'DeviceAccounts';
    var pluginTest = function(){ return $window.plugins && $window.plugins.DeviceAccounts; };
    var service = {
      getAccounts: getAccounts,
      getEmail: getEmail
    };

    function getAccounts(){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        $window.plugins.DeviceAccounts.get(function(accounts){
          defer.resolve(accounts);
        }, function(error){
          $log.error('pluginError:'+pluginName, error);
          defer.reject(error);
        });
        return defer.promise;
      });
    }

    function getEmail(){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        $window.plugins.DeviceAccounts.getEmail(function(email){
          defer.resolve(email);
        }, function(error){
          $log.error('pluginError:'+pluginName, error);
          defer.reject(error);
        });
        return defer.promise;
      });
    }

    return service;
  }


  /**************************
   *                        *
   *      Browser Mock      *
   *                        *
   **************************/
  ionic.Platform.ready(function(){
    if(!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())){
      if(!window.plugins){window.plugins = {};}
      if(!window.plugins.DeviceAccounts){
        window.plugins.DeviceAccounts = {
          get: function(onSuccess, onFail){ onSuccess([{type:'com.google', name:'test@example.com'}]); },
          getByType: function(type, onSuccess, onFail){ onSuccess([{type:'com.google', name:'test@example.com'}]); },
          getEmails: function(onSuccess, onFail){ onSuccess(['test@example.com']); },
          getEmail: function(onSuccess, onFail){ onSuccess('test@example.com'); }
        };
      }
    }
  });
})();
