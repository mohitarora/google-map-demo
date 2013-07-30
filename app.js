var express = require("express")
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , redis = require('redis');

server.listen(3000);

var sub = redis.createClient(9487,"grouper.redistogo.com",{no_ready_check: true});
sub.auth('000548c2b12beffac99de909eb4b2df4', function() {
    console.log('Redis client connected');
  });
sub.subscribe("logstash");


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  sub.on("message", function(channel, message){
    var jsonMessage = JSON.parse(message);
    socket.emit(channel, jsonMessage["@fields"].ident + "," + jsonMessage["@fields"].auth);
  });
});