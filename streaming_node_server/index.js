'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');

var fileServer = new (nodeStatic.Server)();
var app = http.createServer(function (req, res) {
  fileServer.serve(req, res);
}).listen(8002);

var io = socketIO.listen(app);
io.sockets.on('connection', function (socket) {

  socket.on('message', function (message) {
    socket.broadcast.emit('message', message);
  });

  socket.on('create', function (room) {
    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    socket.join(room);
    socket.emit('created', room, socket.id);
  })

  socket.on('join', function (room) {
    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    io.sockets.in(room).emit('join', room);
    socket.join(room);
    socket.emit('joined', room, socket.id);
    io.sockets.in(room).emit('ready');
  })

  socket.on('create or join', function (room) {
    // log('Received request to create or join room ' + room);

    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

    if (numClients === 0) {
      socket.join(room);
      socket.emit('created', room, socket.id);

    } else if (numClients >= 1) {
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
    }
    // else { // max two clients
    //   socket.emit('full', room);
    // }
  });

  socket.on('ipaddr', function () {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function (details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('bye', function () {
    console.log('received bye');
  });

});