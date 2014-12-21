angular.module('app')

.factory('IonicUi', function($ionicModal, $ionicPopover){
  'use strict';
  var service = {
    initModal: initModal,
    initPopover: initPopover
  };

  function initModal($scope, templateUrl){
    var modalObj = null;
    var promise = $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      modalObj = modal;
      return modal;
    });
    $scope.$on('$destroy', function(){
      if(modalObj){ modalObj.remove(); }
    });
    return promise;
  }

  function initPopover($scope, templateUrl){
    var popoverObj = null;
    var promise = $ionicPopover.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(popover){
      popoverObj = popover;
      return popover;
    });
    $scope.$on('$destroy', function(){
      if(popoverObj){ popoverObj.remove(); }
    });
    return promise;
  }
  
  return service;
});
