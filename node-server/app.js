/*********************************************
 **** Our NodeJS Server.
 **** Opens a websocket connection on port 5001
 **** to listen to changes from Redis
 *********************************************
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http),
    redis = require('redis').createClient();

redis.subscribe('rt-change');

/* Listen for connections from clients (connection should
 * be created in the Ember app) */
io.on('connection', function(socket){	
  /* When the client sends over their auth token, tell redis to
   * listen for messages addressed to the client. We do this
   * by listening for the event 'message' + auth_token.
   */
  io.on('receive_auth_token', function(auth_token) {
      /* When redis receives a message addressed to the current
       * client, emit an rt-change event back to the Ember client */
	  redis.on('message' + auth_token, function(channel, message){
	    socket.emit('rt-change', JSON.parse(message));
	  });  	
	});
});
