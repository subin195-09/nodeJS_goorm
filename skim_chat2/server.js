var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.render(path.join(__dirname, 'public', 'views', 'chat2'), { title: 'skim_chat2 test', username: req.query.username });
});

var count = 1;

io.on('connection', function(socket) {
	console.log('user connected: ', socket.id);
	var name = 'user' + count++;
	socket.name = name;
	io.to(socket.id).emit('create name', name);

	socket.on('disconnect', function() {
		console.log('user disconnected: ' + socket.id + ' ' + socket.name);
		io.emit('new_disconnect', socket.name);
	});

	io.emit('new_connect', name);

	socket.on('send message', function(name, text) {
		console.log("send message: " + name + ' ' + text);
		var msg = name + ': ' + text;
		if (name != socket.name)
			io.emit('change name', socket.name, name);
		socket.name = name;
		console.log(msg);
		io.emit('receive message', msg);
	});
});

http.listen(3000, function() {
	console.log('skin chat2 server on...');
})
