(function(){
  'use strict';
  angular.module('app')
    .factory('KeyboardPlugin', KeyboardPlugin)

  // for Device plugin : https://github.com/driftyco/ionic-plugin-keyboard
  function KeyboardPlugin($window, PluginUtils){
    var pluginName = 'Keyboard';
    var pluginTest = function(){ return $window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard; };
    var service = {
      // TODO ...
    };

    return service;
  }


  /**************************
   *                        *
   *      Browser Mock      *
   *                        *
   **************************/
  ionic.Platform.ready(function(){
    if(!ionic.Platform.isWebView()){
      if(!window.cordova){window.cordova = {};}
      if(!window.cordova.plugins){window.cordova.plugins = {};}
      if(!window.cordova.plugins.Keyboard){
        window.cordova.plugins.Keyboard = (function(){
          var plugin = {
            isVisible: false,
            show: function(){
              plugin.isVisible = true;
              var event = new Event('native.keyboardshow');
              event.keyboardHeight = 284;
              window.dispatchEvent(event);
            },
            close: function(){
              plugin.isVisible = false;
              window.dispatchEvent(new Event('native.keyboardhide'));
            },
            hideKeyboardAccessoryBar: function(shouldHide){},
            disableScroll: function(shouldDisable){}
          }
          return plugin;
        })();
      }
    }
  });
})();
