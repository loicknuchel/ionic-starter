angular.module('app')

.factory('Utils', function($timeout, $q, $sce){
  'use strict';
  var service = {
    createUuid: createUuid,   // ()                             generate an identifier like 'de7a545d-0045-454a-81de-deb9d74e74a7'
    isEmail: isEmail,         // (str)                          check if str has email format
    isUrl: isUrl,             // (str)                          check if str has url format
    startsWith: startsWith,   // (str, prefix)                  check if str starts with prefix
    endsWith: endsWith,       // (str, suffix)                  check if str ends with suffix
    randInt: randInt,         // (min, max)                     generate a random Int between min & max
    async: async,             // (fn)                           transform synchronous function in asynchronous function
    debounce: debounce,       // (key, callback, _debounceTime) debounce a value based on given key
    trustHtml: trustHtml,     // (html)                         angular trust html (to display unsafe html)
    extendDeep: extendDeep,   // (dest, args...)                extends dest with values in args objets (like angular.extends but recursivly)
    extendsWith: extendsWith, // (dest, src)                    add src values to dest where key is undefined (do not override existing values)
    sort: sort                // (arr, params)                  sort Array arr according to params (order: elt attribute name, desc: true/false)
  };

  function createUuid(){
    function S4(){ return (((1+Math.random())*0x10000)|0).toString(16).substring(1); }
    return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0,3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
  }

  function isEmail(str){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(str);
  }

  function isUrl(str){
    return (/^(https?):\/\/((?:[a-z0-9.-]|%[0-9A-F]{2}){3,})(?::(\d+))?((?:\/(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*)*)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i).test(str);
  }

  function startsWith(str, prefix){
    return str.indexOf(prefix) === 0;
  }

  function endsWith(str, suffix){
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  function randInt(min, max){
    return Math.floor(Math.random()*(max - min + 1)) - min;
  }

  function async(fn){
    var defer = $q.defer();
    $timeout(function(){
      defer.resolve(fn());
    }, 0);
    return defer.promise;
  }

  function trustHtml(html){
    return $sce.trustAsHtml(html);
  }

  var debounces = [];
  function debounce(key, callback, _debounceTime){
    $timeout.cancel(debounces[key]);
    debounces[key] = $timeout(function(){
      callback();
    }, _debounceTime || 1000);
  }

  function extendDeep(dest){
    angular.forEach(arguments, function(arg){
      if(arg !== dest){
        angular.forEach(arg, function(value, key){
          if(dest[key] && typeof dest[key] === 'object'){
            extendDeep(dest[key], value);
          } else {
            dest[key] = angular.copy(value);
          }
        });
      }
    });
    return dest;
  }

  function extendsWith(dest, src){
    for(var i in src){
      if(typeof src[i] === 'object'){
        if(dest[i] === undefined || dest[i] === null){
          dest[i] = angular.copy(src[i]);
        } else if(typeof dest[i] === 'object'){
          extendsWith(dest[i], src[i]);
        }
      } else if(typeof src[i] === 'function'){
        // nothing
      } else if(dest[i] === undefined || dest[i] === null){
        dest[i] = src[i];
      }
    }
  }



  function sort(arr, params){
    if(Array.isArray(arr) && arr.length > 0 && params && params.order){
      var firstElt = null;
      for(var i in arr){
        firstElt = _getDeep(arr[i], params.order.split('.'));
        if(typeof firstElt !== 'undefined'){ break; }
      }
      if(typeof firstElt === 'boolean')      { _boolSort(arr, params); }
      else if(typeof firstElt === 'number')  { _intSort(arr, params);  }
      else if(typeof firstElt === 'string')  { _strSort(arr, params);  }
      else {
        console.warn('Unable to find suitable sort for type <'+(typeof firstElt)+'>', firstElt);
      }
    }
  }

  function _strSort(arr, params){
    arr.sort(function(a, b){
      var aStr = _getDeep(a, params.order.split('.'), '').toLowerCase();
      var bStr = _getDeep(b, params.order.split('.'), '').toLowerCase();
      if(aStr > bStr)       { return 1 * (params.desc ? -1 : 1);   }
      else if(aStr < bStr)  { return -1 * (params.desc ? -1 : 1);  }
      else                  { return 0;                     }
    });
  }
  function _intSort(arr, params){
    arr.sort(function(a, b){
      var aInt = _getDeep(a, params.order.split('.'), 0);
      var bInt = _getDeep(b, params.order.split('.'), 0);
      return (aInt - bInt) * (params.desc ? -1 : 1);
    });
  }
  function _boolSort(arr, params){
    arr.sort(function(a, b){
      var aBool = _getDeep(a, params.order.split('.'), 0);
      var bBool = _getDeep(b, params.order.split('.'), 0);
      return (aBool === bBool ? 0 : (aBool ? -1 : 1)) * (params.desc ? -1 : 1);
    });
  }
  
  function _getDeep(obj, attrs, _defaultValue){
    if(Array.isArray(attrs) && attrs.length > 0){
      if(typeof obj === 'object'){
        var attr = attrs.shift();
        return _getDeep(obj[attr], attrs, _defaultValue);
      } else {
        return _defaultValue;
      }
    } else {
      return typeof obj === 'undefined' ? _defaultValue : obj;
    }
  }

  return service;
});
