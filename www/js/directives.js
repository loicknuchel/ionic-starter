(function(){
  'use strict';
  angular.module('app')
    .directive('href', href)
    .directive('debounce', debounce)
    .directive('blurOnKeyboardOut', blurOnKeyboardOut)
    .directive('focusOnKeyboardOpen', focusOnKeyboardOpen);

  // open external links (starting with http:// or https://) outside the app
  function href($window){
    var externePrefixes = ['http:', 'https:', 'tel:', 'sms:'];
    function isExterneUrl(url){
      if(url){
        for(var i in externePrefixes){
          if(url.indexOf(externePrefixes[i]) === 0){
            return true;
          }
        }
      }
      return false;
    }

    return {
      restrict: 'A',
      scope: {
        url: '@href'
      },
      link: function(scope, element, attrs){
        if(isExterneUrl(scope.url)){
          element.bind('click', function(e){
            e.preventDefault();
            // require cordova plugin org.apache.cordova.inappbrowser
            $window.open(encodeURI(scope.url), '_system', 'location=yes');
          });
        }
      }
    };
  }

  function debounce($timeout){
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 99,
      link: function(scope, element, attr, ngModelCtrl){
        if(attr.type === 'radio' || attr.type === 'checkbox'){ return; }

        var debounce;
        element.unbind('input');
        element.bind('input', function(){
          $timeout.cancel(debounce);
          debounce = $timeout(function(){
            scope.$apply(function(){
              ngModelCtrl.$setViewValue(element.val());
            });
          }, attr.ngDebounce || 1000);
        });
        element.bind('blur', function(){
          scope.$apply(function(){
            ngModelCtrl.$setViewValue(element.val());
          });
        });
      }
    };
  }

  function blurOnKeyboardOut($window){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        // require cordova plugin https://github.com/driftyco/ionic-plugins-keyboard
        $window.addEventListener('native.keyboardhide', function(e){
          element[0].blur();
          scope.safeApply(function(){
            scope.$eval(attrs.blurOnKeyboardOut);
          });
        });
      }
    };
  }

  // keep focus on input while keyboard is open
  function focusOnKeyboardOpen($window){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        var keyboardOpen = false;
        // require cordova plugin https://github.com/driftyco/ionic-plugins-keyboard
        $window.addEventListener('native.keyboardshow', function(e){
          keyboardOpen = true;
          element[0].focus();
        });
        $window.addEventListener('native.keyboardhide', function(e){
          keyboardOpen = false;
          element[0].blur();
        });

        element[0].addEventListener('blur', function(e){
          if(keyboardOpen){
            element[0].focus();
          }
        }, true);
      }
    };
  }
})();
