/*********************************************
 **** Our NodeJS Server.
 **** Opens a websocket connection on port 5001
 **** to listen to changes from Redis
 *********************************************
 */

var app = require('express')()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis').createClient();

io.on('connection', function(socket) {
    console.log("Server connected!");
    socket.on('auth_token', function(token) {
        console.log("Auth token received!");
        redis.subscribe('rt-change/' + token);
        redis.on('message', function(channel, message) {
            socket.emit('rt-change/' + token, message);
        });
    })
});


//set up our http to listen
http.listen(5001, function(){
  console.log('listening on *:5001');
});