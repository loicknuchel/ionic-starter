(function(){
  'use strict';
  angular.module('app')
    .factory('EmailComposerPlugin', EmailComposerPlugin);

  // for EmailComposer plugin : de.appplant.cordova.plugin.email-composer (https://github.com/katzer/cordova-plugin-email-composer)
  function EmailComposerPlugin($window, $q, PluginUtils){
    var pluginName = 'EmailComposer';
    var pluginTest = function(){ return $window.cordova && $window.cordova.plugins && $window.cordova.plugins.email; };
    return {
      isAvailable: isAvailable,
      open: open
    };
    
    function isAvailable(){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        $window.cordova.plugins.email.isAvailable(function(isAvailable){
          if(isAvailable){
            defer.resolve();
          } else {
            defer.reject({message: 'Unable to send email, no account configured.'});
          }
        });
        return defer.promise;
      });
    }
    
    function open(opts, app){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        return isAvailable().then(function(){
          var defer = $q.defer();
          if(app){ opts.app = app; }
          $window.cordova.plugins.email.open(opts, function(){
            defer.resolve();
          });
          return defer.promise;
        });
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
      if(!window.cordova){ window.cordova = {}; }
      if(!window.cordova.plugins){ window.cordova.plugins = {}; }
      if(!window.cordova.plugins.email){
        window.cordova.plugins.email = {
          aliases: {
            gmail: 'com.google.android.gm'
          },
          getDefaults: function(){
            return {
              app:         'mailto',
              subject:     '',
              body:        '',
              to:          [],
              cc:          [],
              bcc:         [],
              attachments: [],
              isHtml:      true
            };
          },
          isAvailable: function(app, callback, scope){
            if(typeof callback != 'function'){
              scope    = null;
              callback = app;
              app      = 'mailto';
            }
            callback(true);
          },
          open: function(options, callback, scope){
            callback();
          },
          addAlias: function(alias, packageName){
            this.aliases[alias] = packageName;
          }
        };
      }
    }
  });
})();
