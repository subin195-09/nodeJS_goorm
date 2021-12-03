// skim_bingo2 server.js

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	// 좀 더 고민해 볼 것
	// res.render('main', { title: '온라인 빙고 게임', username: req.query.username });
	res.render(path.join(__dirname, 'public', 'views', 'main'), {
		title: "skim_bingo2",
		username: req.query.username
	});
});

var users = {};
var user_count = 0;
var turn_count = 0;

io.on('connection', function(socket) {
	console.log('user connected : ', socket.id);

	socket.on('join', function(data) {
		var username = data.username;
		socket.username = username;

		// users 는 맵을 가지고 있는 배열?
		// users하난하나의 요소 는 id, name, turn 이다.
		users[user_count] = {};
		users[user_count].id = socket.id;
		users[user_count].name = username;
		users[user_count].turn = false;
		user_count++;

		io.emit('update_users', users, user_count);
	});

	socket.on('game_start', function (data) {
		socket.broadcast.emit('game_started', data);
		users[turn_count].turn = true;

		io.emit('update_users', users);
	});

	socket.on('select', function (data) {
		socket.broadcast.emit('check_number', data);

		users[turn_count].true = false;
		turn_count++;

		if (turn_count >= user_count) {
			turn_count = 0;
		}
		users[turn_count].turn = true;

		io.sockets.emit('update_users', users);
	});

	socket.on('disconnect', function() {
		console.log('user disconnected : ', socket.id, socket.username);
		for (var i = 0; i < user_count; i++) {
			if (users[i].id === socket.id)
				delete users[i];
		}
		user_count--;
		io.emit('update_users', users, user_count);
	})
});

http.listen(3000, function() {
	console.log('skim bingo2 server on!');
});
