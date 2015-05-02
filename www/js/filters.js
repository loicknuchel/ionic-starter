(function(){
  'use strict';
  angular.module('app')
    .filter('date', date)
    .filter('datetime', datetime)
    .filter('time', time)
    .filter('humanTime', humanTime)
    .filter('duration', duration)
    .filter('mynumber', mynumber)
    .filter('rating', rating);

  function date(Utils, moment){
    return function(date, format){
      var jsDate = Utils.toDate(date);
      return jsDate ? moment(jsDate).format(format ? format : 'll') : '<date>';
    };
  }

  function datetime(Utils, moment){
    return function(date, format){
      var jsDate = Utils.toDate(date);
      return jsDate ? moment(jsDate).format(format ? format : 'D MMM YYYY, HH:mm:ss') : '<datetime>';
    };
  }

  function time(Utils, moment){
    return function(date, format){
      var jsDate = Utils.toDate(date);
      return jsDate ? moment(jsDate).format(format ? format : 'LT') : '<time>';
    };
  }

  function humanTime(Utils, moment){
    return function(date){
      var jsDate = Utils.toDate(date);
      return jsDate ? moment(jsDate).fromNow(true) : '<humanTime>';
    };
  }

  function duration($log, moment){
    return function(seconds, humanize){
      if(seconds || seconds === 0){
        if(humanize){
          return moment.duration(seconds, 'seconds').humanize();
        } else {
          var prefix = -60 < seconds && seconds < 60 ? '00:' : '';
          return prefix + moment.duration(seconds, 'seconds').format('hh:mm:ss');
        }
      } else {
        $log.warn('Unable to format duration', seconds);
        return '<duration>';
      }
    };
  }

  function mynumber($filter){
    return function(number, round){
      var mul = Math.pow(10, round ? round : 0);
      return $filter('number')(Math.round(number*mul)/mul);
    };
  }

  function rating($filter){
    return function(rating, max, withText){
      var stars = rating ? new Array(Math.floor(rating)+1).join('★') : '';
      var maxStars = max ? new Array(Math.floor(max)-Math.floor(rating)+1).join('☆') : '';
      var text = withText ? ' ('+$filter('mynumber')(rating, 1)+' / '+$filter('mynumber')(max, 1)+')' : '';
      return stars+maxStars+text;
    };
  }
})();
