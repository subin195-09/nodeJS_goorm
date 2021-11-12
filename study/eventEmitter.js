var EventEmitter = require("events").EventEmitter;
var evt = new EventEmitter();

evt.on("helloNode", function(str) {
	console.log("Hello" + str);
});

exports.exTime = function () {
	setTimeout(function() {
		evt.emit("helloNode", " skim");
	}, 100);
};

exports.exPro = function() {
	console.log(process.memoryUsage());
};
