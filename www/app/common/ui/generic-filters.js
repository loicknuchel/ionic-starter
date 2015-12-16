(function(){
  'use strict';
  angular.module('app')
    .filter('date', formatDate)
    .filter('time', formatTime)
    .filter('datetime', formatDatetime)
    .filter('reverse', reverseArray)
    .filter('with', withArray)
    .filter('inSlicesOf', filterInSlicesOf);

  function formatDate(){
    return function(date, format){
      var mDate = moment(date);
      if(date && mDate.isValid()){
        return mDate.format(format ? format : 'D MMMM YYYY');
      } else {
        return date;
      }
    }
  }

  function formatTime(){
    return function(date, format){
      var mDate = moment(date);
      if(date && mDate.isValid()){
        return mDate.format(format ? format : 'HH:mm');
      } else {
        return date;
      }
    }
  }

  function formatDatetime(){
    return function(date, format){
      var mDate = moment(date);
      if(date && mDate.isValid()){
        return mDate.format(format ? format : 'DD/MM/YYYY HH:mm');
      } else {
        return date;
      }
    }
  }

  function reverseArray(){
    return function(items){
      return items.slice().reverse();
    };
  }

  function withArray(){
    return function(items, items2){
      return items.concat(items2);
    };
  }

  function filterInSlicesOf($rootScope){
    return function(items, count){
      if(!angular.isArray(items) && !angular.isString(items)) return items;
      if(!count){ count = 3; }
      var array = [];
      for(var i = 0; i < items.length; i++){
        var chunkIndex = parseInt(i / count, 10);
        var isFirst = (i % count === 0);
        if(isFirst){ array[chunkIndex] = []; }
        array[chunkIndex].push(items[i]);
      }

      if(angular.equals($rootScope.arrayinSliceOf, array)){
        return $rootScope.arrayinSliceOf;
      } else {
        $rootScope.arrayinSliceOf = array;
      }

      return array;
    };
  }
})();
