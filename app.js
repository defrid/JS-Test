var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = 8000;

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.redirect("/index.html");
})

app.get('/get', function(req, res) {
    res.json({value: 10});
});

app.post('/post', function(req, res) {
    res.json(req.body);
});

app.use(express.static(__dirname + '/app/client/'));

app.listen(port);

console.log("Express server listeing on port " + port);
