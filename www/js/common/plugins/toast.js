(function(){
  'use strict';
  angular.module('app')
    .factory('ToastPlugin', ToastPlugin);

  // for Toast plugin : https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin
  function ToastPlugin($window, PluginUtils){
    var pluginName = 'Toast';
    var pluginTest = function(){ return $window.plugins && $window.plugins.toast; };
    var service = {
      show: show,
      showShortTop    : function(message, successCb, errorCb){ show(message, 'short', 'top', successCb, errorCb);     },
      showShortCenter : function(message, successCb, errorCb){ show(message, 'short', 'center', successCb, errorCb);  },
      showShortBottom : function(message, successCb, errorCb){ show(message, 'short', 'bottom', successCb, errorCb);  },
      showLongTop     : function(message, successCb, errorCb){ show(message, 'long', 'top', successCb, errorCb);      },
      showLongCenter  : function(message, successCb, errorCb){ show(message, 'long', 'center', successCb, errorCb);   },
      showLongBottom  : function(message, successCb, errorCb){ show(message, 'long', 'bottom', successCb, errorCb);   }
    };

    function show(message, duration, position, successCb, errorCb){
      if(!duration)   { duration  = 'short';            } // possible values : 'short', 'long'
      if(!position)   { position  = 'bottom';           } // possible values : 'top', 'center', 'bottom'
      if(!successCb)  { successCb = function(status){}; }
      if(!errorCb)    { errorCb   = function(error){};  }
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        $window.plugins.toast.show(message, duration, position, successCb, errorCb);
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
