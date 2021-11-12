function Foo() {
	console.log("Foo");
}

function Bar() {
	console.log("Bar");
}

Foo.prototype = {
	bar : function() {
		console.log("bar");
	}
};

// Bar.prototype = Object.create(Foo.prototype);

var util = require('util');
util.inherits(Bar, Foo);

Bar.prototype.bar = function() {
	console.log("bar_bar");
}

Bar.prototype.baz = function() {
	console.log("baz");
}

Foo.prototype.bar();
Bar.prototype.bar();
Bar.prototype.baz();
