// 간단한 서버 구현

var server = require('http');

server.createServer(function(request, response) {
	response.writeHead(200, {
		'Content-Type': 'text/plain'
	});
	response.end('Hello World\n');
}).listen(3000, 'localhost');

console.log('Server is running at http://localhost:3000/');

