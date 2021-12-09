var redis = require('redis');

var client = redis.createClient();

client.on('error', function(err) {
	console.log('Error' + err);
});
client.connect();

client.set('String Key', 'String Value', redis.print);
client.hset('Hash Key', 'HashTest 1', '1', redis.print);
client.hset(['Hash Key', 'HashTest 2', '2'], redis.print);

client.get('String Key', function(err, reply) {
	console.log(reqly.toString());
});

client.hKeys('Hash Key', function(err, replies) {
	console.log(replies.length + ' replies:');
	replies.forEach(function(reply, i) {
		console.log('    ' + i + ': ' + reply);
	});
});


client.hGetAll('Hash Key', function(err, obj) {
	console.dir(obj);
});
