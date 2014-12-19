angular.module('app')

.controller('AppCtrl', function($scope){
  'use strict';
})

.controller('HomeCtrl', function($scope, $window){
  'use strict';
  // sample here : http://codepen.io/ionic/pen/JsHjf
  var data = {}, fn = {};
  $scope.data = data;
  $scope.fn = fn;

  data.users = [
    {name: 'Loïc Knuchel'},
    {name: 'John Doe'},
    {name: 'Alphonse Caouette'},
    {name: 'Honoré Charette'},
    {name: 'Audrey Boulanger'}
  ];

  data.state = {
    showDelete: false,
    showReorder: false
  };

  fn.showReorder = function(){
    data.state.showDelete = false;
    data.state.showReorder = !data.state.showReorder;
  };
  fn.showDelete = function(){
    data.state.showDelete = !data.state.showDelete;
    data.state.showReorder = false;
  };

  fn.delete = function(user){
    data.users.splice(data.users.indexOf(user), 1);
  };
  fn.edit = function(user){
    $window.alert('Edit user: ' + user.name);
  };
  fn.share = function(user){
    $window.alert('Share user: ' + user.name);
  };
  fn.move = function(user, fromIndex, toIndex){
    data.users.splice(fromIndex, 1);
    data.users.splice(toIndex, 0, user);
  };
});

