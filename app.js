var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var port = 8000;

app.use(bodyParser.json());

var data = require(__dirname + "/data.json");

function countNumberOfPages(elementsOnPage, source) {
    var numberOfPages = [];
    for(var i = 0; i < Math.ceil(source.length / elementsOnPage); i++) {
        numberOfPages[i] = i + 1;
    }
    return numberOfPages;
}

function skip(from, to, source) {
    var content = [];
    for(var j = from; j < to; j++) {
        content.push(source[j]);
    }
    return content;
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/build/index.html");
})

app.get('/get', function(req, res) {
    res.json(countNumberOfPages(req.query.elementsOnPage, data));
});

app.get('/page', function(req, res) {
    res.json(skip((req.query.page - 1) * req.query.elementsOnPage, req.query.page * req.query.elementsOnPage, data));
});

app.post('/post', function(req, res) {
    res.json(req.body);
});

app.use(express.static(__dirname + "/build"));

app.listen(port);

console.log("Express server listeing on port " + port);
