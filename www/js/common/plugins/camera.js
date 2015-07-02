(function(){
  'use strict';
  angular.module('app')
    .factory('CameraPlugin', CameraPlugin);

  // for Camera plugin : org.apache.cordova.camera (https://github.com/apache/cordova-plugin-camera)
  function CameraPlugin($window, $q, $log, PluginUtils){
    var pluginName = 'Camera';
    var pluginTest = function(){ return $window.navigator && $window.navigator.camera; };
    var service = {
      getPicture: _getPicture,
      takePicture: takePicture,
      findPicture: findPicture
    };

    var defaultOpts = {
      quality : 75, // between 0-100 (default: 50)
      destinationType : $window.Camera.DestinationType.FILE_URI, // Type of result (default: FILE_URI)
      sourceType : $window.Camera.PictureSourceType.CAMERA, // Source of the picture (default: CAMERA)
      allowEdit : false,
      encodingType: $window.Camera.EncodingType.JPEG, // (default: JPEG)
      // targetWidth: 100,
      // targetHeight: 100,
      mediaType: $window.Camera.MediaType.PICTURE, // (default: PICTURE)
      cameraDirection: $window.Camera.Direction.BACK, // (default: BACK)
      correctOrientation: true, // rotate the image to correct for the orientation of the device during capture
      saveToPhotoAlbum: false
    };

    function _getPicture(_opts){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var opts = angular.extend(defaultOpts, _opts);
        var defer = $q.defer();
        $window.navigator.camera.getPicture(function(picture){
          defer.resolve(picture);
        }, function(error){
          $log.error('pluginError:'+pluginName, error);
          defer.reject(error);
        }, opts);
        return defer.promise;
      });
    }

    function takePicture(){
      return _getPicture({});
    }

    function findPicture(){
      return _getPicture({sourceType: $window.Camera.PictureSourceType.PHOTOLIBRARY});
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
      if(!window.navigator){window.navigator = {};}
      if(!window.navigator.camera){
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
      }
    }
  });
})();
