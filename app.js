var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server= require('http').createServer(app);
var io= require('socket.io')(server);
// view engine setup

io.on('connection', function(client){
	client.on('join', function(name){
		client.nickname=name;
	});

	client.on('messages',function(data){
	console.log(data);
	var obj={
		msg:data,
		sender:client.nickname
	}
	io.emit('messages', obj);
	client.broadcast.emit('messages',obj);
	var senderobj={
		msg:data,
		sender:'You'
	}
	client.emit('messages',senderobj);
	});

});
server.listen(8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function(req,res){
	res.sendfile('views/index.html');
});;
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
