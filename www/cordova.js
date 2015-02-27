if(!window.plugins){window.plugins = {};}


// for Device plugin : org.apache.cordova.device (https://github.com/apache/cordova-plugin-device)
if(!window.device){
  window.device = {
    available: true,
    cordova: "3.6.4",
    manufacturer: "LGE",
    model: "Nexus 4",
    // platform: "Android",
    uuid: "891b8e516ae6bd65",
    version: "5.0.1"
  };
}


// for Dialogs plugin : org.apache.cordova.dialogs (https://github.com/apache/cordova-plugin-dialogs)
window.navigator.notification = (function(){
  var ctx = new(window.audioContext || window.webkitAudioContext);
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


// for Toast plugin : https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git
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


// for Geolocation plugin : org.apache.cordova.geolocation (https://github.com/apache/cordova-plugin-geolocation)
// no mock, this is natively supported by browser :)


// for BackgroundGeolocation plugin : https://github.com/christocracy/cordova-plugin-background-geolocation
if(!window.plugins){window.plugins = {};}
window.plugins.backgroundGeoLocation = (function(){
  var config = null;
  var callback = null;
  var interval = null;
  return {
    configure: function(callbackFn, failureFn, opts){config = opts; callback = callbackFn;},
    start: function(){
      if(interval === null){
        interval = setInterval(function(){
          window.navigator.geolocation.getCurrentPosition(function(position){
            callback(position);
          });
        }, 3000);
      }
    },
    stop: function(){
      if(interval !== null){
        clearInterval(interval);
        interval = null;
      }
    },
    finish: function(){}
  };
})();


// for LocalNotification plugin : de.appplant.cordova.plugin.local-notification (https://github.com/katzer/cordova-plugin-local-notifications/)
if(!window.plugin){window.plugin = {};}
if(!window.plugin.notification){window.plugin.notification = {};}
window.plugin.notification.local = (function(){
  var notifs = {};
  var defaults = {
    message: '',
    title: '',
    autoCancel: false,
    badge: 0,
    id: '0',
    json: '',
    repeat: '',
    icon: 'icon',
    smallIcon: null,
    ongoing: false,
    sound: 'TYPE_NOTIFICATION'
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
    add: function(opts, callback, scope){
      var params = withDefaults(opts);
      if(ret.onadd){ret.onadd(params.id, 'foreground', params.json);}
      notifs[params.id] = params;
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


// for Camera plugin : org.apache.cordova.camera (https://github.com/apache/cordova-plugin-camera)
window.navigator.camera = (function(){
  window.Camera = {
    DestinationType: {
      DATA_URL: 0, // return image as base64-encoded string
      FILE_URI: 1, // return image file URI (default)
      NATIVE_URI: 2 // return image native URI
    },
    Direction: {
      BACK: 0, // Use the back-facing camera (default)
      FRONT: 1 // Use the front-facing camera
    },
    EncodingType: {
      JPEG: 0, // (default)
      PNG: 1
    },
    MediaType: {
      PICTURE: 0, // allow selection of pictures only. Will return format specified via DestinationType (default)
      VIDEO: 1, // allow selection of video only, will always return FILE_URI
      ALLMEDIA: 2 // allow selection from all media types
    },
    PictureSourceType: {
      PHOTOLIBRARY: 0, // dialog displays that allows users to select an existing image
      CAMERA: 1, // opens the device's default camera application that allows users to snap pictures (default)
      SAVEDPHOTOALBUM: 2 // dialog displays that allows users to select an existing image
    },
    PopoverArrowDirection: { // iOS only
      ARROW_UP: 1,
      ARROW_DOWN: 2,
      ARROW_LEFT: 4,
      ARROW_RIGHT: 8,
      ARROW_ANY: 15
    }
  };

  var ret = JSON.parse(JSON.stringify(window.Camera));
  ret.getPicture = function(success, error, options){
    var uri = window.prompt('Image uri :');
    if(uri){
      if(success){ success(uri); }
    } else {
      if(error){ error(); }
    }
  };

  return ret;
})();


// for Media plugin : org.apache.cordova.media (https://github.com/apache/cordova-plugin-media)
window.Media = function(src, mediaSuccess, mediaError, mediaStatus){
  // src: A URI containing the audio content. (DOMString)
  // mediaSuccess: (Optional) The callback that executes after a Media object has completed the current play, record, or stop action. (Function)
  // mediaError: (Optional) The callback that executes if an error occurs. (Function)
  // mediaStatus: (Optional) The callback that executes to indicate status changes. (Function)

  if (typeof Audio !== 'function' && typeof Audio !== 'object') {
    console.warn('HTML5 Audio is not supported in this browser');
  }
  var sound = new Audio();
  sound.src = src;
  sound.addEventListener('ended', mediaSuccess, false);
  sound.load();

  return {
    // Returns the current position within an audio file (in seconds).
    getCurrentPosition: function(mediaSuccess, mediaError){ mediaSuccess(sound.currentTime); },
    // Returns the duration of an audio file (in seconds) or -1.
    getDuration: function(){ return isNaN(sound.duration) ? -1 : sound.duration; },
    // Start or resume playing an audio file.
    play: function(){ sound.play(); },
    // Pause playback of an audio file.
    pause: function(){ sound.pause(); },
    // Releases the underlying operating system's audio resources. Should be called on a ressource when it's no longer needed !
    release: function(){},
    // Moves the position within the audio file.
    seekTo: function(milliseconds){}, // TODO
    // Set the volume for audio playback (between 0.0 and 1.0).
    setVolume: function(volume){ sound.volume = volume; },
    // Start recording an audio file.
    startRecord: function(){},
    // Stop recording an audio file.
    stopRecord: function(){},
    // Stop playing an audio file.
    stop: function(){ sound.pause(); if(mediaSuccess){mediaSuccess();} } // TODO
  };
};


// for Push plugin : https://github.com/phonegap-build/PushPlugin
if(!window.plugins){window.plugins = {};}
window.plugins.pushNotification = (function(){
  return {
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
    unregister: function(successCallback, errorCallback, options){}
  };
})();


// for Parse plugin : https://github.com/umurgdk/phonegap-parse-plugin
window.parsePlugin = (function(){
  var subscriptions = [];
  return {
    initialize: function(appId, clientKey, successCallback, errorCallback){successCallback();},
    getInstallationId: function(successCallback, errorCallback){successCallback('7ff61742-ab67-42aa-bf48-d821afb44022');},
    getInstallationObjectId: function(successCallback, errorCallback){successCallback('ED4j8uPOth');},
    subscribe: function(channel, successCallback, errorCallback){ subscriptions.push(channel); successCallback(); },
    unsubscribe: function(channel, successCallback, errorCallback){ subscriptions.splice(subscriptions.indexOf(channel), 1); successCallback(); },
    getSubscriptions: function(successCallback, errorCallback){successCallback(subscriptions);},
    onMessage: function(successCallback, errorCallback){}
  };
})();


// for DeviceAccounts plugin : https://github.com/loicknuchel/cordova-device-accounts
window.plugins.DeviceAccounts = {
  get: function(onSuccess, onFail){ onSuccess([{type:'com.google', name:'test@example.com'}]); },
  getByType: function(type, onSuccess, onFail){ onSuccess([{type:'com.google', name:'test@example.com'}]); },
  getEmails: function(onSuccess, onFail){ onSuccess(['test@example.com']); },
  getEmail: function(onSuccess, onFail){ onSuccess('test@example.com'); }
};
