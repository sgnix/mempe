#!/usr/bin/env node

var
  http = require('http'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter,
  WebSocketServer = require('websocket').server;

var
  port = 8081,
  clients = {};

// Class 'Client': Creates a client based on a
// websocket connection
// ===========================================
var Client = function(connection) {
  var self = this;

  // Super constructor
  EventEmitter.call(self);

  // Private variables
  self.connection = connection;

  // Event 'register'
  // Register a client's name
  // ---------------------------------
  self.on('register', function(args) {
    var i = 0;
    self.name = args.name;
    while (clients[self.name]) {
      self.name = args.name + ++i;
    }
    clients[self.name] = self;
    self.send('register', {
      name: self.name
    });
  });


  // Event 'fetch'
  // Fetch a paste by ID
  // ------------------------------
  self.on('fetch', function(args) {
    var client = clients[args.name];
    if (client) {
      client.request('get', {
        id: args.id
      }, function(res) {
        if (!res) {
          res = {
            error: "REMOTE_NOT_FOUND"
          };
        }
        self.send('fetch', res);
      });
    } else {
      self.send('fetch', {
        error: "NOT_CONNECTED"
      });
    }
  });

  // Event 'broadcast'
  // Broadcast message to all clients, except
  // the one sending the broadcast
  // ----------------------------------
  self.on('broadcast', function(args) {
    args.name = self.name;

    var action = 'broadcast';
    if ( args.action ) {
      action += ":" + args.action;
      delete args.action;
    }

    for ( name in clients ) {
      if ( name != self.name ) {
        clients[name].send(action, args);
      }
    }
  });

};

util.inherits(Client, EventEmitter);

Client.prototype.send = function(action, args) {
  this.connection.sendUTF(JSON.stringify({
    action: action,
    args: args
  }));
};

Client.prototype.request = function(action, args, callback) {
  this.once(action, callback);
  this.send(action, args);
};


// Class 'Server': Creates a websocket server
// and accepts client connections
// ==========================================
function Server() {

  var httpServer = http.createServer(function(req, res) {
    res.writeHead(404);
    return res.end();
  });

  httpServer.listen(port, function() {
    return console.log("The web socket server is listening on port " + port);
  });

  var socketServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
  });

  socketServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var client = new Client(connection);

    connection.on('message', function(message) {
      var data = {};
      if (message.type === "utf8") {
        try {
          data = JSON.parse(message.utf8Data);
        } catch (_error) {
          console.error("Can't parse JSON " + message.utf8Data);
        }
      }
      client.emit(data.action, data.args);
    });

    connection.on('close', function() {
      delete clients[client.name];
    });

  });
}

var server = new Server();
