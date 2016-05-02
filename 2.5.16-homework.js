var http = require('http');
var text = 'Hello'.split('');
http.createServer(function(request,response) {
response.writeHead(200);
request.write(JSON.stringify(request.headers));
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter; 
event.on(function() {
    console.log('Hello');
    });
setInterval (function() {
event.emit();    
for (var i=0, x='10'; x = text.charAt(i); i++);
console.log(x); 
},500);
response.end();
}).listen(8080);