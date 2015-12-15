var express = require('express');
var http = require('http');

var app = express();
app.set('port', 8000);

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listeing on port " + app.get('port'));
});

app.use(function(reqest, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.json({value: 10});
});
/*
var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
    response.end(JSON.stringify({value: 10}));
}).listen(8000);

console.log("Server succesfully started");
*/