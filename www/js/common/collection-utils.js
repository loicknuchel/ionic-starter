(function(){
  'use strict';
  angular.module('app')
    .factory('CollectionUtils', CollectionUtils);

  function CollectionUtils(_){
    var service = {
      clear: clear,             // (col)                            empty collection without loosing reference
      copy: copy,               // (srcCol, destCol)                copy srcCol to destCol without loosing reference
      updateElt: updateElt,     // (collection, selector, elt)      update the first elt matching the selector in collection with the provided elt
      upsertElt: upsertElt,     // (collection, selector, key, elt) same as updateElt but create elt if it does not exists
      removeElt: removeElt,     // (collection, selector)           remove all elts matching the selector in collection
      updateEltBy: updateEltBy, // (collection, elt, keyAttr)       same as updateElt but with a selector based on an elt property (ex: id)
      upsertEltBy: upsertEltBy, // (collection, elt, keyAttr)       same as upsertElt but with a selector based on an elt property (ex: id)
      removeEltBy: removeEltBy, // (collection, elt, keyAttr)       same as removeElt but with a selector based on an elt property (ex: id)
      toMap: toMap,             // (arr)                            transform an array to a map (new object)
      toArray: toArray,         // (map)                            transform a map to an array (new object)
      size: size,               // (col)                            size of collection
      isEmpty: isEmpty,         // (col)                            is collection empty
      isNotEmpty: isNotEmpty    // (col)                            is collection not empty
    };

    function clear(col){
      if(Array.isArray(col)){
        while(col.length > 0){ col.pop(); }
      } else {
        for(var i in col){
          delete col[i];
        }
      }
    }

    function copy(srcCol, destCol){
      clear(destCol);
      for(var i in srcCol){
        destCol[i] = angular.copy(srcCol[i]);
      }
    }

    function updateElt(collection, selector, elt){
      var foundElt = _.find(collection, selector);
      if(foundElt){
        var replacedElt = angular.copy(foundElt);
        angular.copy(elt, foundElt);
        return replacedElt;
      }
    }
    function upsertElt(collection, selector, key, elt){
      var foundElt = _.find(collection, selector);
      if(foundElt){
        var replacedElt = angular.copy(foundElt);
        angular.copy(elt, foundElt);
        return replacedElt;
      } else {
        if(Array.isArray(collection)){ collection.push(elt); }
        else { collection[key] = elt; }
      }
    }
    function removeElt(collection, selector){
      _.remove(collection, selector);
    }

    function updateEltBy(collection, elt, keyAttr){
      var selector = {};
      selector[keyAttr] = elt[keyAttr];
      return updateElt(collection, selector, elt);
    }
    function upsertEltBy(collection, elt, keyAttr){
      var selector = {};
      selector[keyAttr] = elt[keyAttr];
      return upsertElt(collection, selector, elt[keyAttr], elt);
    }
    function removeEltBy(collection, elt, keyAttr){
      var selector = {};
      selector[keyAttr] = elt[keyAttr];
      return removeElt(collection, selector);
    }

    function toMap(arr){
      var map = {};
      if(Array.isArray(arr)){
        for(var i in arr){
          map[arr[i].id] = arr[i];
        }
      }
      return map;
    }

    function toArray(map){
      var arr = [];
      for(var i in map){
        map[i].id = i;
        arr.push(map[i]);
      }
      return arr;
    }

    function size(col){
      if(Array.isArray(col)){
        return col.length;
      } else {
        return Object.keys(col).length;
      }
    }

    function isEmpty(col)     { return size(col) === 0; }
    function isNotEmpty(col)  { return !isEmpty(col);   }

    return service;
  }
})();
