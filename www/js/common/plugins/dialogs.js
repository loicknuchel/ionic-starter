(function(){
  'use strict';
  angular.module('app')
    .factory('DialogPlugin', DialogPlugin);

  // for Dialogs plugin : org.apache.cordova.dialogs (https://github.com/apache/cordova-plugin-dialogs)
  function DialogPlugin($window, $q, $log, PluginUtils){
    var pluginName = 'Dialogs';
    var pluginTest = function(){ return $window.navigator && $window.navigator.notification; };
    /*
   * Button indexes :
   *    - 0 : cancel with backdrop
   *    - 1 : Ok
   *    - 2 : Annuler
   * Or, your index in buttonLabels array but one based !!! (0 is still cancel)
   */
    var service = {
      alert: pluginAlert,
      confirm: function(message, _title){
        return pluginConfirm(message, _title).then(function(buttonIndex){
          return _isConfirm(buttonIndex);
        });
      },
      confirmMulti: pluginConfirm,
      prompt: function(message, _title, _defaultText){
        return pluginPrompt(message, _title, null, _defaultText).then(function(result){
          result.confirm = _isConfirm(result.buttonIndex);
          return result;
        });
      },
      promptMulti: pluginPrompt,
      beep: pluginBeep
    };

    function pluginAlert(message, _title, _buttonName){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        $window.navigator.notification.alert(message, function(){ defer.resolve(); }, _title, _buttonName);
        return defer.promise;
      }, function(error){
        $log.error('pluginError:'+pluginName, error);
        $window.alert(message);
      });
    }

    function pluginConfirm(message, _title, _buttonLabels){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        $window.navigator.notification.confirm(message, function(buttonIndex){ defer.resolve(buttonIndex); }, _title, _buttonLabels);
        return defer.promise;
      }, function(error){
        $log.error('pluginError:'+pluginName, error);
        return _toButtonIndex($window.confirm(message));
      });
    }

    function pluginPrompt(message, _title, _buttonLabels, _defaultText){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        $window.navigator.notification.prompt(message, function(result){ defer.resolve(result); }, _title, _buttonLabels, _defaultText);
        return defer.promise;
      }, function(error){
        $log.error('pluginError:'+pluginName, error);
        var text = $window.prompt(message, _defaultText);
        return {buttonIndex: _toButtonIndex(text), input1: text};
      });
    }

    function pluginBeep(times){
      if(!times){times = 1;}
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        $window.navigator.notification.beep(times);
      }, function(error){
        $log.error('pluginError:'+pluginName, error);
        if(beepFallback){
          beepFallback(times);
        } else {
          $q.reject(error);
        }
      });
    }

    function _isConfirm(buttonIndex){
      return buttonIndex === 1 ? true : false;
    }
    function _toButtonIndex(value){
      return value ? 1 : 2;
    }

    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if(AudioCtx){
      var ctx = new AudioCtx();
      var html5Beep = function(callback){
        var duration = 200;
        var type = 0;
        if(!callback){callback = function(){};}
        var osc = ctx.createOscillator();
        osc.type = type;
        osc.connect(ctx.destination);
        osc.noteOn(0);
        $window.setTimeout(function(){
          osc.noteOff(0);
          callback();
        }, duration);
      };
      var beepFallback = function(times){
        if(times > 0){
          html5Beep(function(){
            $window.setTimeout(function(){beepFallback(times-1);}, 500);
          });
        }
      };
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
      if(!window.navigator){window.navigator = {};}
      if(!window.navigator.notification){
        window.navigator.notification = (function(){
          var ctx = new(window.AudioContext || window.webkitAudioContext);
          function html5Beep(callback){
            var duration = 200;
            var type = 0;
            if(!callback){callback = function(){};}
            var osc = ctx.createOscillator();
            osc.type = type;
            osc.connect(ctx.destination);
            osc.noteOn(0);
            window.setTimeout(function(){
              osc.noteOff(0);
              callback();
            }, duration);
          }

          function beep(times){
            if(times > 0){
              html5Beep(function(){
                window.setTimeout(function(){beep(times-1);}, 500);
              });
            }
          }

          return {
            alert: function(message, alertCallback, title, buttonName){
              window.alert(message);
              if(alertCallback){alertCallback();}
            },
            confirm: function(message, confirmCallback, title, buttonLabels){
              var c = window.confirm(message);
              if(confirmCallback){confirmCallback(c ? 1 : 2);}
            },
            prompt: function(message, promptCallback, title, buttonLabels, defaultText){
              var text = window.prompt(message, defaultText);
              if(promptCallback){promptCallback({buttonIndex: text ? 1 : 2, input1: text});}
            },
            beep: beep
          };
        })();
      }
    }
  });
})();
