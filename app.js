var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var dbHandler = require("./db-module").dbHandler();

var app = express();
var port = 8000;

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/build/index.html");
});

app.get('/page', function(req, res) {
    var limit = req.query.elementsOnPage;
    var offset = (req.query.page - 1) * req.query.elementsOnPage;
    var dataToSend = {};
    dbHandler.handleGet(limit, offset, dataToSend, res);
});

app.post('/post', function(req, res) {
    dbHandler.handlePost(req, res); 
});

app.delete('/delete/:id', function(req, res) {
    dbHandler.handleDelete(req, res);
});

app.use(express.static(__dirname + "/build"));

app.listen(port);

console.log("Express server listeing on port " + port);
