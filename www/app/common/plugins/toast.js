(function(){
  'use strict';
  angular.module('app')
    .factory('ToastPlugin', ToastPlugin);

  // for Toast plugin : cordova-plugin-x-toast (https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin)
  function ToastPlugin($window, $q, $log, PluginUtils){
    var pluginName = 'Toast';
    var pluginTest = function(){ return $window.plugins && $window.plugins.toast; };
    return {
      show: show,
      showShortTop    : function(message){ return show(message, 'short', 'top');     },
      showShortCenter : function(message){ return show(message, 'short', 'center');  },
      showShortBottom : function(message){ return show(message, 'short', 'bottom');  },
      showLongTop     : function(message){ return show(message, 'long', 'top');      },
      showLongCenter  : function(message){ return show(message, 'long', 'center');   },
      showLongBottom  : function(message){ return show(message, 'long', 'bottom');   }
    };

    function show(message, duration, position){
      if(!duration){ duration  = 'short';   } // possible values : 'short', 'long'
      if(!position){ position  = 'bottom';  } // possible values : 'top', 'center', 'bottom'
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        $window.plugins.toast.show(message, duration, position, function(){
          defer.resolve();
        }, function(error){
          $log.error('pluginError:'+pluginName, error);
          defer.reject(error);
        });
        return defer.promise;
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
      if(!window.plugins){window.plugins = {};}
      if(!window.plugins.toast){
        window.plugins.toast = {
          show: function(message, duration, position, successCallback, errorCallback){
            // durations : short, long
            // positions : top, center, bottom
            // default: short bottom
            console.log('Toast: '+message);
            if(successCallback){window.setTimeout(successCallback('OK'), 0);}
          },
          showShortTop: function(message, successCallback, errorCallback){this.show(message, 'short', 'top', successCallback, errorCallback);},
          showShortCenter: function(message, successCallback, errorCallback){this.show(message, 'short', 'center', successCallback, errorCallback);},
          showShortBottom: function(message, successCallback, errorCallback){this.show(message, 'short', 'bottom', successCallback, errorCallback);},
          showLongTop: function(message, successCallback, errorCallback){this.show(message, 'long', 'top', successCallback, errorCallback);},
          showLongCenter: function(message, successCallback, errorCallback){this.show(message, 'long', 'center', successCallback, errorCallback);},
          showLongBottom: function(message, successCallback, errorCallback){this.show(message, 'long', 'bottom', successCallback, errorCallback);}
        };
      }
    }
  });
})();