// skim_chat2 chat.js

var socket = io();

var userlist_update = function (users, users_num) {
	$('#listArea').empty();
	console.log(users);
	users.forEach(user => {
		console.log(user);
		$('#listArea').append('<li class="list-group-item">' + user.name + '</li>');
	});
};

$('#chat').on('submit', function(e) {
	socket.emit('send message', $('#name').val(), $('#message').val());
	$('#message').val('');
	$('#message').focus();
	e.preventDefault();
});

socket.on('create name', function(name, users, users_num) {
	$('#name').val(name);
	userlist_update(users, users_num);
});

socket.on('new_connect', function(name) {
	$('#chatLog').append('<알림> ' + name + '님이 입장하셨습니다.\n');
});

socket.on('new_disconnect', function(name, users, users_num) {
	$('#chatLog').append('<알림> ' + name + '님이 퇴장하셨습니다.\n');
	userlist_update(users, users_num);
});

socket.on('change name', function(oldName, name, users, users_num) {
	$('#chatLog').append('<알림> ' + oldName + '님이 ' + name + '님으로 변경되었습니다.\n');
	userlist_update(users, users_num);
});

socket.on('receive message', function(msg) {
	$('#chatLog').append(msg + '\n');
	$('#chatLog').scrollTop($('#chatLog')[0].scrollHeight);
})
