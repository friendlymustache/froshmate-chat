/*********************************************
 **** Our NodeJS Server.
 **** Opens a websocket connection on port 5001
 **** to listen to changes from Redis
 *********************************************
 */

var app = require('express')()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis_lib = require('redis');

io.on('connection', function(socket) {
	// Create a new client for each connection so that we don't
	// send a message to everybody
	var redis = redis_lib.createClient();
    // When an auth token is received from the ember app,
    // subscribe to messages sent to the user with the
    // provided auth token
    socket.on('auth_token', function(token) {
    	var event_name = 'rt-change/' + token; 
        console.log("Auth token received! Subscribing to " + event_name);
        redis.subscribe(event_name);
        redis.on('message', function(channel, message) {
            socket.emit('rt-change/' + token, message);
        });
    })
});


//set up our http to listen
http.listen(5001, function(){
  console.log('listening on *:5001');
});