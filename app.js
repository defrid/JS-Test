var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var port = 8000;

app.use(bodyParser.json());

var data = require(__dirname + "/data.json");

var pages = [];
var pageSize = 10;
var pageCount = [];

for(var i = 0; i < Math.ceil(data.length / pageSize); i++) {
    pageCount[i] = {value: i + 1};
}

while(data.length > 0) {
    pages.push(data.splice(0, pageSize));
};

app.param(function(name, fn) {
  if (fn instanceof RegExp) {
    return function(req, res, next, val) {
      var captures;
      if (captures = fn.exec(String(val))) {
        req.params[name] = captures;
        next();
      } else {
        next('route');
      }
    }
  }
});

app.param("id", /\d+/);

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/build/index.html");
})

app.get('/get', function(req, res) {
    res.json(pageCount);
});

app.get('/get/:id', function(req, res) {
    res.json(pages[req.params.id - 1]);
});

app.post('/post', function(req, res) {
    res.json(req.body);
});

app.use(express.static(__dirname + "/build"));

app.listen(port);

console.log("Express server listeing on port " + port);
