var bingo = {
	is_my_turn: Boolean,
	socket: null,

	init: function(socket) {
		var self = this;
		var user_cnt = 0;

		this.is_my_turn = false;

		socket = io();

		socket.on('check_number', function(data) {

		});

		socket.on('game_started', function(data) {
			console.log('Enter Game Started');
			self.print_msg(data.username + ' has started the game.');
			$('#start_button').hide();
		});

		socket.on('update_users', function(data, user_count) {
			console.log(data);
			user_cnt = user_count;
			self.update_userlist(data, socket);
		});
	},

	select_num: function(obj, socket) {

	},

	where_is_it: function(num) {

	},

	check_num: function(obj) {

	},

	update_userlist: function(data, this_socket) {

	},

	print_msg: function (msg) {

	}
};

$(document).ready(function () {
	bingo.init();
});
