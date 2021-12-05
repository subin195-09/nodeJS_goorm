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
var users = [];
var users_num = 0;

io.on('connection', function(socket) {
	console.log('user connected: ', socket.id);
	var name = 'user' + count++;
	users[users_num] = {};
	users[users_num].id = socket.id;
	users[users_num++].name = name;
	socket.name = name;

	io.to(socket.id).emit('create name', name, users, users_num);

	socket.on('disconnect', function() {
		console.log('user disconnected: ' + socket.id + ' ' + socket.name);
		for (var i = 0; i < users_num; i++) {
			if (users[i].id === socket.id)
				users.splice(i);
		}
		users_num--;
		io.emit('new_disconnect', socket.name, users, users_num);
	});

	io.emit('new_connect', name);

	socket.on('send message', function(name, text) {
		console.log("send message: " + name + ' ' + text);
		var msg = name + ': ' + text;
		if (name != socket.name)
		{
			for (var i = 0; i < users_num; i++) {
				if (users[i].id === socket.id)
					users[i].name = name;
			}
			io.emit('change name', socket.name, name, users, users_num);
		}
		socket.name = name;
		console.log(msg);
		io.emit('receive message', msg);
	});
});

http.listen(3000, function() {
	console.log('skin chat2 server on...');
})
