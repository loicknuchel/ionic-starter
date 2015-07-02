(function(){
  'use strict';
  angular.module('app')
    .factory('BackgroundGeolocationPlugin', BackgroundGeolocationPlugin);

  // for BackgroundGeolocation plugin : https://github.com/christocracy/cordova-plugin-background-geolocation
  function BackgroundGeolocationPlugin($window, $q, $log, GeolocationPlugin, PluginUtils){
    var pluginName = 'BackgroundGeolocation';
    var pluginTest = function(){ return $window.plugins && $window.plugins.backgroundGeoLocation; };
    var service = {
      enable: enable,
      disable: stop,
      configure: configure,
      start: start,
      stop: stop
    };
    var defaultOpts = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      notificationTitle: 'Location tracking',
      notificationText: 'ENABLED',
      activityType: 'AutomotiveNavigation',
      debug: true,
      stopOnTerminate: true
    };

    // postLocation function should take a 'location' parameter and return a promise
    function configure(opts, postLocation){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var callbackFn = function(location){
          if(postLocation){
            postLocation(location).then(function(){
              $window.plugins.backgroundGeoLocation.finish();
            }, function(error){
              $log.error('pluginError:'+pluginName, error);
              $window.plugins.backgroundGeoLocation.finish();
            });
          } else {
            $window.plugins.backgroundGeoLocation.finish();
          }
        };
        var failureFn = function(error){
          $log.error('pluginError:'+pluginName, error);
        };
        var options = angular.extend({}, defaultOpts, opts);
        $window.plugins.backgroundGeoLocation.configure(callbackFn, failureFn, options);
        return GeolocationPlugin.getCurrentPosition();
      });
    }

    function start(){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        $window.plugins.backgroundGeoLocation.start();
      });
    }

    function stop(){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        $window.plugins.backgroundGeoLocation.stop();
      });
    }

    function enable(opts, postLocation){
      return configure(opts, postLocation).then(function(){
        return start();
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
      if(!window.plugins.backgroundGeoLocation){
        window.plugins.backgroundGeoLocation = (function(){
          var config = null;
          var callback = null;
          var interval = null;
          return {
            configure: function(callbackFn, failureFn, opts){config = opts; callback = callbackFn;},
            start: function(){
              if(interval === null){
                interval = setInterval(function(){
                  window.navigator.geolocation.getCurrentPosition(function(position){
                    callback(position);
                  });
                }, 3000);
              }
            },
            stop: function(){
              if(interval !== null){
                clearInterval(interval);
                interval = null;
              }
            },
            finish: function(){}
          };
        })();
      }
    }
  });
})();
