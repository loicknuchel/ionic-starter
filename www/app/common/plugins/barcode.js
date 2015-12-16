(function(){
  'use strict';
  angular.module('app')
    .factory('BarcodePlugin', BarcodePlugin);

  // for Barcode plugin : phonegap-plugin-barcodescanner (https://github.com/phonegap/phonegap-plugin-barcodescanner)
  function BarcodePlugin($window, $q, $log, PluginUtils){
    var pluginName = 'Barcode';
    var pluginTest = function(){ return $window.cordova && $window.cordova.plugins && $window.cordova.plugins.barcodeScanner; };
    var lock = false; // to prevent starting scan twice
    return {
      scan: scan,
      encode: encode
    };

    function scan(){
      if(!lock){
        lock = true;
        return PluginUtils.onReady(pluginName, pluginTest).then(function(){
          var defer = $q.defer();
          $window.cordova.plugins.barcodeScanner.scan(function(result){
            lock = false;
            defer.resolve(result);
          }, function(error){
            $log.error('pluginError:'+pluginName, error);
            lock = false;
            defer.reject(error);
          });
          return defer.promise;
        });
      } else {
        $log.warn(pluginName+' is locked');
        return $q.reject();
      }
    }
    
    function encode(type, data){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        $window.cordova.plugins.barcodeScanner.encode(type, data, function(result){
          defer.resolve(result);
        }, function(error){
          $log.error('pluginError:'+pluginName, error);
          defer.reject(error);
        });
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
      if(!window.cordova){window.cordova = {};}
      if(!window.cordova.plugins){window.cordova.plugins = {};}
      if(!window.cordova.plugins.barcodeScanner){
        window.cordova.plugins.barcodeScanner = {
          Encode: {
            EMAIL_TYPE: 'EMAIL_TYPE',
            PHONE_TYPE: 'PHONE_TYPE',
            SMS_TYPE: 'SMS_TYPE',
            TEXT_TYPE: 'TEXT_TYPE'
          },
          format: {
            all_1D: 61918,
            aztec: 1,
            codabar: 2,
            code_39: 4,
            code_93: 8,
            code_128: 16,
            data_MATRIX: 32,
            ean_8: 64,
            ean_13: 128,
            itf: 256,
            maxicode: 512,
            msi: 131072,
            pdf_417: 1024,
            plessey: 262144,
            qr_CODE: 2048,
            rss_14: 4096,
            rss_EXPANDED: 8192,
            upc_A: 16384,
            upc_E: 32768,
            upc_EAN_EXTENSION: 65536
          },
          scan: function(success, fail){
            var text = window.prompt('Texte :');
            if(success){
              if(text){ success({text: text, format: 'QR_CODE', cancelled: false}); }
              else { success({text: '', format: '', cancelled: true}); }
            }
          },
          encode: function(type, data, success, fail){
            alert('barcodeScanner.encode() not implemented !');
            success({});
          }
        };
      }
    }
  });
})();
