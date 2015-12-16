(function(){
  'use strict';
  angular.module('app')
    .controller('SettingsCtrl', SettingsCtrl);

  function SettingsCtrl($scope, Storage, UiUtils, resolvedSettings){
    var fn = {}, data = {};
    $scope.fn = fn;
    $scope.data = data;

    data.settings = resolvedSettings;

    $scope.$watch('data.settings', function(settings, oldSettings){
      if(settings && oldSettings && !angular.equals(settings, oldSettings)){
        Storage.setUserSettings(settings).then(function(){
          UiUtils.showToast('Paramètres enregistrés');
        });
      }
    }, true);
  }
})();
