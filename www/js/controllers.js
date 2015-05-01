(function(){
  'use strict';
  angular.module('app')
    .controller('LoginCtrl', LoginCtrl)
    .controller('AppCtrl', AppCtrl)
    .controller('TabsCtrl', TabsCtrl)
    .controller('TwittsCtrl', TwittsCtrl)
    .controller('TwittCtrl', TwittCtrl)
    .controller('ChatCtrl', function(){})
    .controller('NotifsCtrl', NotifsCtrl);

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

  function AppCtrl($scope, $state, AuthSrv){
    var vm = {};
    $scope.vm = vm;

    vm.logout = logout;

    function logout(){
      AuthSrv.logout().then(function(){
        $state.go('login');
      });
    };
  }

  function TabsCtrl($scope, PushPlugin){
    var vm = {};
    $scope.vm = vm;

    vm.notifCount = 0;

    // /!\ To use this, you should add Push plugin : ionic plugin add https://github.com/phonegap-build/PushPlugin
    PushPlugin.onNotification(function(notification){
      vm.notifCount++;
    });
  }

  function TwittsCtrl($scope, $window, $ionicModal, $ionicPopover, $ionicActionSheet, $log, TwittSrv){
    var vm = {};
    $scope.vm = vm;

    vm.isListShowDelete = false;
    vm.isListShowReorder = false;
    vm.twitts = undefined;
    vm.edit = edit;
    vm.share = share;
    vm.refresh = refresh;
    vm.moreOptions = moreOptions;
    vm.showOptions = showOptions;
    vm.writeTwitt = writeTwitt;
    vm.sendTwitt = sendTwitt;
    vm.cancelSendTwitt = cancelSendTwitt;
    vm.listShowDelete = listShowDelete;
    vm.listShowReorder = listShowReorder;
    vm.listHideAll = listHideAll;
    vm.listDelete = listDelete;
    vm.listReorder = listReorder;

    var ui = {};
    $ionicPopover.fromTemplateUrl('views/partials/twitts-options-popover.html', {
      scope: $scope
    }).then(function(popover){
      ui.twittsPopover = popover;
    });
    $ionicModal.fromTemplateUrl('views/partials/send-twitt-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      ui.sendTwittModal = modal;
    });
    $scope.$on('$destroy', function(){
      if(ui.twittsPopover){ ui.twittsPopover.remove(); }
      if(ui.sendTwittModal){ ui.sendTwittModal.remove(); }
    });

    TwittSrv.getAll().then(function(twitts){
      vm.twitts = twitts;
    });

    function edit(twitt){
      $window.alert('Edit twitt: ' + twitt.content);
    }
    function share(twitt){
      $window.alert('Share twitt: ' + twitt.content);
    }
    function refresh(){
      TwittSrv.getAll(true).then(function(twitts){
        vm.twitts = twitts;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    function moreOptions(twitt){
      $ionicActionSheet.show({
        titleText: 'Options for '+twitt.user+'\'s twitt',
        buttons: [
          {text: 'Share <i class="icon ion-share"></i>'}
        ],
        buttonClicked: function(index){
          if(index === 0) { vm.share(twitt);                          }
          else            { $log.warn('Unknown button index', index); }
          return true;
        },
        destructiveText: 'Delete',
        destructiveButtonClicked: function(){
          vm.listDelete(vm.twitts, twitt);
          return true;
        },
        cancelText: 'Cancel',
        cancel: function(){}
      });
    }
    function showOptions(event){
      ui.twittsPopover.show(event);
    }
    function writeTwitt(){
      ui.sendTwittModal.show();
    }
    function sendTwitt(form){
      form.saving = true;
      TwittSrv.save(form).then(function(){
        ui.sendTwittModal.hide();
        form.content = '';
        form.saving = false;
      });
    }
    function cancelSendTwitt(){
      ui.sendTwittModal.hide();
    }
    function listShowDelete(){
      vm.isListShowDelete = !vm.isListShowDelete;
      vm.isListShowReorder = false;
      ui.twittsPopover.hide();
    }
    function listShowReorder(){
      vm.isListShowDelete = false;
      vm.isListShowReorder = !vm.isListShowReorder;
      ui.twittsPopover.hide();
    }
    function listHideAll(){
      vm.isListShowDelete = false;
      vm.isListShowReorder = false;
    }
    function listDelete(collection, elt){
      collection.splice(collection.indexOf(elt), 1);
    }
    function listReorder(collection, elt, fromIndex, toIndex){
      collection.splice(fromIndex, 1);
      collection.splice(toIndex, 0, elt);
    }
  }

  function TwittCtrl($state, $stateParams, $scope, $window, TwittSrv){
    var twittId = $stateParams.twittId;
    var vm = {};
    $scope.vm = vm;

    vm.twitt = undefined;

    TwittSrv.get(twittId).then(function(twitt){
      if(twitt){
        vm.twitt = twitt;
      } else {
        $state.go('app.tabs.twitts');
      }
    });
  }

  function NotifsCtrl($scope, UserSrv, PushPlugin, ToastPlugin){
    var vm = {};
    $scope.vm = vm;

    vm.push = {title: '', message: ''};
    vm.notifications = [];
    vm.sendPush = sendPush;

    // /!\ To use this, you should add Push plugin : ionic plugin add https://github.com/phonegap-build/PushPlugin
    PushPlugin.onNotification(function(notification){
      notification.time = new Date();
      vm.notifications.push(notification);
    });

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
