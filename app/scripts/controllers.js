angular.module('IonicBoilerplate.controllers', [])

.controller('AppCtrl', function($scope) {
  'use strict';

  $scope.features = [
    {link: 'actionsheet', name: 'Action Sheet'}
  ];
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
})

.controller('ActionsheetCtrl', function($scope, $ionicActionSheet) {
  'use strict';
  $scope.showActionsheet = function() {
    $ionicActionSheet.show({
      titleText: 'ActionSheet Example',
      buttons: [
        { text: 'Share <i class="icon ion-share"></i>' },
        { text: 'Move <i class="icon ion-arrow-move"></i>' }
      ],
      destructiveText: 'Delete',
      cancelText: 'Cancel',
      cancel: function() {
        console.log('CANCELLED');
      },
      buttonClicked: function(index){
        console.log('BUTTON CLICKED', index);
        return true;
      },
      destructiveButtonClicked: function(){
        console.log('DESTRUCT');
        return true;
      }
    });
  };
});
