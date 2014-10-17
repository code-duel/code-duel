var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/client')); 

app.listen(port);

console.log('express listening on port %s', port);