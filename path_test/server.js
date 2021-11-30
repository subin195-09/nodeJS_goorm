const express = require("express");
const app = express();
const path = require("path");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
	res.render(path.join(__dirname, 'public', 'views' ,'index'));
});


app.listen(3000, function() {
	console.log('path test');
});

