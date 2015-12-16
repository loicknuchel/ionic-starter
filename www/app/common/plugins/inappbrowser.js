(function(){
  'use strict';
  angular.module('app')
    .factory('InAppBrowserPlugin', InAppBrowserPlugin)
    .directive('href', href);

  // for InAppBrowser plugin : cordova-plugin-inappbrowser (https://github.com/apache/cordova-plugin-inappbrowser)
  function InAppBrowserPlugin($window, PluginUtils){
    var pluginName = 'InAppBrowser';
    var pluginTest = function(){ return $window.cordova && $window.cordova.InAppBrowser; };
    return {
      open: open
    };

    function open(url, target, options){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        $window.cordova.InAppBrowser.open(url, target, options);
      });
    }
  }

  // open external links (starting with http:, https:, tel: or sms:) outside the app
  function href(InAppBrowserPlugin){
    var externePrefixes = ['http:', 'https:', 'tel:', 'sms:'];
    return {
      restrict: 'A',
      scope: {
        url: '@href'
      },
      link: function(scope, element, attrs){
        if(isExterneUrl(scope.url)){
          element.bind('click', function(e){
            e.preventDefault();
            InAppBrowserPlugin.open(encodeURI(scope.url), '_system', 'location=yes');
          });
        }
      }
    };
    function isExterneUrl(url){
      if(url){
        for(var i in externePrefixes){
          if(url.indexOf(externePrefixes[i]) === 0){
            return true;
          }
        }
      }
      return false;
    }
  }


  /**************************
   *                        *
   *      Browser Mock      *
   *                        *
   **************************/
  ionic.Platform.ready(function(){
    if(!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())){
      if(!window.cordova){window.cordova = {};}
      if(!window.cordova.InAppBrowser){
        window.cordova.InAppBrowser = {
          open: function(url, target, options){
            window.open(url, target, options);
          }
        };
      }
    }
  });
})();
