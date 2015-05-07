(function(){
  'use strict';
  angular.module('app')
    .controller('LoadingCtrl', LoadingCtrl);

  function LoadingCtrl($scope, $q, $timeout, $state, AuthSrv){
    var vm = {};
    $scope.vm = vm;

    $scope.$on('$ionicView.enter', function(viewInfo){
      redirect();
    });

    function redirect(){
      $timeout(function(){
        if(AuthSrv.isLogged()){
          $state.go('app.tabs.twitts');
        } else {
          $state.go('login');
        }
      }, 300);
    }
  }
})();
