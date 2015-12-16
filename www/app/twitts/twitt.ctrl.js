(function(){
  'use strict';
  angular.module('app')
    .controller('TwittCtrl', TwittCtrl);

  function TwittCtrl($scope, $stateParams, Storage){
    var data = {}, fn = {};
    $scope.data = data;
    $scope.fn = fn;

    Storage.getTwitt($stateParams.id).then(function(twitt){
      data.twitt = twitt;
    });
  }
})();
