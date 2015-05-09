(function(){
  'use strict';
  angular.module('app')
    .factory('IonicUtils', IonicUtils);

  IonicUtils.$inject = ['$ionicLoading', '$ionicScrollDelegate', '$ionicPosition'];
  function IonicUtils($ionicLoading, $ionicScrollDelegate, $ionicPosition){
    var service = {
      withLoading: withLoading,
      scrollTo: scrollTo
    };
    return service;

    function withLoading(promise){
      $ionicLoading.show();
      return promise.then(function(res){
        return res;
      }).finally(function(){
        $ionicLoading.hide();
      });
    }

    function scrollTo(className, _shouldAnimate){
      var elt = document.getElementsByClassName(className);
      if(elt){
        var scrollElt = _getParentWithClass(angular.element(elt), 'scroll-content');
        if(scrollElt){
          try {
            var eltOffset = $ionicPosition.offset(elt); // get an error when element is not visible :(
            var scrollOffset = $ionicPosition.offset(scrollElt);
            var handle = scrollElt.attr('delegate-handle');
            var $scroll = handle ? $ionicScrollDelegate.$getByHandle(handle) : $ionicScrollDelegate;
            var scroll = $scroll.getScrollPosition();
            $scroll.scrollTo(scroll.left, eltOffset.top-scrollOffset.top, _shouldAnimate);
          } catch(e){
            console.warn('scrollTo('+className+') error :(', e);
          }
        } else {
          console.warn('Parent element with class <scroll-content> not found !');
        }
      } else {
        console.warn('Element with class <'+className+'> not found !');
      }
    }

    // because  ionic.DomUtil.getParentWithClass(elt, 'scroll-content') doesn't seems to work :(
    function _getParentWithClass(elt, className, _maxDeep){
      if(_maxDeep === undefined){ _maxDeep = 10; }
      var parent = elt.parent();
      if(parent.hasClass(className)){ return parent; }
      else if(_maxDeep > 0){ return _getParentWithClass(parent, className, _maxDeep-1); }
      else { return null; }
    }
  }
})();
