angular.module('app')

.controller('AppCtrl', function($scope){
  'use strict';

  $scope.features = [
    {link: 'actionsheet', name: 'Action Sheet'},
    {link: 'slidebox', name: 'Slide Box'},
    {link: 'swipeablecards', name: 'Swipeable Cards'},
    {link: 'chat', name: 'Chat'}
  ];
})

.controller('HomeCtrl', function($scope, $window){
  'use strict';
  // sample here : http://codepen.io/ionic/pen/JsHjf
  $scope.state = {
    showDelete: false,
    showReorder: false
  };

  $scope.deleteFeatures = function(){
    $scope.state.showDelete = !$scope.state.showDelete;
    $scope.state.showReorder = false;
  };
  $scope.reorderFeatures = function(){
    $scope.state.showDelete = false;
    $scope.state.showReorder = !$scope.state.showReorder;
  };

  $scope.edit = function(feature){
    $window.alert('Edit Feature: ' + feature.name);
  };
  $scope.share = function(feature){
    $window.alert('Share Feature: ' + feature.name);
  };

  $scope.moveFeature = function(feature, fromIndex, toIndex){
    $scope.features.splice(fromIndex, 1);
    $scope.features.splice(toIndex, 0, feature);
  };
  $scope.onFeatureDelete = function(feature){
    $scope.features.splice($scope.features.indexOf(feature), 1);
  };
})

.controller('ActionsheetCtrl', function($scope, $ionicActionSheet){
  'use strict';
  // sample here : http://codepen.io/ionic/pen/jLylA
  $scope.showActionsheet = function(){
    $ionicActionSheet.show({
      titleText: 'ActionSheet Example',
      buttons: [
        {text: 'Share <i class="icon ion-share"></i>'},
        {text: 'Move <i class="icon ion-arrow-move"></i>'}
      ],
      destructiveText: 'Delete',
      cancelText: 'Cancel',
      cancel: function(){
        console.log('CANCELLED');
      },
      buttonClicked: function(index){
        console.log('BUTTON CLICKED', index);
        return true;
      },
      destructiveButtonClicked: function(){
        console.log('DESTRUCT');
        return true;
      }
    });
  };
})

.controller('SlideboxCtrl', function($scope, $ionicSlideBoxDelegate){
  'use strict';
  $scope.nextSlide = function(){
    $ionicSlideBoxDelegate.next();
  };
  $scope.slideHasChanged = function(index){
    console.log('slideHasChanged('+index+')');
  };
})

// /!\ DO NOT WORK ACTUALLY :(
.controller('SwipeablecardsCtrl', function($scope){
  'use strict';
  // sample here : http://codepen.io/ionic/pen/skbxh
  var cardTypes = [
    {title: 'Swipe down to clear the card', image: 'images/swipeablecards/pic.png'},
    {title: 'Where is this?', image: 'images/swipeablecards/pic.png'},
    {title: 'What kind of grass is this?', image: 'images/swipeablecards/pic2.png'},
    {title: 'What beach is this?', image: 'images/swipeablecards/pic3.png'},
    {title: 'What kind of clouds are these?', image: 'images/swipeablecards/pic4.png'}
  ];

  $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

  $scope.cardSwiped = function(index){
    // add cart
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  };

  $scope.cardDestroyed = function(index){
    $scope.cards.splice(index, 1);
  };
})

.controller('SwipeablecardCtrl', function($scope, $ionicSwipeCardDelegate){
  'use strict';
  $scope.goAway = function(){
    var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
    card.swipe();
  };
})

.controller('ChatCtrl', function($scope, $ionicScrollDelegate){
  'use strict';
  // sample here : http://codepen.io/ionic/pen/rxysG
  var messageOptions = [
    {content: '<p>Wow, this is really something huh?</p>'},
    {content: '<p>Yea, it\'s pretty sweet</p>'},
    {content: '<p>I think I like Ionic more than I like ice cream!</p>'},
    {content: '<p>Gee wiz, this is something special.</p>'},
    {content: '<img src="images/chat/pic.jpg" alt=""/>'},
    {content: '<p>Is this magic?</p>'},
    {content: '<p>Am I dreaming?</p>'},
    {content: '<img src="images/chat/pic2.jpg" alt=""/>'},
    {content: '<p>Am I dreaming?</p>'},
    {content: '<p>Yea, it\'s pretty sweet</p>'},
    {content: '<p>I think I like Ionic more than I like ice cream!</p>'}
  ];

  var messageIter = 0;
  $scope.messages = messageOptions.slice(0, messageOptions.length);

  $scope.add = function(){
    var nextMessage = messageOptions[messageIter++ % messageOptions.length];
    $scope.messages.push(angular.extend({}, nextMessage));
    $ionicScrollDelegate.scrollBottom(true);
  };
});

