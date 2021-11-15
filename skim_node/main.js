const { application } = require('express');
var express = require('express');
var app = express();

app.locals.pretty = true;
app.set('views', './views');
app.set('view engine', 'pug');
app.listen(3000, () => {
	console.log("Server has been started");
});

// 최상위 라우트로 접속 시 /test로 리다이렉트
app.get("/", (req, res) => {
	res.redirect('/test');
});

// Pug 파일 렌더링
app.get("/test", (req, res) => {
	res.render('test', {
		title: 'Skim',
		message: 'Hello, Skim!',
		content: "<font color=blue>font</font>" });
});

// node main을 입력하여 서버를 실행시킨다.
