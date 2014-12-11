angular.module('app')

.directive('noScroll', function($document) {
  'use strict';
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  };
});