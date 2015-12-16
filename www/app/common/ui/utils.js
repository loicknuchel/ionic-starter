(function(){
  'use strict';
  angular.module('app')
    .factory('UiUtils', UiUtils);

  function UiUtils($q, $ionicPopup, $ionicActionSheet, ToastPlugin){
    // TODO : queue $ionicPopup to not display more than one at a time
    return {
      confirm: confirm,
      showInfo: showError,
      showError: showError,
      showToast: showToast,
      showOptions: showOptions
    };

    function confirm(message, title, buttons){
      var opts = {};
      if(title)  { opts.title    = title;   }
      if(message){ opts.template = message; }
      opts.cancelText = buttons && buttons.length > 0 ? buttons[0] : 'Non';
      opts.okText     = buttons && buttons.length > 1 ? buttons[1] : 'Oui';
      return $ionicPopup.confirm(opts).then(function(res){
        if(res){ return res; }
        else { return $q.reject(); }
      });
    }

    function showError(message, title, buttons){
      var opts = {};
      if(title)  { opts.title    = title;   }
      if(message){ opts.template = message; }
      opts.okText = buttons && buttons.length > 0 ? buttons[0] : 'Ok';
      return $ionicPopup.alert(opts);
    }

    function showToast(message){
      ToastPlugin.show(message);
    }

    function showOptions(options, title){
      var defer = $q.defer();
      $ionicActionSheet.show({
        titleText: title,
        buttons: options,
        buttonClicked: function(index){
          defer.resolve(options[index]);
          return true;
        },
        cancel: function(){
          defer.reject();
        }
      });
      return defer.promise;
    }
  }
})();
