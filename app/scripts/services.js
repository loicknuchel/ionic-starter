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
})

.factory('LogSrv', function(){
  'use strict';
  var service = {
    track:      track,
    trackError: function(type, error) { track('error', {type: type, error: error}); }
  };

  function track(name, data, _time){
    var event = {};
    if(data)  { event.data = data;  }
    if(_time) { event.time = _time; }
    Logger.track(name, event);
  }

  return service;
});
