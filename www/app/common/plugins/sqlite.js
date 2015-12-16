(function(){
  'use strict';
  angular.module('app')
    .factory('SQLitePlugin', SQLitePlugin);

  // for SQLite plugin : cordova-sqlite-storage (https://github.com/litehelpers/Cordova-sqlite-storage)
  function SQLitePlugin($window, $q, $log, PluginUtils){
    var pluginName = 'SQLite';
    var pluginTest = function(){ return $window.sqlitePlugin || $window.openDatabase; };
    // https://github.com/litehelpers/Cordova-sqlite-storage#opening-a-database
    var Location = {
      Documents: 0, // (default) visible to iTunes and backed up by iCloud
      Library: 1, // backed up by iCloud, NOT visible to iTunes
      LocalDatabase: 2 // NOT visible to iTunes and NOT backed up by iCloud
    }
    return {
      open: open,
      query: query
    };

    function open(options){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var opts = angular.extend({
          name: 'my.db',
          location: Location.Documents
        }, options);
        var defer = $q.defer();
        if(window.sqlitePlugin){
          $window.sqlitePlugin.openDatabase(opts, function(db){
            defer.resolve(db);
          }, function(error){
            $log.error('pluginError:'+pluginName, error);
            defer.reject(error);
          });
        } else {
          $log.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');
          var db = window.openDatabase(opts.name, '1.0', 'database', 5 * 1024 * 1024);
          defer.resolve(db);
        }
        return defer.promise;
      });
    }

    function query(db, query, args){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        db.transaction(function(tx){
          tx.executeSql(query, args || [], function(tx, res){
            var data = [];
            for(var i=0; i<res.rows.length; i++){
              data.push(res.rows.item(i));
            }
            // console.log(query+' : '+JSON.stringify(args), data);
            defer.resolve(data);
          }, function(error){
            // console.log('ERROR '+query, error);
            defer.reject(error);
          });
        }, function(error){
          // console.log('transaction error', error);
        }, function(){
          // console.log('transaction ok');
        });
        return defer.promise;
      });
    }
  }


  /**************************
   *                        *
   *      Browser Mock      *
   *                        *
   **************************/
  ionic.Platform.ready(function(){
    if(!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())){
      // useless, use WebSQL in browser \o/
    }
  });
})();
