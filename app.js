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
    function callback() {
        res.json(dataToSend);
    }
    dbHandler.handleGet(limit, offset, dataToSend, callback);   
});

app.post('/post', function(req, res) {
    var dataToInsert = [req.body.state, req.body.city, req.body.street];
    function callback() {
        res.end();
    }
    dbHandler.handlePost(dataToInsert, callback); 
});

app.delete('/delete/:id', function(req, res) {
    var id = [req.params.id];
    function callback() {
        res.end();
    }
    dbHandler.handleDelete(id, callback);
});

app.use(express.static(__dirname + "/build"));

app.listen(port);

console.log("Express server listeing on port " + port);
