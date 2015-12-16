(function(){
  'use strict';
  angular.module('app')
    .factory('FileTransferPlugin', FileTransferPlugin);

  // for FileTransferPlugin plugin : cordova-plugin-file-transfer (https://github.com/apache/cordova-plugin-file-transfer)
  function FileTransferPlugin($window, $q, PluginUtils){
    var pluginName = 'FileTransfer';
    var pluginTest = function(){ return $window.FileTransfer; };
    return {
      options: options,
      upload: upload,
      download: download
    };

    function options(opts){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var options = new FileUploadOptions();
        opts = opts || {};
        for(var i in opts){
          options[i] = opts[i];
        }
        return options;
      });
    }

    function upload(filePath, serverURL, options, onProgress){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        var ft = new FileTransfer();
        if(onProgress){ ft.onprogress = onProgress; }
        ft.upload(filePath, serverURL, function(data){
          defer.resolve(data);
        }, function(error){
          defer.reject(error);
        }, options);
        return defer.promise;
      });
    }

    function download(sourceUri, destinationPath, trustAllHosts, options){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        var ft = new FileTransfer();
        ft.download(sourceUri, destinationPath, function(entry){
          defer.resolve(entry);
        }, function(error){
          defer.reject(error);
        }, trustAllHosts, options);
        return defer.promise;
      });
    }
  }

  /**************************
   *                        *
   *      Browser Mock      *
   *                        *
   **************************/
  ionic.Platform.ready(function(){
    if(!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())){
      if(!window.FileTransfer){
        window.FileTransfer = function(){};
        FileTransfer.prototype.upload = function(filePath, server, successCallback, errorCallback, options, trustAllHosts){
          if(successCallback){ successCallback({}); }
        };
        FileTransfer.prototype.download = function(source, target, successCallback, errorCallback, trustAllHosts, options){
          if(successCallback){ successCallback({}); }
        };
        window.FileUploadOptions = function(){};
      }
    }
  });
})();
