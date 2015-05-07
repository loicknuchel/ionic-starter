(function(){
  'use strict';
  angular.module('app')
    .controller('TwittsCtrl', TwittsCtrl);

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
    activate();

    function activate(){
      TwittSrv.getAll().then(function(twitts){
        vm.twitts = twitts;
      });

      $ionicPopover.fromTemplateUrl('js/twitts/partials/twitts-options-popover.html', {
        scope: $scope
      }).then(function(popover){
        ui.twittsPopover = popover;
      });
      $ionicModal.fromTemplateUrl('js/twitts/partials/send-twitt-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        ui.sendTwittModal = modal;
      });
      $scope.$on('$destroy', function(){
        if(ui.twittsPopover){ ui.twittsPopover.remove(); }
        if(ui.sendTwittModal){ ui.sendTwittModal.remove(); }
      });
    }

    function edit(twitt){
      $window.alert('Edit twitt: ' + twitt.content);
    }
    function share(twitt){
      $window.alert('Share twitt: ' + twitt.content);
    }
    function refresh(){
      TwittSrv.getAll().then(function(twitts){
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
      TwittSrv.save(form).then(function(newTwitt){
        if(vm.twitts){ vm.twitts.unshift(newTwitt); }
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
})();
