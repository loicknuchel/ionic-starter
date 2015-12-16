(function(){
  'use strict';
  angular.module('app')
    .factory('AppVersionPlugin', AppVersionPlugin);

  // for AppVersion plugin : cordova-plugin-appversion (https://github.com/Rareloop/cordova-plugin-app-version)
  /*
    http://developer.android.com/intl/vi/reference/android/content/pm/PackageInfo.html
    https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/Classes/NSBundle_Class/#//apple_ref/occ/instp/NSBundle/infoDictionary
    https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html
  */
  function AppVersionPlugin($window, PluginUtils){
    var pluginName = 'AppVersion';
    var pluginTest = function(){ return $window.AppVersion; };
    return {
      get: get,
      getVersion: getVersion,
      getBuild: getBuild
    };

    function get(){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        return $window.AppVersion;
      });
    }

    function getVersion(){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        return $window.AppVersion.version;
      });
    }

    function getBuild(){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        return $window.AppVersion.build;
      });
    }
  }


  /**************************
   *                        *
   *      Browser Mock      *
   *                        *
   **************************/
  ionic.Platform.ready(function(){
    if(!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())){
      if(!window.AppVersion){
        window.AppVersion = {
          version: '1.2.3',
          build: '1234'
        };
      }
    }
  });
})();
