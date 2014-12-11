angular.module('app')

.factory('LogSrv', function(){
  'use strict';
  var service = {
    track:      track,
    trackError: function(type, error) { track('error', {type: type, error: error}); }
  };

  function track(name, data, _time){
    var event = {};
    if(data)  { event.data = data;  }
    if(_time) { event.time = _time; }
    Logger.track(name, event);
  }

  return service;
});
