(function(){
  'use strict';
  angular.module('app')
    .factory('GeolocationPlugin', GeolocationPlugin);

  // for Geolocation plugin : org.apache.cordova.geolocation (https://github.com/apache/cordova-plugin-geolocation)
  function GeolocationPlugin($window, $q, $timeout, $log, PluginUtils){
    // http://stackoverflow.com/questions/8543763/android-geo-location-tutorial
    // http://tol8.blogspot.fr/2014/03/how-to-get-reliable-geolocation-data-on.html
    // http://www.andygup.net/how-accurate-is-html5-geolocation-really-part-2-mobile-web/
    /*
   * Solutions :
   *  -> reboot device
   *  -> don't use cordova plugin !
   *  -> use native geolocation (should code plugin...)
   */
    var pluginName = 'Geolocation';
    var pluginTest = function(){ return $window.navigator && $window.navigator.geolocation; };
    var service = {
      getCurrentPosition: getCurrentPosition
    };

    function getCurrentPosition(_timeout, _enableHighAccuracy, _maximumAge){
      var opts = {
        enableHighAccuracy: _enableHighAccuracy ? _enableHighAccuracy : true,
        timeout: _timeout ? _timeout : 10000,
        maximumAge: _maximumAge ? _maximumAge : 0
      };

      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        var geolocTimeout = $timeout(function(){
          defer.reject({message: 'Geolocation didn\'t responded within '+opts.timeout+' millis :('});
        }, opts.timeout);
        $window.navigator.geolocation.getCurrentPosition(function(position){
          $timeout.cancel(geolocTimeout);
          defer.resolve(position);
        }, function(error){
          $timeout.cancel(geolocTimeout);
          $log.error('pluginError:'+pluginName, error);
          defer.reject(error);
        }, opts);
        return defer.promise;
      });
    }

    function getCurrentPositionByWatch(_timeout, _enableHighAccuracy, _maximumAge){
      var opts = {
        enableHighAccuracy: _enableHighAccuracy ? _enableHighAccuracy : true,
        timeout: _timeout ? _timeout : 10000,
        maximumAge: _maximumAge ? _maximumAge : 1000
      };

      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        var watchID = null;
        var geolocTimeout = $timeout(function(){
          $window.navigator.geolocation.clearWatch(watchID);
          defer.reject({message: 'Geolocation didn\'t responded within '+opts.timeout+' millis :('});
        }, opts.timeout);
        watchID = $window.navigator.geolocation.watchPosition(function(position){
          $window.navigator.geolocation.clearWatch(watchID);
          $timeout.cancel(geolocTimeout);
          defer.resolve(position);
        }, function(error){
          $timeout.cancel(geolocTimeout);
          $log.error('pluginError:'+pluginName, error);
          defer.reject(error);
        }, opts);
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
      
    }
  });
})();
