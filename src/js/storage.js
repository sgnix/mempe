app.storage = (function(){
  var
    key = app.storageKey,
    idKey = app.storageIdKey,
    collection = [];

  function find(id) {
    for ( var i = 0; i < collection.length; i++ ) {
      if ( collection[i].id === id ) {
        return i;
      }
    }
    return -1;
  }

  function flush() {
    localStorage.setItem(key, JSON.stringify(collection));
  }

  function Storage() {
    var value = localStorage.getItem(key);
    if ( value ) {
      try {
        collection = JSON.parse(value);
      } catch (e) {
        console.error("Can not parse collection");
      }
    }
  }

  Storage.prototype.nextId = function() {
    var id = parseInt(localStorage.getItem(idKey)) || 1;
    localStorage.setItem(idKey, id + 1);
    return id;
  };

  Storage.prototype.set = function(doc){
    if ( typeof doc.id === "undefined" ) {
      var id = this.nextId();
      doc.id = id;
      collection.push(doc);
    } else {
      var idx = find(doc.id);
      if ( idx >= 0 ) {
        doc.id = collection[idx].id;
        collection[idx] = doc;
      }
    }
    flush();
    return doc.id;
  };

  Storage.prototype.get = function(id) {
    var idx = find(parseInt(id));
    return idx < 0 ? null : collection[idx];
  }

  Storage.prototype.remove = function(id) {
    var idx = find(id);
    if ( idx >= 0 ) {
      collection.splice(idx, 1);
      flush();
    }
  };

  Storage.prototype.collection = function() {
    return collection;
  };

  Storage.prototype.count = function() {
    return collection.length;
  };

  Storage.prototype.stringify = function() {
    return JSON.stringify(this.collection(), undefined, app.settings().tabsize);
  };

  Storage.prototype.reset = function(text) {
    var arr = JSON.parse(text);

    // The whole collection must be an array
    if (!_.isArray(arr)) {
      throw new Error("Must be an array");
    }

    // Each element --
    var ids = {};
    for ( var i = 0; i < arr.length; i++ ) {
      var el = arr[i];

      // Must be an object
      if (!_.isObject(el)) {
        throw new Error("Element " + i + " is not an object");
      }

      // Must have these props
      _.each(['id', 'title', 'text'], function(field) {
        if (!el.hasOwnProperty(field)) {
          throw new Error("Element " + i + " doesn't have '" + field + "'");
        }
      })

      // Must have *unique* id
      if (ids[el.id]) {
        throw new Error("ID " + el.id + " already used in element " + i);
      }

      ids[el.id] = true;
    }

    collection = arr;
    flush();
  };

  return new Storage();
})();
