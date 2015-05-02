(function(){
  'use strict';
  angular.module('app')
    .controller('NotificationsCtrl', NotificationsCtrl);

  function NotificationsCtrl($scope, UserSrv, PushPlugin, ToastPlugin){
    var vm = {};
    $scope.vm = vm;

    vm.push = {title: '', message: ''};
    vm.notifications = [];
    vm.sendPush = sendPush;
    activate();

    function activate(){
      // /!\ To use this, you should add Push plugin : ionic plugin add https://github.com/phonegap-build/PushPlugin
      PushPlugin.onNotification(function(notification){
        notification.time = new Date();
        vm.notifications.push(notification);
      });
    }

    function sendPush(infos){
      UserSrv.get().then(function(user){
        PushPlugin.sendPush([user.pushId], infos).then(function(sent){
          if(sent){
            ToastPlugin.show('Notification posted !');
          }
        });
      });
    };
  }
})();
