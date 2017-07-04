var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static('public'));

server.listen(2000);


var SOCKET_LIST = [];

var io = require('socket.io')(server, {});
io.sockets.on('connect', function(socket) {
    console.log('New connection');

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id];
    });

});


