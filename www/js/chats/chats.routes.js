(function(){
  'use strict';
  angular.module('app')
    .config(configure);

  function configure($stateProvider){
    $stateProvider
      .state('app.tabs.chat', {
      url: '/chat',
      views: {
        'chat-tab': {
          templateUrl: 'js/chats/chats.html',
          controller: 'ChatsCtrl'
        }
      }
    });
  }
})();
