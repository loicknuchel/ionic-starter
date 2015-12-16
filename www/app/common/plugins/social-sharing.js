(function(){
  'use strict';
  angular.module('app')
    .factory('SocialSharingPlugin', SharingPlugin);

  // for Sharing plugin : https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
  function SharingPlugin($window, $q, $log, PluginUtils){
    var pluginName = 'SocialSharing';
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
  }


  /**************************
   *                        *
   *      Browser Mock      *
   *                        *
   **************************/
  ionic.Platform.ready(function(){
    if(!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())){
      
    }
  });
})();
