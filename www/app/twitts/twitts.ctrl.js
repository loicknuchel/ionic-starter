(function(){
  'use strict';
  angular.module('app')
    .controller('TwittsCtrl', TwittsCtrl);

  function TwittsCtrl($scope, Storage, Backend){
    var data = {}, fn = {};
    $scope.data = data;
    $scope.fn = fn;

    $scope.$on('$ionicView.enter', function(){
      Storage.getTwitts().then(function(twitts){
        data.twitts = twitts;
        Backend.getTwitts().then(function(twitts){
          data.twitts = twitts;
        });
      });
    });
  }
})();
