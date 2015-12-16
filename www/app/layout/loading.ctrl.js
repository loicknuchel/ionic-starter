(function(){
  'use strict';
  angular.module('app')
    .controller('LoadingCtrl', LoadingCtrl);

  function LoadingCtrl($state, $ionicHistory, Storage){
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    Storage.getUser().then(function(user){
      if(user){
        $state.go('app.twitts');
      } else {
        $state.go('login');
      }
    });
  }
})();
