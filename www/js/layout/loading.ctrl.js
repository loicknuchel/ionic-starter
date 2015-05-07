(function(){
  'use strict';
  angular.module('app')
    .controller('LoadingCtrl', MenuCtrl);

  function MenuCtrl($scope, $q, $timeout, $state, AuthSrv){
    var vm = {};
    $scope.vm = vm;
    
    checkWhatYouWant().then(function(res){
      if(res.logged){
        $state.go('app.tabs.twitts');
      } else {
        $state.go('login');
      }
    });
    
    function checkWhatYouWant(){
      // you can check things on your server, get geolocation, preload data...
      var q = $q.defer();
      $timeout(function(){
        q.resolve({
          logged: AuthSrv.isLogged()
        });
      }, 300);
      return q.promise;
    }
  }
})();
