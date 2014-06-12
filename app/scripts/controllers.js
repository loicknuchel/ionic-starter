angular.module('IonicBoilerplate.controllers', [])

.controller('AppCtrl', function($scope) {
  'use strict';

})

.controller('HomeCtrl', function($scope) {
  'use strict';
  $scope.state = {
    showDelete: false,
    showReorder: false
  };
  
  $scope.deleteFeatures = function(){
    $scope.state.showDelete = !$scope.state.showDelete;
    $scope.state.showReorder = false;
  };
  $scope.reorderFeatures = function(){
    $scope.state.showDelete = false;
    $scope.state.showReorder = !$scope.state.showReorder;
  };

  $scope.edit = function(feature) {
    alert('Edit Feature: ' + feature.name);
  };
  $scope.share = function(feature) {
    alert('Share Feature: ' + feature.name);
  };

  $scope.moveFeature = function(feature, fromIndex, toIndex) {
    $scope.features.splice(fromIndex, 1);
    $scope.features.splice(toIndex, 0, feature);
  };
  $scope.onFeatureDelete = function(feature) {
    $scope.features.splice($scope.features.indexOf(feature), 1);
  };
  
  $scope.features = [
    {link: 'aaa', name: 'Slide box'}
  ];
});
