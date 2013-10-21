#!/usr/bin/env node

var
  http = require('http'),
  WebSocketServer = require('websocket').server;

var clients = {};

var Client = (function () {

  var callbacks = {};

  function messageToJSON(message) {
    var json = {};
    if (message.type === "utf8") {
      try {
        json = JSON.parse(message.utf8Data);
      } catch (e) {
        console.log("Can't parse JSON: " + message.utf8Data);
      }
    }
    return json;
  }

  function Client(connection) {

    var _this = this;
    this.connection = connection;

    this.connection.on('message', function (message) {
      var data = messageToJSON(message);

      // Find if a callback is assigned for this message,
      // and if not - then run the processMessage function
      // on it.
      var cb = callbacks[data.action];
      if (typeof cb === "function") {
        cb.call(_this, data.args);
      } else {
        _this.processMessage(data.action, data.args);
      }
    });

    this.connection.on('close', function (reasonCode, descr) {
      delete clients[_this.name];
    });
  }

  Client.prototype.processMessage = function (action, args) {
    var _this = this;
    switch (action) {
      case "fetch":
        var client = clients[args.name];
        if (typeof client !== "undefined") {
          client.send("get", { id: args.id }, function (res) {
            if ( res === null ) {
              res = { error: "REMOTE_NOT_FOUND" };
            }
            _this.send(action, res);
          });
        } else {
          _this.send(action, { error: "NOT_CONNECTED" });
        }
        break;

      case "register":
        var i = 1, name = args.name;
        while ( clients[name] ) {
          name = args.name + i++;
        }
        this.name = args.name = name;
        clients[args.name] = this;
        _this.send(action, args);
        break;

      case "clients":
        var names = [];
        for ( var n in clients ) {
          names.push(n);
        }
        _this.send(action, { names: names });
        break;
    }
  }

  Client.prototype.send = function (action, args, callback) {
    var message = JSON.stringify({
      action: action,
      args: args
    })
    if (typeof callback === "function") {
      callbacks[action] = callback;
    }
    this.connection.sendUTF(message);
  };

  return Client;

})();

// Socket Server
// -------------------------------------------------------
var Socket = (function () {
  var httpServer, socketServer, port, callbacks;
  port = 8181;

  function Socket() {

    httpServer = http.createServer(function (req, res) {
      res.writeHead(404);
      res.end();
    });

    httpServer.listen(port, function () {
      console.log((new Date()) + ' Socket server is listening on port ' + port);
    });

    socketServer = new WebSocketServer({
      httpServer: httpServer,
      autoAcceptConnections: false
    });

    socketServer.on('request', function (request) {

      // Make sure we only accept requests from an allowed origin
      if (false) {
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
      }

      var connection = request.accept(null, request.origin);
      new Client(connection);
    });
  }

  return Socket;

})();


var socket = new Socket();
