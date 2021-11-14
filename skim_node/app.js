// 필요한 모듈 불러오기
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); // http 리퀘스트에 대해 로깅하는 모듈 (객체 생성)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express(); // 이 객체를 이용하여 웹 서버의 특징을 기술

// view engine setup
// app 객체애 대한 특징을 기술

// 화면을 보이게 할 뷰 템플릿
// 뷰 템플릿 파일을 만들고 난 후, views 폴더 안에 넣어주고 라우팅을 설정해주면 됨
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // 뷰에서 사용될 기본 언진 이름

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 디렉토리 구조를 url에 반영하여 쉽게 접근 가능한 정적 디렉토리 설정
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
