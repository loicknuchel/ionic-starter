(function(){
  'use strict';
  angular.module('app')
    .factory('LocalNotificationPlugin', LocalNotificationPlugin);

  // for LocalNotification plugin : de.appplant.cordova.plugin.local-notification (https://github.com/katzer/cordova-plugin-local-notifications/)
  function LocalNotificationPlugin($window, $q, PluginUtils){
    var pluginName = 'LocalNotification';
    var pluginTest = function(){ return $window.plugin && $window.plugin.notification && $window.plugin.notification.local; };
    var service = {
      schedule: schedule,
      cancel: cancel,
      onClick: function(callback){ return on('click', callback); }
    };

    function schedule(opts){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        $window.plugin.notification.local.schedule(opts);
      });
    }

    function cancel(id){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        $window.plugin.notification.local.cancel(id, function(){
          defer.resolve();
        });
        return defer.promise;
      });
    }

    function on(event, callback){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        $window.plugin.notification.local.on(event, callback);
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
      if(!window.plugin){window.plugin = {};}
      if(!window.plugin.notification){window.plugin.notification = {};}
      if(!window.plugin.notification.local){
        window.plugin.notification.local = (function(){
          var notifs = {};
          // https://github.com/katzer/cordova-plugin-local-notifications/wiki/04.-Scheduling#interface
          var defaults = {
            id: '0',
            title: '',
            text: '',
            every: 0,
            at: new Date(),
            badge: 0,
            sound: 'res://platform_default',
            data: null,
            icon: 'res://icon',
            smallIcon: 'res://ic_popup_reminder',
            ongoing: false,
            led: 'FFFFFF'
          };

          function withDefaults(opts){
            var res = JSON.parse(JSON.stringify(defaults));
            for(var i in opts){
              res[i] = opts[i];
            }
            return res;
          }

          var ret = {
            hasPermission: function(callback, scope){if(callback){callback(true);}},
            registerPermission: function(callback, scope){if(callback){callback(true);}},
            schedule: function(opts, callback, scope){
              if(!Array.isArray(opts)){ opts = [opts]; }
              for(var i in opts){
                var params = withDefaults(opts[i]);
                if(ret.onadd){ret.onadd(params.id, 'foreground', params.json);}
                notifs[params.id] = params;
              }
              if(callback){callback();}
            },
            cancel: function(id, callback, scope){
              if(ret.oncancel){ret.oncancel(id, 'foreground', notifs[id].json);}
              delete notifs[id];
              if(callback){callback();}
            },
            cancelAll: function(callback, scope){
              for(var i in notifs){
                if(ret.oncancel){ret.oncancel(notifs[i].id, 'foreground', notifs[i].json);}
                delete notifs[i];
              }
              if(callback){callback();}
            },
            on: function(event, callback){}, // TODO
            isScheduled: function(id, callback, scope){
              if(callback){callback(!!notifs[id]);}
            },
            getScheduledIds: function(callback, scope){
              if(callback){
                var ids = [];
                for(var i in notifs){ ids.push(notifs[i].id); }
                callback(ids);
              }
            },
            isTriggered: function(id, callback, scope){if(callback){callback(false);}}, // TODO
            getTriggeredIds: function(callback, scope){if(callback){callback([]);}}, // TODO
            getDefaults: function(){return JSON.parse(JSON.stringify(defaults));},
            setDefaults: function(opts){ defaults = withDefaults(opts); }
          };

          return ret;
        })();
      }
    }
  });
})();
