app.Connection = (function () {

  var webSocket, callbacks = {};

  function Connection(onopen) {
    var _this = this;

    window.WebSocket = window.WebSocket || window.MozWebSocket;
    webSocket = new WebSocket("ws://" + location.hostname + ':' + app.socketPort);

    // webSocket open
    // Register as a client and get a name
    webSocket.onopen = function(){
      var name = app.settings().username;
      _this.send("register", { name: name }, function(res){
        app.identity(res.name);
        onopen && onopen();
      });
    };

    // webSocket error
    webSocket.onerror = app.fatal("Can not establish websocket connection");

    // webSocket message
    webSocket.onmessage = function (message) {
      var data = {};
      try {
        data = JSON.parse(message.data);
      } catch (e) {
        _log("Bad JSON message [" + message.data + "]")();
      }
      var cb = callbacks[data.action];
      if (typeof cb === "function") {
        cb.call(_this, data.args);
      } else {
        _this.processMessage(data.action, data.args);
      }
    };
  }

  Connection.prototype.processMessage = function (action, args) {
    var _this = this;
    switch (action) {
    case "get":
      this.send("get", app.storage.get(args.id) );
      break;
    }
  };

  Connection.prototype.send = function (action, args, cb) {
    var message = JSON.stringify({
      action: action,
      args: args
    });
    if (typeof cb === "function") {
      callbacks[action] = cb;
    }
    webSocket.send(message);
  };

  return Connection;
})();
