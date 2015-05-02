(function(){
  'use strict';
  angular.module('app')
    .controller('TabsCtrl', TabsCtrl);

  function TabsCtrl($scope, PushPlugin){
    var vm = {};
    $scope.vm = vm;

    vm.notifCount = 0;
    activate();

    function activate(){
      // /!\ To use this, you should add Push plugin : ionic plugin add https://github.com/phonegap-build/PushPlugin
      PushPlugin.onNotification(function(notification){
        vm.notifCount++;
      });
    }
  }
})();
