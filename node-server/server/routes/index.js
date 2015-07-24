var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
// var appDir = path.dirname(require.main.filename);
var appDir = process.cwd();

var connection_string = 'postgres://jellyvish:WhaleHunter22@postsql-game-oregon.ctwjtsopybio.us-west-2.rds.amazonaws.com:5432/game_data';

router.get('/', function(req, res) {
  // res.sendFile(path.join(appDir+'/public/index.html'));
  res.json({message: "Invalid route"});
});

module.exports = router;
