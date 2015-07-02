(function(){
  'use strict';
  angular.module('app')
    .factory('DevicePlugin', DevicePlugin);

  // for Device plugin : org.apache.cordova.device (https://github.com/apache/cordova-plugin-device);
  function DevicePlugin($window, PluginUtils){
    var pluginName = 'Device';
    var pluginTest = function(){ return $window.device; };
    var service = {
      getDevice: getDevice,
      getDeviceUuid: getDeviceUuid
    };

    function getDevice(){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        return $window.device;
      });
    }

    function getDeviceUuid(){
      return getDevice().then(function(device){
        return device.uuid;
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
      if(!window.device){
        var browser = {available: true, cordova: "",      manufacturer: "",     model: "",        platform: "browser", uuid: "0123456789",        version: "0"    };
        var android = {available: true, cordova: "3.6.4", manufacturer: "LGE",  model: "Nexus 4", platform: "Android", uuid: "891b8e516ae6bd65",  version: "5.0.1"};
        window.device = browser;
      }
    }
  });
})();
