(function(){
  'use strict';
  angular.module('app')
    .factory('ParsePlugin', ParsePlugin);

  // for Parse plugin : https://github.com/umurgdk/phonegap-parse-plugin
  function ParsePlugin($window, $q, $log, PluginUtils){
    var pluginName = 'Parse';
    var pluginTest = function(){ return $window.parsePlugin; };
    var service = {
      initialize:               function(appId, clientKey)  { return _exec($window.parsePlugin.initialize, appId, clientKey); },
      getInstallationId:        function()                  { return _exec($window.parsePlugin.getInstallationId);            },
      getInstallationObjectId:  function()                  { return _exec($window.parsePlugin.getInstallationObjectId);      },
      subscribe:                function(channel)           { return _exec($window.parsePlugin.subscribe, channel);           },
      unsubscribe:              function(channel)           { return _exec($window.parsePlugin.unsubscribe, channel);         },
      getSubscriptions:         function()                  { return _exec($window.parsePlugin.getSubscriptions);             },
      onMessage:                function()                  { return _exec($window.parsePlugin.onMessage);                    }
    };

    function _exec(fn){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();

        var fnArgs = [];
        // take all arguments except the first one
        for(var i=1; i<arguments.length; i++){
          fnArgs.push(arguments[i]);
        }
        fnArgs.push(function(res){ defer.resolve(res); });
        fnArgs.push(function(error){
          $log.error('pluginError:'+pluginName, error);
          defer.reject(error);
        });

        fn.apply(null, fnArgs);
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
      if(!window.parsePlugin){
        window.parsePlugin = (function(){
          var subscriptions = [];
          return {
            initialize: function(appId, clientKey, successCallback, errorCallback){ if(successCallback){successCallback();} },
            getInstallationId: function(successCallback, errorCallback){ if(successCallback){successCallback('7ff61742-ab67-42aa-bf48-d821afb44022');} },
            getInstallationObjectId: function(successCallback, errorCallback){ if(successCallback){successCallback('ED4j8uPOth');} },
            subscribe: function(channel, successCallback, errorCallback){ subscriptions.push(channel); if(successCallback){successCallback();} },
            unsubscribe: function(channel, successCallback, errorCallback){ subscriptions.splice(subscriptions.indexOf(channel), 1); if(successCallback){successCallback();} },
            getSubscriptions: function(successCallback, errorCallback){ if(successCallback){successCallback(subscriptions);} },
            onMessage: function(successCallback, errorCallback){}
          };
        })();
      }
    }
  });
})();
