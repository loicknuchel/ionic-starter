(function(){
  'use strict';
  angular.module('app')
    .factory('FilePlugin', FilePlugin)
    .filter('fullPath', fullPathFilter);

  // for File plugin : cordova-plugin-file (https://github.com/apache/cordova-plugin-file)
  function FilePlugin($window, $q, $log, PluginUtils){
    var pluginName = 'File';
    var pluginTest = function(){ return $window.cordova && $window.cordova.file; };
    // https://developer.mozilla.org/fr/docs/Web/API/FileError
    var ERR_CODE = {
      '1': 'NOT_FOUND_ERR',
      '2': 'SECURITY_ERR',
      '4': 'NOT_READABLE_ERR',
      '5': 'ENCODING_ERR',
      '6': 'NO_MODIFICATION_ALLOWED_ERR',
      '7': 'INVALID_STATE_ERR',
      '9': 'INVALID_MODIFICATION_ERR',
      '10': 'QUOTA_EXCEEDED_ERR',
      '11': 'TYPE_MISMATCH_ERR',
      '12': 'PATH_EXISTS_ERR'
    };
    return {
      getFullPath: getFullPath,
      getFileEntry: getFileEntry,
      getContent: getContent,
      getContentTree: getContentTree,
      getFile: getFile,
      getFileBinary: getFileBinary,
      getFileBase64: getFileBase64,
      createFolder: createFolder,
      createFile: createFile,
      copyFile: copyFile,
      removeFile: removeFile,
      removeFiles: removeFiles,
      removeFolder: removeFolder,
      removeFolders: removeFolders,
      clear: clear
    };

    function getFullPath(path, fileLocation){
      if(fileLocation === undefined){
        if(path.startsWith('file://') || path.startsWith('content://')){
          return path;
        } else {
          return $window.cordova.file.dataDirectory + path;
        }
      } else {
        return fileLocation + path;
      }
    }

    function getFileEntry(path, fileLocation){
      return PluginUtils.onReady(pluginName, pluginTest).then(function(){
        var defer = $q.defer();
        var fullPath = getFullPath(path, fileLocation);
        $window.resolveLocalFileSystemURL(fullPath, function(fileEntry){
          defer.resolve(fileEntry);
        }, function(error){
          if(!error){ error = {}; }
          error.path = fullPath;
          if(error.code){ error.message = ERR_CODE[error.code]; }
          $log.error('pluginError:'+pluginName, error);
          defer.reject(error);
        });
        return defer.promise;
      });
    }

    function getContent(path, fileLocation){
      return getFileEntry(path, fileLocation).then(function(dirEntry){
        if(dirEntry.isDirectory){
          return _getContent(dirEntry);
        } else {
          return $q.reject({message: 'Path "'+path+'" is not a directory !'});
        }
      });
    }
    function _getContent(dirEntry){
      var defer = $q.defer();
      var dirReader = dirEntry.createReader();
      dirReader.readEntries(function(entries){
        defer.resolve(entries);
      }, function(err){
        defer.reject(err);
      });
      return defer.promise;
    }

    function getContentTree(path, fileLocation){
      return getFileEntry(path, fileLocation).then(function(fileEntry){
        return _getContentTree(fileEntry, {});
      });
    }
    function _getContentTree(fileEntry, tree){
      if(fileEntry.isFile){
        tree.entry = fileEntry;
        tree.children = [];
        return $q.when(tree);
      } else {
        return _getContent(fileEntry).then(function(childEntries){
          return $q.all(childEntries.map(function(child){
            return _getContentTree(child, {});
          })).then(function(children){
            tree.entry = fileEntry;
            tree.children = children;
            return tree;
          });
        });
      }
    }

    function getFile(path, fileLocation){
      return getFileEntry(path, fileLocation).then(function(fileEntry){
        var defer = $q.defer();
        fileEntry.file(function(file){
          defer.resolve(file);
        });
        return defer.promise;
      });
    }

    function getFileBinary(path, fileLocation){
      return getFile(path, fileLocation).then(function(file){
        var defer = $q.defer();
        var reader = new FileReader();
        reader.onloadend = function(evt){
          var binary = evt.target.result;
          defer.resolve(binary);
        };
        reader.readAsBinaryString(file);
        return defer.promise;
      });
    }

    function getFileBase64(path, fileLocation){
      return getFile(path, fileLocation).then(function(file){
        var defer = $q.defer();
        var reader = new FileReader();
        reader.onloadend = function(evt){
          var base64WithPrefix = evt.target.result;
          var base64 = base64WithPrefix.replace(/data:(image|application)\/(jpeg|png|zip);base64,/, '');
          defer.resolve(base64);
        };
        reader.readAsDataURL(file);
        return defer.promise;
      });
    }

    function createFolder(path, fileLocation){
      return getFileEntry('', fileLocation).then(function(dirEntry){
        return _createFolderRec(dirEntry, path.split('/'));
      });
    }

    function createFile(path, content, fileLocation){
      Logger.info('createFile('+path+')');
      var folders = path.split('/');
      var filename = folders.pop();
      return createFolder(folders.join('/'), fileLocation).then(function(dirEntry){
        var defer = $q.defer();
        dirEntry.getFile(filename, {create: true}, function(fileEntry){
          if(content !== null && content !== undefined){
            fileEntry.createWriter(function(fileWriter){
              fileWriter.onwriteend = function(e){
                defer.resolve(fileEntry);
              };
              fileWriter.write(content);
            }, function(error){
              defer.reject(error);
            });
          } else {
            defer.resolve(fileEntry);
          }
        }, function(error){
          defer.reject(error);
        });
        return defer.promise;
      });
    }

    function copyFile(filepath, newFilepath, fileLocation, newFileLocation){
      var newPath = newFilepath.substr(0, newFilepath.lastIndexOf('/') + 1);
      var newFilename = newFilepath.substr(newFilepath.lastIndexOf('/') + 1);
      return $q.all([getFileEntry(filepath, fileLocation), createFolder(newPath, newFileLocation)]).then(function(results){
        var fileEntry = results[0], newDirEntry = results[1];
        var defer = $q.defer();
        fileEntry.copyTo(newDirEntry, newFilename, function(result){
          defer.resolve(result);
        }, function(error){
          defer.reject(error);
        });
        return defer.promise;
      });
    }

    function removeFile(path, fileLocation){
      return getFileEntry(path, fileLocation).then(function(fileEntry){
        var defer = $q.defer();
        if(!fileEntry.isDirectory){
          fileEntry.remove(function(){
            defer.resolve();
          }, function(error){
            defer.reject(error);
          });
        } else {
          defer.resolve({message: 'Path "'+path+'" is not a file !'});
        }
        return defer.promise;
      });
    }

    function removeFiles(paths, fileLocation){
      var removePromiseArr = paths.map(function(path){
        return removeFile(path, fileLocation);
      });
      return $q.all(removePromiseArr);
    }

    function removeFolder(path, fileLocation){
      return getFileEntry(path, fileLocation).then(function(dirEntry){
        var defer = $q.defer();
        if(dirEntry.isDirectory){
          dirEntry.removeRecursively(function(){
            defer.resolve();
          }, function(error){
            defer.reject(error);
          });
        } else {
          defer.resolve({message: 'Path "'+path+'" is not a directory !'});
        }
        return defer.promise;
      });
    }

    function removeFolders(paths, fileLocation){
      var removePromiseArr = paths.map(function(path){
        return removedFolder(path, fileLocation);
      });
      return $q.all(removePromiseArr);
    }

    function clear(path, fileLocation){
      return getContent(path, fileLocation).then(function(entries){
        var promises = entries.map(function(entry){
          var entryPath = entry.fullPath.substr(1); // remove the starting '/'
          return removeFolder(entryPath, fileLocation);
        });
        return $q.all(promises).then(function(results){
          return results;
        }, function(err){
          return err;
        });
      });
    }

    /**
     * Private methods
     */
    function _createFolderRec(dirEntry, folders){
      if(folders.length === 0){
        return $q.when(dirEntry);
      } else {
        var localFolders = folders.slice();
        var defer = $q.defer();
        dirEntry.getDirectory(localFolders.pop(), {create: true}, function(newDir){
          defer.resolve(_createFolderRec(newDir, localFolders));
        }, function(error){
          defer.reject(error);
        });
        return defer.promise;
      }
    }
  }

  function fullPathFilter(FilePlugin){
    return function(path, defaultPath){
      return path ? FilePlugin.getFullPath(path) : defaultPath;
    };
  }


  /**************************
   *                        *
   *      Browser Mock      *
   *                        *
   **************************/
  ionic.Platform.ready(function(){
    if(!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())){
      if(!window.cordova){window.cordova = {};}
      if(!window.cordova.file){
        window.cordova.file = {
          applicationDirectory: 'file:///android_asset/',
          applicationStorageDirectory: 'file:///data/data/com.exemple.myapp/',
          cacheDirectory: 'file:///data/data/com.exemple.myapp/cache/',
          dataDirectory: 'file:///data/data/com.exemple.myapp/files/',
          documentsDirectory: null,
          externalApplicationStorageDirectory: 'file:///storage/emulated/0/Android/data/com.exemple.myapp/',
          externalCacheDirectory: 'file:///storage/emulated/0/Android/data/com.exemple.myapp/cache/',
          externalDataDirectory: 'file:///storage/emulated/0/Android/data/com.exemple.myapp/files/',
          externalRootDirectory: 'file:///storage/emulated/0/',
          sharedDirectory: null,
          syncedDataDirectory: null,
          tempDirectory: null
        };
        window.resolveLocalFileSystemURL = function(uri, successCallback, errorCallback){
          var filename = uri.substr(uri.lastIndexOf('/') + 1);
          successCallback(FileEntry(filename, uri));
        };
        window.DirectoryEntry = function(name, fullPath, fileSystem, nativeURL){
        };
        window.FileEntry = function(name, fullPath, fileSystem, nativeURL){
          return {
            isFile: name.indexOf('.') > -1,
            isDirectory: name.indexOf('.') < 0,
            createReader: function(){
              return {
                readEntries: function(success, fail){
                  success([]);
                }
              };
            },
            createWriter: function(success, fail){
              success({
                write: function(content){
                  if(this.onwriteend){
                    this.onwriteend(new FileEntry(name, fullPath, fileSystem, nativeURL));
                  }
                }
              });
            },
            getDirectory: function(path, flags, success, fail){
              success(new FileEntry(path, fullPath+path, fileSystem, nativeURL+path));
            },
            getFile: function(path, flags, success, fail){
              success(new FileEntry(path, fullPath+path, fileSystem, nativeURL+path));
            },
            remove: function(success, fail){
              success();
            },
            toURL: function(mimeType){
              return nativeURL;
            }
          }
        };
      }
    }
  });
})();
