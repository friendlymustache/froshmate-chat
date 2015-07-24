/*********************************************
 **** Our NodeJS Server.
 **** Opens a websocket connection on port 5001
 **** to listen to changes from Redis
 *********************************************
 */

var io = require('socket.io').listen(5001),
    redis = require('redis').createClient();

redis.subscribe('rt-change');

io.on('connection', function(socket){
  redis.on('message', function(channel, message){
    socket.emit('rt-change', JSON.parse(message));
  });
});