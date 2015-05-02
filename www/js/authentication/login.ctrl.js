(function(){
  'use strict';
  angular.module('app')
    .controller('LoginCtrl', LoginCtrl);

  function LoginCtrl($scope, $state, AuthSrv){
    var vm = {};
    $scope.vm = vm;

    vm.error = null;
    vm.loding = false;
    vm.credentials = {login: '', password: ''};
    vm.login = login;

    function login(credentials){
      vm.error = null;
      vm.loading = true;
      AuthSrv.login(credentials).then(function(){
        $state.go('app.tabs.twitts');
        vm.credentials.password = '';
        vm.error = null;
        vm.loading = false;
      }, function(error){
        vm.credentials.password = '';
        vm.error = error.data && error.data.message ? error.data.message : error.statusText;
        vm.loading = false;
      });
    };
  }
})();
