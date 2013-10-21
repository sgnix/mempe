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

  return new Storage();
})();
