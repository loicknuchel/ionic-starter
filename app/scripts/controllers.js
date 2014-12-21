angular.module('app')

.controller('AppCtrl', function($scope){
  'use strict';
})

.controller('HomeCtrl', function($scope, $window, TwittSrv){
  'use strict';
  // sample here : http://codepen.io/ionic/pen/JsHjf
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
      },
      showReorder: function(){
        userListState.showDelete = false;
        userListState.showReorder = !userListState.showReorder;
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
});

