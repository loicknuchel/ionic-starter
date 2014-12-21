angular.module('app')

.controller('AppCtrl', function($scope){
  'use strict';
})

.controller('TwittsCtrl', function($scope, $window, $ionicPopover, TwittSrv){
  'use strict';
  var data = {}, fn = {};
  $scope.data = data;
  $scope.fn = fn;

  TwittSrv.getAll().then(function(twitts){
    data.twitts = twitts;
  });

  var userListState = {
    showDelete: false,
    showReorder: false
  };
  $scope.userList = {
    state: userListState,
    fn: {
      showDelete: function(){
        userListState.showDelete = !userListState.showDelete;
        userListState.showReorder = false;
        $scope.twittsPopover.hide();
      },
      showReorder: function(){
        userListState.showDelete = false;
        userListState.showReorder = !userListState.showReorder;
        $scope.twittsPopover.hide();
      },
      delete: function(collection, elt){
        collection.splice(collection.indexOf(elt), 1);
      },
      reorder: function(collection, elt, fromIndex, toIndex){
        collection.splice(fromIndex, 1);
        collection.splice(toIndex, 0, elt);
      }
    }
  };

  fn.edit = function(twitt){
    $window.alert('Edit twitt: ' + twitt.content);
  };
  fn.share = function(twitt){
    $window.alert('Share twitt: ' + twitt.content);
  };

  fn.refresh = function(){
    TwittSrv.getAll(true).then(function(twitts){
      data.twitts = twitts;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $ionicPopover.fromTemplateUrl('views/partials/twitt-list-popover.html', {
    scope: $scope
  }).then(function(popover){
    $scope.twittsPopover = popover;
  });
  fn.showOptions = function(event){
    $scope.twittsPopover.show(event);
  };
  $scope.$on('$destroy', function() {
    if($scope.twittsPopover){ $scope.twittsPopover.remove(); }
  });
})

.controller('TwittCtrl', function($state, $stateParams, $scope, $window, TwittSrv){
  'use strict';
  var twittId = $stateParams.twittId;
  var data = {};
  $scope.data = data;

  TwittSrv.get(twittId).then(function(twitt){
    if(twitt){
      data.twitt = twitt;
    } else {
      $state.go('app.twitts');
    }
  });
});

