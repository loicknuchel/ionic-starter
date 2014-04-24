angular.module('IonicBoilerplate.controllers', [])

.controller('AppCtrl', function($scope) {
  'use strict';

})

.controller('PlaylistsCtrl', function($scope) {
  'use strict';
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
  'use strict';

});
