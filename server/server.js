var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
    response.end(JSON.stringify({value: 10}));
}).listen(8000);

console.log("Server succesfully started");
