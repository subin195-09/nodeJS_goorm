const { ESRCH } = require('constants');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.set('views', './views/');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.render('char'); // 루트 페지 접속 시 chat.pug 렌더링
});

var count = 1;

io.on('connection', function(socket) {
	// 채팅방 접속했을 때
	console.log('user connected: ', socket.id);
	var name = 'user' + count++;
	socket.name = name;
	io.to(socket.id).emit('create name', name);

	// 채팅방 접속이 끊어졌을 때
	socket.on('disconnect', function() {
		console.log('user disconnected: ' + socket.id + ' ' + socket.name);
	});

	// 메세지를 보냈을 때
	socket.on('send message', function(name, text) {
		var msg = name + ': ' + text;
		socket.name = name;
		console.log(msg);
		io.emit('receive message', msg);
	});
});

http.listen(3000, function() {
	console.log('server on...');
});

