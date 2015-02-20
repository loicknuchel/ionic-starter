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


// for DeviceAccounts plugin : https://github.com/loicknuchel/cordova-device-accounts
window.plugins.DeviceAccounts = {
  get: function(onSuccess, onFail){ onSuccess([{type:'com.google', name:'test@example.com'}]); },
  getByType: function(type, onSuccess, onFail){ onSuccess([{type:'com.google', name:'test@example.com'}]); },
  getEmails: function(onSuccess, onFail){ onSuccess(['test@example.com']); },
  getEmail: function(onSuccess, onFail){ onSuccess('test@example.com'); }
};
