var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var app = express();
var port = 8000;

app.use(bodyParser.json());

function skip(from, to, source) {
    var content = [];
    if(to > source.length) {
        to = source.length;
    }
    for(var i = from; i < to; i++) {
        content.push(source[i]);
    }
    return content;
}

function getData(){
    var data = JSON.parse(fs.readFileSync(__dirname + "/data.json", "utf-8"));
    return data;
}

function generateId(currentData) {
    var id = Math.floor(1000000 + Math.random() * (1000000000 + 1 - 1000000)) + "a";
    var match = 0;
    for(var j = 0; j < currentData.length; j++) {
        if(currentData[j]["_id"] === id) {
            match++;
        }
    }
    if(match === 0) {
        return id;
    }
    generateId();
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/build/index.html");
});

app.get('/page', function(req, res) {
    res.setHeader("Total Elements", getData().length);
    res.json(skip((req.query.page - 1) * req.query.elementsOnPage, req.query.page * req.query.elementsOnPage, getData()));
});

function updatePage(req, res, source) {
    fs.writeFileSync(__dirname + "/data.json", JSON.stringify(source));
    res.setHeader("Total Elements", source.length);
    res.json(skip((req.query.page - 1) * req.query.elementsOnPage, req.query.page * req.query.elementsOnPage, source));
}

app.post('/post', function(req, res) {
    var sourceFile = getData();
    var newId = generateId(sourceFile);
    var newData = {
        _id: newId,
        city: req.body.city,
        street: req.body.street,
        state: req.body.state
    }
    sourceFile.push(newData);
    updatePage(req, res, sourceFile);
});

app.delete('/delete', function(req, res) {
    var file = getData();
    for(var j = 0; j < file.length; j++) {
        if(file[j]["_id"] === req.query.id) {
            file.splice(j, 1);
        }
    }
    updatePage(req, res, file);
})

app.use(express.static(__dirname + "/build"));

app.listen(port);

console.log("Express server listeing on port " + port);
