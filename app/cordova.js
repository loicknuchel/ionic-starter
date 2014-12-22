if(!window.plugins){window.plugins = {};}

// for plugin https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git
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
