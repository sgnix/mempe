app.Connection = (function () {

  var webSocket;

  function Connection(onopen) {
    var self = this;

    // Mix in Backbone events
    _.extend(self, Backbone.Events);

    self.on('get', function(args) {
      self.send('get', app.storage.get(args.id) );
    });

    function webSocketError() {
      app.message.set({ type: "error", name: "NO_WEBSOCKET" }).trigger('show');
    }

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if ( !window.WebSocket ) {
      return webSocketError();
    }

    webSocket = new WebSocket("ws://" + location.hostname + ':' + app.socketPort);

    // webSocket open
    // Register as a client and get a name
    webSocket.onopen = function(){
      var name = app.settings().username;
      self.request("register", { name: name }, function(res){
        app.identity(res.name);
        onopen && onopen();
      });
    };

    // webSocket error
    webSocket.onerror = webSocketError;

    // webSocket message
    webSocket.onmessage = function (message) {
      var data = {};
      try {
        data = JSON.parse(message.data);
      } catch (e) {
        _log("Bad JSON message [" + message.data + "]")();
      }
      self.trigger(data.action, data.args);
    };

    webSocket.onclose = webSocketError;
  }

  Connection.prototype.send = function (action, args) {
    var message = JSON.stringify({
      action: action,
      args: args
    });
    webSocket.send(message);
  };

  Connection.prototype.request = function(action, args, callback) {
    this.once(action, callback);
    this.send(action, args);
  }

  return Connection;
})();
