angular.module('app')

// This is a dummy service to use in demo...
.factory('TwittSrv', function($q, $timeout, Utils){
  'use strict';
  var twitts = [
    {id: Utils.createUuid(), user: 'Venkman', avatar: 'http://ionicframework.com/img/docs/venkman.jpg', content: 'Back off, man. I\'m a scientist.'},
    {id: Utils.createUuid(), user: 'Egon', avatar: 'http://ionicframework.com/img/docs/spengler.jpg', content: 'We\'re gonna go full stream.'},
    {id: Utils.createUuid(), user: 'Ray', avatar: 'http://ionicframework.com/img/docs/stantz.jpg', content: 'Ugly little spud, isn\'t he?'},
    {id: Utils.createUuid(), user: 'Winston', avatar: 'http://ionicframework.com/img/docs/winston.jpg', content: 'That\'s a big Twinkie.'},
    {id: Utils.createUuid(), user: 'Tully', avatar: 'http://ionicframework.com/img/docs/tully.jpg', content: 'Okay, who brought the dog?'},
    {id: Utils.createUuid(), user: 'Dana', avatar: 'http://ionicframework.com/img/docs/barrett.jpg', content: 'I am The Gatekeeper!'},
    {id: Utils.createUuid(), user: 'Slimer', avatar: 'http://ionicframework.com/img/docs/slimer.jpg', content: 'Boo!'},
    {id: Utils.createUuid(), user: 'Loïc', avatar: 'https://pbs.twimg.com/profile_images/3133057797/81ea4e63c7078eec0a7c7d6ae57a3ce1.jpeg', content: 'Really nice, isn\'t it ?'}
  ];

  var service = {
    getAll: function(addOne){
      return asyncTmp(function(){
        if(addOne){
          twitts.unshift(createRandomTwitt());
        }
        return twitts;
      });
    },
    get: function(id){
      return asyncTmp(function(){
        return _.find(twitts, {id: id});
      });
    },
    save: function(twitt){
      return asyncTmp(function(){
        var newTwitt = {};
        newTwitt.id = Utils.createUuid();
        newTwitt.user = twitt.user;
        newTwitt.avatar = 'http://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png';
        newTwitt.content = twitt.content;
        twitts.unshift(newTwitt);
      });
    }
  };

  function createRandomTwitt(){
    var newTwitt = angular.copy(twitts[Math.floor(Math.random() * twitts.length)]);
    newTwitt.id = Utils.createUuid();
    return newTwitt;
  }

  function asyncTmp(fn){
    var defer = $q.defer();
    $timeout(function(){
      defer.resolve(fn());
    }, 1000);
    return defer.promise;
  }

  return service;
});
