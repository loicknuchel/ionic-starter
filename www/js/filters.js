angular.module('app')

.filter('date', function(Utils){
  'use strict';
  return function(date, format){
    var jsDate = Utils.toDate(date);
    return jsDate ? moment(jsDate).format(format ? format : 'll') : '<date>';
  };
})

.filter('datetime', function(Utils){
  'use strict';
  return function(date, format){
    var jsDate = Utils.toDate(date);
    return jsDate ? moment(jsDate).format(format ? format : 'D MMM YYYY, HH:mm:ss') : '<datetime>';
  };
})

.filter('time', function(Utils){
  'use strict';
  return function(date, format){
    var jsDate = Utils.toDate(date);
    return jsDate ? moment(jsDate).format(format ? format : 'LT') : '<time>';
  };
})

.filter('humanTime', function(Utils){
  'use strict';
  return function(date){
    var jsDate = Utils.toDate(date);
    return jsDate ? moment(jsDate).fromNow(true) : '<humanTime>';
  };
})

.filter('duration', function($log){
  'use strict';
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
})

.filter('mynumber', function($filter){
  'use strict';
  return function(number, round){
    var mul = Math.pow(10, round ? round : 0);
    return $filter('number')(Math.round(number*mul)/mul);
  };
})

.filter('rating', function($filter){
  'use strict';
  return function(rating, max, withText){
    var stars = rating ? new Array(Math.floor(rating)+1).join('★') : '';
    var maxStars = max ? new Array(Math.floor(max)-Math.floor(rating)+1).join('☆') : '';
    var text = withText ? ' ('+$filter('mynumber')(rating, 1)+' / '+$filter('mynumber')(max, 1)+')' : '';
    return stars+maxStars+text;
  };
});
