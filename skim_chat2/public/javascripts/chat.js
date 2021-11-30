var socket = io();

$('#chat').on('submit', function(e) {
	socket.emit('send message', $('#name').val(), $('#message').val());
	$('#message').val('');
	$('#message').focus();
	e.preventDefault();
});

socket.on('create name', function(name) {
	$('#name').val(name);
});

socket.on('new_connect', function(name) {
	$('#chatLog').append('<알림> ' + name + '님이 입장하셨습니다.\n');
});

socket.on('new_disconnect', function(name) {
	$('#chatLog').append('<알림> ' + name + '님이 퇴장하셨습니다.\n');
});

socket.on('change name', function(oldName, name) {
	$('#chatLog').append('<알림> ' + oldName + '님이 ' + name + '님으로 변경되었습니다.\n');
});

socket.on('receive message', function(msg) {
	$('#chatLog').append(msg + '\n');
	$('#chatLog').scrollTop($('#chatLog')[0].scrollHeight);
})
