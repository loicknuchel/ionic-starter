(function(){
  'use strict';
  angular.module('app')
    .config(configure);

  function configure($stateProvider){
    $stateProvider
      .state('app.tabs.notifs', {
      url: '/notifs',
      views: {
        'notifs-tab': {
          templateUrl: 'js/notifications/notifications.html',
          controller: 'NotificationsCtrl'
        }
      }
    });
  }
})();
