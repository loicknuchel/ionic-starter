var Logger = (function(){
  var Config = {
    Level: {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3
    },
    currentLevel: 1,
    logToConsole: false
  };
  var logs = [];
  var activated = true;
  return {
    Config: Config,
    debug:  function(message, obj){ log(Config.Level.DEBUG,  message, obj); },
    info:   function(message, obj){ log(Config.Level.INFO,   message, obj); },
    warn:   function(message, obj){ log(Config.Level.WARN,   message, obj); },
    error:  function(message, obj){ log(Config.Level.ERROR,  message, obj); },
    enable: function(){ activated = true; },
    disable: function(){ activated = false; },
    clear: function(){ logs = []; },
    get: function(){ return logs; },
    instrumentFn: instrumentFn,
    instrumentObj: instrumentObj
  };

  function log(level, message, obj){
    if(activated && Config.currentLevel <= level){
      checkExist(level, Config.Level);
      var log = {date: Date.now(), level: level, message: message};
      if(typeof obj === 'undefined' || obj === null){
        // nothing
      } else if(typeof obj === 'object'){
        log.message += ' '+JSON.stringify(obj);
      } else if(typeof obj === 'boolean' || typeof obj === 'number' || typeof obj === 'string'){
        log.message += ' '+obj;
      }
      logs.push(log);
      if(Config.logToConsole){
        if(level === Config.Level.DEBUG) { obj ? console.debug(message, obj)   : console.debug(message); }
        if(level === Config.Level.INFO)  { obj ? console.info(message, obj)    : console.info(message);  }
        if(level === Config.Level.WARN)  { obj ? console.warn(message, obj)    : console.warn(message);  }
        if(level === Config.Level.ERROR) { obj ? console.error(message, obj)   : console.error(message); }
      }
    }
  }

  function checkExist(value, obj){
    for(var i in obj){
      if(obj[i] === value){
        return true;
      }
    }
    console.warn('Unknown value <'+value+'>, availables: '+JSON.stringify(obj));
    return false;
  }

  function instrumentFn(prefix, fn, level){
    level = level || Config.Level.INFO;
    var instrumented = function Log$$instrumented(){
      var jsonArgs = [];
      for(var j in arguments){
        jsonArgs.push(JSON.stringify(arguments[j]));
      }
      log(level, prefix+'('+jsonArgs.join(', ')+')');
      var ret = fn.apply(this, arguments);
      /*if(ret && typeof ret.then === 'function'){
        ret.then(function(data){
          log(level, prefix+' END');
          return data;
        });
      } else {
        log(level, prefix+' END');
      }*/
      return ret;
    }
    instrumented.__riginalFn = fn;
    return instrumented;
  }

  function instrumentObj(prefix, obj, level){
    for(var i in obj){
      if(typeof obj[i] === 'function'){
        obj[i] = instrumentFn(prefix+'.'+i, obj[i], level);
      }
    }
  }
})();
