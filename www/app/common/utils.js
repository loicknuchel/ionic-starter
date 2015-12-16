(function(){
  'use strict';
  angular.module('app')
    .factory('Utils', Utils);

  function Utils($q, $timeout){
    return {
      createUuid: createUuid,
      isEmail: isEmail,
      isUrl: isUrl,
      padLeft: padLeft,
      encodeUTF8: encodeUTF8,
      decodeUTF8: decodeUTF8,
      parseKeyValue: parseKeyValue,
      realAsync: realAsync
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

    function padLeft(num, length, char){
      var res = num.toString();
      while(res.length < length){
        res = char+res;
      }
      return res;
    }

    function encodeUTF8(string){
      try {
        return unescape(encodeURIComponent(string));
      } catch(e){
        return string;
      }
    }

    function decodeUTF8(string){
      try {
        return decodeURIComponent(escape(string));
      } catch(e){
        return string;
      }
    }

    function parseKeyValue(str){
      var lines = [];
      var parts = str.split(/\r\n|\r|\n/g);
      var line = '';
      for(var i in parts){
        if(!parts[i].startsWith(' ') && parts[i].indexOf('=') > -1 && line.length > 0){
          lines.push(line);
          line = '';
        }
        line += parts[i].trim();
      }
      lines.push(line);
      var result = {};
      for(var i in lines){
        var index = lines[i].indexOf('=');
        if(index > -1){
          result[lines[i].substr(0, index)] = lines[i].substr(index+1);
        }
      }
      return result;
    }

    function realAsync(fn){
      var defer = $q.defer();
      $timeout(function(){
        defer.resolve(fn());
      }, 0);
      return defer.promise;
    }
  }
})();
