var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var app = express();
var port = 8000;

app.use(bodyParser.json());

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
    id = generateId();
}

function openDatabase() {
    var db = new sqlite3.Database("data.db");
    return db;
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/build/index.html");
});

app.get('/page', function(req, res) {
    var from = (req.query.page - 1) * req.query.elementsOnPage;
    var to = req.query.page * req.query.elementsOnPage;
    var dataToSend = {};
    var databaseOnGet = openDatabase();

    databaseOnGet.serialize(function() {
        databaseOnGet.all("SELECT COUNT(rowid) FROM address", function(err, row) {
            dataToSend["totalRecords"] = row[0]["COUNT(rowid)"];
            
        });
        databaseOnGet.all("SELECT * FROM address WHERE rowid > " + from + " AND rowid <= " + to, function(err, row) {
            dataToSend["data"] = row;
            databaseOnGet.close(); 
            res.json(dataToSend);
        });
    });  
});

app.post('/post', function(req, res) {
    var newId; 
    var currentIDs;

    var databaseOnPost = openDatabase();   
    databaseOnPost.all("SELECT _id FROM address", function(err, row) {
        currentIDs = row;
        newId = generateId(currentIDs);
        databaseOnPost.run("INSERT INTO address (_id, state, city, street) VALUES (?, ?, ?, ?)", [newId, req.body.state, req.body.city, req.body.street], function(err) {
            databaseOnPost.close(); 
            res.end();
        });

    });    
});

app.delete('/delete/:id', function(req, res) {
    var databaseOnDelete = openDatabase(); 
    databaseOnDelete.run("DELETE FROM address WHERE _id = ?", [req.params.id], function(err) {
        databaseOnDelete.close(); 
        res.end();
    });
});

app.use(express.static(__dirname + "/build"));

app.listen(port);

console.log("Express server listeing on port " + port);
