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
    redis.subscribe('rt-change');

    redis.on('message', function(channel, message) {
        var msg = JSON.parse(message);
        socket.emit('rt-change/' + msg["recipient_id"], JSON.parse(message));
    });
});


// var io = require('socket.io').listen(5001),
//     redis = require('redis').createClient();

// io.on('connection', function(socket) {
//     socket.on('receive_auth_token', function(auth_token) {
//         redis = require('redis').createClient();
//         redis.subscribe('rt-change/' + auth_token);

//         redis.on('message', function(channel, message) {
//             socket.emit('rt-change/' + auth_token, JSON.parse(message));
//         })
//     });
// });

//set up our http to listen
http.listen(4200, function(){
  console.log('listening on *:4200');
});