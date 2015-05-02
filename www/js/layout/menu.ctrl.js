(function(){
  'use strict';
  angular.module('app')
    .controller('MenuCtrl', MenuCtrl);

  function MenuCtrl($scope, $state, AuthSrv){
    var vm = {};
    $scope.vm = vm;

    vm.logout = logout;

    function logout(){
      AuthSrv.logout().then(function(){
        $state.go('login');
      });
    };
  }
})();
