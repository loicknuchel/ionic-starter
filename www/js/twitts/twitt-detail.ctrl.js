(function(){
  'use strict';
  angular.module('app')
    .controller('TwittCtrl', TwittCtrl);

  function TwittCtrl($state, $stateParams, $scope, $window, TwittSrv){
    var twittId = $stateParams.twittId;
    var vm = {};
    $scope.vm = vm;

    vm.twitt = undefined;
    activate();

    function activate(){
      TwittSrv.get(twittId).then(function(twitt){
        if(twitt){
          vm.twitt = twitt;
        } else {
          $state.go('app.tabs.twitts');
        }
      });
    }
  }
})();
