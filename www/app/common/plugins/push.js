(function(){
  'use strict';
  angular.module('app')
    .factory('PushPlugin', PushPlugin);

  // for Push plugin : https://github.com/phonegap-build/PushPlugin
  function PushPlugin($q, $http, $ionicPlatform, $window, $log, PluginUtils, Config){
    var pluginName = 'Push';
    var pluginTest = function(){ return $window.plugins && $window.plugins.pushNotification; };
    var callbackCurRef = 1;
    var callbackList = {};
    var service = {
      type: {
        ALL: 'all',
        MESSAGE: 'message',
        REGISTERED: 'registered',
        ERROR: 'error'
      },
      sendPush: sendPush,
      register: register,
      onNotification: onNotification,
      cancel: cancel
    };

    // This function is not part of the plugin, you should implement it here !!!
    function sendPush(recipients, data){
      if($ionicPlatform.is('android')){
        return $http.post('https://android.googleapis.com/gcm/send', {
          registration_ids: recipients, // array of registrationIds
          data: data // payload, usefull fields: title, message, timestamp, msgcnt
        }, {
          headers: {
            Authorization: 'key='+Config.gcm.apiServerKey
          }
        }).then(function(){
          return true;
        });
      } else {
        $window.alert('Your platform don\'t have push support :(');
        return $q.when(false);
      }
    }

    function register(senderID){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        var callbackRef = onNotification(function(notification){
          defer.resolve(notification.regid);
          cancel(callbackRef);
        }, service.type.REGISTERED);
        $window.plugins.pushNotification.register(function(data){}, function(err){ registerDefer.reject(err); }, {
          senderID: senderID,
          ecb: 'onPushNotification'
        });
        return defer.promise;
      });
    }

    function onNotification(callback, _type){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var id = callbackCurRef++;
        callbackList[id] = {fn: callback, type: _type || service.type.MESSAGE};
        return id;
      });
    }

    function cancel(id){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        delete callbackList[id];
      });
    }

    $window.onPushNotification = function(notification){
      if(notification.event === service.type.MESSAGE){} // normal notification
      else if(notification.event === service.type.REGISTERED){} // registration acknowledgment
      else if(notification.event === service.type.ERROR){ $log.error('GCM error', notification); } // GCM error
      else { $log.error('unknown GCM event has occurred', notification); } // unknown notification

      for(var i in callbackList){
        if(callbackList[i].type === service.type.ALL || callbackList[i].type === notification.event){
          callbackList[i].fn(notification);
        }
      }
    };

    // iOS only
    function setApplicationIconBadgeNumber(badgeNumber){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        $window.plugins.pushNotification.setApplicationIconBadgeNumber(function(a,b,c){
          console.log('success a', a);
          console.log('success b', b);
          console.log('success c', c);
          defer.resolve();
        }, function(err){
          // on Android : "Invalid action : setApplicationIconBadgeNumber"
          defer.reject(err);
        }, badgeNumber);
        return defer.promise;
      });
    }

    // iOS only
    function showToastNotification(options){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        $window.plugins.pushNotification.showToastNotification(function(a,b,c){
          console.log('success a', a);
          console.log('success b', b);
          console.log('success c', c);
          defer.resolve();
        }, function(err){
          // on Android : "Invalid action : showToastNotification"
          defer.reject(err);
        }, options);
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
      if(!window.plugins){window.plugins = {};}
      if(!window.plugins.pushNotification){
        window.plugins.pushNotification = (function(){
          return {
            // https://github.com/phonegap-build/PushPlugin methods
            register: function(successCallback, errorCallback, options){
              setTimeout(function(){
                if(successCallback){
                  successCallback('OK');
                }
                if(options && options.ecb){
                  eval(options.ecb)({
                    event: 'registered',
                    regid: 'registration_id'
                  });
                }
              }, 0);
            },
            setApplicationIconBadgeNumber: function(successCallback, errorCallback, badge){if(errorCallback){errorCallback('Invalid action : setApplicationIconBadgeNumber');}},
            showToastNotification: function(successCallback, errorCallback, options){if(errorCallback){errorCallback('Invalid action : showToastNotification');}},
            unregister: function(successCallback, errorCallback, options){},

            // https://github.com/Pushwoosh/pushwoosh-phonegap-3.0-plugin methods
            onDeviceReady: function(opts){},
            registerDevice: function(successCallback, errorCallback){ if(successCallback){successCallback('status');} }
          };
        })();
      }
    }
  });
})();
