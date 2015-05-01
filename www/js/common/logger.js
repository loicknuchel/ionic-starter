(function(){
  'use strict';
  angular.module('app')
    .factory('customLogger', customLogger);

  function customLogger(){
    function track(name, data, _time){
      if(typeof data === 'string'){ data = {message: data}; }

      var event = {};
      if(data)  { event.data = data;  }
      if(_time) { event.time = _time; }
      Logger.track(name, event);
    }

    return function($delegate){
      return {
        debug: function(){$delegate.debug.apply(null, arguments);},
        log: function(){
          track(arguments[0], arguments[1], arguments[2]);
          $delegate.log.apply(null, arguments);
        },
        info: function(){$delegate.info.apply(null, arguments);},
        warn:function(){$delegate.warn.apply(null, arguments);},
        error: function(){
          if(typeof arguments[0] === 'string'){
            track('error', {type: arguments[0], error: arguments[1]}, arguments[2]);
          } else {
            var exception = arguments[0];
            var cause = arguments[1];
            var data = {type: 'angular'};
            if(cause)               { data.cause    = cause;              }
            if(exception){
              if(exception.message) { data.message  = exception.message;  }
              if(exception.name)    { data.name     = exception.name;     }
              if(exception.stack)   { data.stack    = exception.stack;    }
            }
            track('exception', data);
          }
          $delegate.error.apply(null, arguments);
        }
      };
    };
  }
})();
