//server.js

// const { Socket } = require('dgram');

var	app = require('http').createServer(handler),
	io = require('socket.io')(app),
	fs = require('fs');

app.listen(3000);

function handler (req, res) {
	fs.readFile('index.html', function(err, data) {
		if (err) {
			res.writeHead(500);
			return (res.end('Error loading index.html'));
		}
		res.writeHead(200);
		res.end(data);
	});
}

// connection은 socket.io의 기본 이벤트 => 사용자가 웹사이트를 열면 자동으로 발생
io.on('connection', function (socket) { // socker : 접속한 사용자의 socket
	// socket.emit event를 발생시키는 함수
	// socket.emit : socket을 통해 상대편으로 전달 / io.emit : 현재 접속해 있는 모든 클라이언트에게 이벤트 전달
	socket.emit('news', { serverData : '서버 작동' }); // news 이벤트 발생

	socket.on('client login', function(data) {
		console.log(data);
	});

	// disconnet : socket.io의 기본이벤트
	// io.on을 사용하면 모든 사용자에게 전달된다.
	socket.on('disconnect', function() {
		console.log('disconnect');
	});
});
