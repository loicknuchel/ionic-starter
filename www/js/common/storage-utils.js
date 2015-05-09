(function(){
  'use strict';
  angular.module('app')
  //.factory('StorageUtils', LocalForageUtils)
    .provider('StorageUtils', LocalStorageProvider) // this is a proxy to use it every when in the app (and easily change...)
    .factory('LocalForageUtils', LocalForageUtils)
    .provider('LocalStorageUtils', LocalStorageProvider);

  // Storage helper using localForage (asynchronous best avaiable browser storage) and cache
  function LocalForageUtils($localForage, $q, $log, Utils, Config){
    var storageCache = {};
    var promiseStorageCache = {};
    var service = {
      get: _get,
      set: _set,
      remove: _remove,
      clear: _clear,
      clearStartingWith: _clearStartingWith,
      getSync: _getSync
    };

    function _get(key, _defaultValue){
      if(storageCache[key]){
        return Utils.async(function(){ return angular.copy(storageCache[key]); });
      } else if(promiseStorageCache[key]){
        return promiseStorageCache[key];
      } else {
        if(Config.storage){
          promiseStorageCache[key] = $localForage.getItem(Config.storagePrefix+key).then(function(value){
            try {
              storageCache[key] = JSON.parse(value) || angular.copy(_defaultValue);
            } catch(e) {
              storageCache[key] = angular.copy(_defaultValue);
            }
            delete promiseStorageCache[key];
            return angular.copy(storageCache[key]);
          }, function(error){
            $log.error('error in LocalForageUtils._get('+key+')', error);
            delete promiseStorageCache[key];
          });
          return promiseStorageCache[key];
        } else {
          storageCache[key] = angular.copy(_defaultValue);
          return Utils.async(function(){ return angular.copy(storageCache[key]); });
        }
      }
    }

    function _getSync(key, _defaultValue){
      if(storageCache[key]){
        return angular.copy(storageCache[key]);
      } else {
        _get(key, _defaultValue);
        return angular.copy(_defaultValue);
      }
    }

    function _set(key, value){
      if(!angular.equals(storageCache[key], value)){
        storageCache[key] = angular.copy(value);
        if(Config.storage){
          return $localForage.setItem(Config.storagePrefix+key, JSON.stringify(storageCache[key])).then(function(value){
            // return nothing !
          }, function(error){
            $log.error('error in LocalForageUtils._set('+key+')', error);
          });
        } else {
          return $q.when();
        }
      } else {
        $log.debug('Don\'t save <'+key+'> because values are equals !', value);
        return $q.when();
      }
    }

    function _remove(key){
      $log.debug('Remove <'+key+'> from storage !');
      delete storageCache[key];
      if(Config.storage){
        return $localForage.removeItem(Config.storagePrefix+key);
      } else {
        return $q.when();
      }
    }

    function _clear(){
      storageCache = {};
      if(Config.storage){
        return $localForage.clear();
      } else {
        return $q.when();
      }
    }

    function _clearStartingWith(keyStartWith){
      for(var i in storageCache){
        if(Utils.startsWith(i, keyStartWith)){
          delete storageCache[i];
        }
      }
      if(Config.storage){
        return $localForage.keys().then(function(keys){
          var promises = [];
          for(var i in keys){
            if(Utils.startsWith(keys[i], Config.storagePrefix+keyStartWith)){
              promises.push($localForage.removeItem(keys[i]));
            }
          }
          return $q.all(promises).then(function(results){
            // nothing
          });
        });
      } else {
        return $q.when();
      }
    }

    return service;
  }

  // LocalStorage helper with caching system & asynchronous calls
  function LocalStorageProvider(Config){
    var storageCache = {};
    this.getSync = _get;
    this.$get = LocalStorageUtils;

    function _get(key, _defaultValue){
      if(!storageCache[key]){
        if(Config.storage && window.localStorage){
          try {
            storageCache[key] = JSON.parse(window.localStorage.getItem(Config.storagePrefix+key)) || angular.copy(_defaultValue);
          } catch(e) {
            storageCache[key] = angular.copy(_defaultValue);
          }
        } else {
          storageCache[key] = angular.copy(_defaultValue);
        }
      }
      return angular.copy(storageCache[key]);
    }

    LocalStorageUtils.$inject = ['$window', '$log', 'Utils'];
    function LocalStorageUtils($window, $log, Utils){
      var service = {
        get:                function(key, _defaultValue)  { return Utils.async(function(){return _get(key, _defaultValue);});         },
        set:                function(key, value)          { return Utils.async(function(){return _set(key, value);});                 },
        remove:             function(key)                 { return Utils.async(function(){return _remove(key);});                     },
        clear:              function()                    { return Utils.async(function(){return _clear();});                         },
        clearStartingWith:  function(keyStartWith)        { return Utils.async(function(){return _clearStartingWith(keyStartWith);}); },
        getSync: _get,
        setSync: _set,
        removeSync: _remove,
        clearSync: _clear,
        clearStartingWithSync: _clearStartingWith
      };

      function _set(key, value){
        if(!angular.equals(storageCache[key], value)){
          storageCache[key] = angular.copy(value);
          if(Config.storage && $window.localStorage){
            $window.localStorage.setItem(Config.storagePrefix+key, JSON.stringify(storageCache[key]));
          }
        } else {
          $log.debug('Don\'t save <'+key+'> because values are equals !');
        }
      }

      function _remove(key){
        $log.debug('Remove <'+key+'> from storage !');
        delete storageCache[key];
        if(Config.storage && $window.localStorage){
          $window.localStorage.removeItem(Config.storagePrefix+key);
        }
      }

      function _clear(){
        storageCache = {};
        if(Config.storage && $window.localStorage){
          $window.localStorage.clear();
        }
      }

      function _clearStartingWith(keyStartWith){
        for(var i in storageCache){
          if(Utils.startsWith(i, keyStartWith)){
            delete storageCache[i];
          }
        }
        if(Config.storage && $window.localStorage){
          for(var j=$window.localStorage.length-1; j >= 0; j--){
            var key = $window.localStorage.key(j);
            if(Utils.startsWith(key, Config.storagePrefix+keyStartWith)){
              $window.localStorage.removeItem(key);
            }
          }
        }
      }

      return service;
    }
  }
})();
