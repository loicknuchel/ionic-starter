angular.module('app')

.factory('PluginUtils', function($window, $ionicPlatform, $q, $log){
  'use strict';
  var service = {
    onReady: onReady
  };

  function onReady(name, testFn){
    return $ionicPlatform.ready().then(function(){
      if(!testFn()){
        $log.error('pluginNotFound:'+name);
        return $q.reject({message: 'pluginNotFound:'+name});
      }
    });
  }

  return service;
})

// for Device plugin : org.apache.cordova.device (https://github.com/apache/cordova-plugin-device)
.factory('DevicePlugin', function($window, PluginUtils){
  'use strict';
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
})

// for Dialogs plugin : org.apache.cordova.dialogs (https://github.com/apache/cordova-plugin-dialogs)
.factory('DialogPlugin', function($window, $q, $log, PluginUtils){
  'use strict';
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

  var AudioCtx = window.audioContext || window.webkitAudioContext;
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
})

// for Toast plugin : https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin
.factory('ToastPlugin', function($window, PluginUtils){
  'use strict';
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
})

// for Geolocation plugin : org.apache.cordova.geolocation (https://github.com/apache/cordova-plugin-geolocation)
.factory('GeolocationPlugin', function($window, $q, $timeout, $log, PluginUtils){
  'use strict';
  var pluginName = 'Geolocation';
  var pluginTest = function(){ return $window.navigator && $window.navigator.geolocation; };
  var service = {
    getCurrentPosition: getCurrentPosition
  };

  function getCurrentPosition(_timeout, _enableHighAccuracy, _maximumAge){
    var opts = {
      enableHighAccuracy: _enableHighAccuracy ? _enableHighAccuracy : true,
      timeout: _timeout ? _timeout : 10000,
      maximumAge: _maximumAge ? _maximumAge : 0
    };

    return PluginUtils.onReady(pluginName, pluginTest).then(function(){
      var defer = $q.defer();
      var geolocTimeout = $timeout(function(){
        defer.reject({message: 'Geolocation didn\'t responded within '+opts.timeout+' millis :('});
      }, opts.timeout);
      $window.navigator.geolocation.getCurrentPosition(function(position){
        $timeout.cancel(geolocTimeout);
        defer.resolve(position);
      }, function(error){
        $timeout.cancel(geolocTimeout);
        $log.error('pluginError:'+pluginName, error);
        defer.reject(error);
      }, opts);
      return defer.promise;
    });
  }

  return service;
})

// for Camera plugin : org.apache.cordova.camera (https://github.com/apache/cordova-plugin-camera)
.factory('CameraPlugin', function($window, $q, $log, PluginUtils){
  'use strict';
  var pluginName = 'Camera';
  var pluginTest = function(){ return $window.navigator && $window.navigator.camera; };
  var service = {
    getPicture: _getPicture,
    takePicture: takePicture,
    findPicture: findPicture
  };

  var defaultOpts = {
    quality : 75, // between 0-100 (default: 50)
    destinationType : $window.Camera.DestinationType.FILE_URI, // Type of result (default: FILE_URI)
    sourceType : $window.Camera.PictureSourceType.CAMERA, // Source of the picture (default: CAMERA)
    allowEdit : false,
    encodingType: $window.Camera.EncodingType.JPEG, // (default: JPEG)
    // targetWidth: 100,
    // targetHeight: 100,
    mediaType: $window.Camera.MediaType.PICTURE, // (default: PICTURE)
    cameraDirection: $window.Camera.Direction.BACK, // (default: BACK)
    correctOrientation: true, // rotate the image to correct for the orientation of the device during capture
    saveToPhotoAlbum: false
  };

  function _getPicture(_opts){
    return PluginUtils.onReady(pluginName, pluginTest).then(function(){
      var opts = angular.extend(defaultOpts, _opts);
      var defer = $q.defer();
      $window.navigator.camera.getPicture(function(picture){
        defer.resolve(picture);
      }, function(error){
        $log.error('pluginError:'+pluginName, error);
        defer.reject(error);
      }, opts);
      return defer.promise;
    });
  }

  function takePicture(){
    return _getPicture({});
  }

  function findPicture(){
    return _getPicture({sourceType: $window.Camera.PictureSourceType.PHOTOLIBRARY});
  }

  return service;
})

// for Sharing plugin : https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
.factory('SharingPlugin', function($window, $q, $log, PluginUtils){
  'use strict';
  var pluginName = 'Sharing';
  var pluginTest = function(){ return $window.plugins && $window.plugins.socialsharing; };
  var service = {
    share: share,
    shareViaFacebook: shareViaFacebook,
    shareViaTwitter: shareViaTwitter,
    shareViaEmail: shareViaEmail
  };

  // _fileOrFileArray can be null, a string or an array of strings
  function share(message, _subject, _fileOrFileArray, _link){
    return PluginUtils.onReady(pluginName, pluginTest).then(function(){
      var defer = $q.defer();
      $window.plugins.socialsharing.share(message, _subject || null, _fileOrFileArray || null, _link || null, function(){
        defer.resolve();
      }, function(error){
        $log.error('pluginError:'+pluginName, error);
        defer.reject(error);
      });
      return defer.promise;
    });
  }

  function shareViaFacebook(message, _fileOrFileArray, _link){
    return PluginUtils.onReady(pluginName, pluginTest).then(function(){
      var defer = $q.defer();
      $window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(message, _fileOrFileArray || null, _link || null, 'Tu peux coller le message par défaut si tu veux...', function(){
        defer.resolve();
      }, function(error){
        $log.error('pluginError:'+pluginName, error);
        defer.reject(error);
      });
      return defer.promise;
    });
  }

  function shareViaTwitter(message, _file, _link){
    return PluginUtils.onReady(pluginName, pluginTest).then(function(){
      var defer = $q.defer();
      $window.plugins.socialsharing.shareViaTwitter(message, _file || null, _link || null, function(){
        defer.resolve();
      }, function(error){
        $log.error('pluginError:'+pluginName, error);
        defer.reject(error);
      });
      return defer.promise;
    });
  }

  function shareViaEmail(message, _subject, _fileOrFileArray){
    return PluginUtils.onReady(pluginName, pluginTest).then(function(){
      var defer = $q.defer();
      $window.plugins.socialsharing.shareViaEmail(message, _subject || null, null /*to*/, null /*cc*/, null /*bcc*/, _fileOrFileArray || null, function(){
        defer.resolve();
      }, function(error){
        $log.error('pluginError:'+pluginName, error);
        defer.reject(error);
      });
      return defer.promise;
    });
  }

  return service;
})


// for Media plugin : org.apache.cordova.media (https://github.com/apache/cordova-plugin-media)
.factory('MediaPlugin', function($window, $q, $ionicPlatform, $log, PluginUtils){
  'use strict';
  var pluginName = 'Media';
  var pluginTest = function(){ return $window.Media; };
  var service = {
    loadMedia: loadMedia,
    statusToMessage: statusToMessage,
    errorToMessage: errorToMessage
  };

  function loadMedia(src, onStop, onError, onStatus){
    return PluginUtils.onReady(pluginName, pluginTest).then(function(){
      var mediaSuccess = function(){
        if(onStop){onStop();}
      };
      var mediaError = function(error){
        $log.error('pluginError:'+pluginName, {
          src: src,
          code: error.code,
          message: errorToMessage(error.code)
        });
        if(onError){onError(error);}
      };
      var mediaStatus = function(status){
        if(onStatus){onStatus(status);}
      };

      if($ionicPlatform.is('android')){src = '/android_asset/www/' + src;}
      return new $window.Media(src, mediaSuccess, mediaError, mediaStatus);
    });
  }

  function statusToMessage(status){
    if(status === 0){return 'Media.MEDIA_NONE';}
    else if(status === 1){return 'Media.MEDIA_STARTING';}
    else if(status === 2){return 'Media.MEDIA_RUNNING';}
    else if(status === 3){return 'Media.MEDIA_PAUSED';}
    else if(status === 4){return 'Media.MEDIA_STOPPED';}
    else {return 'Unknown status <'+status+'>';}
  }

  function errorToMessage(code){
    if(code === 1){return 'MediaError.MEDIA_ERR_ABORTED';}
    else if(code === 2){return 'MediaError.MEDIA_ERR_NETWORK';}
    else if(code === 3){return 'MediaError.MEDIA_ERR_DECODE';}
    else if(code === 4){return 'MediaError.MEDIA_ERR_NONE_SUPPORTED';}
    else {return 'Unknown code <'+code+'>';}
  }

  return service;
})

// for DeviceAccounts plugin : https://github.com/loicknuchel/cordova-device-accounts
.factory('DeviceAccountsPlugin', function($window, $q, $log, PluginUtils){
  'use strict';
  var pluginName = 'DeviceAccounts';
  var pluginTest = function(){ return $window.plugins && $window.plugins.DeviceAccounts; };
  var service = {
    getAccounts: getAccounts,
    getEmail: getEmail
  };

  function getAccounts(){
    return PluginUtils.onReady(pluginName, pluginTest).then(function(){
      var defer = $q.defer();
      $window.plugins.DeviceAccounts.get(function(accounts){
        defer.resolve(accounts);
      }, function(error){
        $log.error('pluginError:'+pluginName, error);
        defer.reject(error);
      });
      return defer.promise;
    });
  }

  function getEmail(){
    return PluginUtils.onReady(pluginName, pluginTest).then(function(){
      var defer = $q.defer();
      $window.plugins.DeviceAccounts.getEmail(function(email){
        defer.resolve(email);
      }, function(error){
        $log.error('pluginError:'+pluginName, error);
        defer.reject(error);
      });
      return defer.promise;
    });
  }

  return service;
});
