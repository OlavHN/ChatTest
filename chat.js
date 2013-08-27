// TODO: Swap with proper static hosting
var fs = require('fs');
var connect = require('connect');
var app = connect()
  .use('/static', connect.static(__dirname + '/public'))
  .use(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/public/index.html').pipe(res);
  });
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(8080);

io.sockets.on('connection', function (socket) {
  socket.on('join', function(data, cb) {
    socket.get('room', function(err, currentRoom) {
      if (currentRoom) {
        io.sockets.in(currentRoom).emit('leaving', socket.id);
        socket.leave(currentRoom);
      }

      socket.set('room', data.room, function() {
        io.sockets.in(data.room).emit('joining', socket.id);
        cb(io.sockets.clients(data.room).map(function(clientInRoom) {
          return clientInRoom.id;
        }), socket.id);

        socket.join(data.room);
      });
    });
  });

  socket.on('disconnect', function() {
    socket.get('room', function(err, currentRoom) {
      if (currentRoom) {
        socket.leave(currentRoom);
        io.sockets.in(currentRoom).emit('leaving', socket.id);
      }
    });
  })
});
