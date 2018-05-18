
/**
 * Module dependencies.
 */

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var http = require('http');

var app = express();

try {
  config = require('./config.json')
} catch (e) {
  config = require('./config.default.json');
}

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('port', 80);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/////////////////////////////
// global variables
/////////////////////////////


/////////////////////////////
// server logics
/////////////////////////////

app.get('/', function(req, res, next) {
  res.render('index', {hubserver: config.hubserver});
});

// server起動
var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// socket.io 利用
var socketIO = require("socket.io");
var io = socketIO.listen(server);


// 全員
io.sockets.on('connection', function(socket){
	console.log("connection");
	socket.on('message', function(data) {
		console.log("message");
		io.sockets.emit('message', {value: data.value});

	});

	socket.on('disconnect',function(){
		console.log("disconnect");
	});
});

// 運営
var unnei = io.of("/unnei").on("connection", function(socket){
	console.log("unnei connection");

	socket.on('message', function(data) {
		console.log("message" + data.value);
		proj.emit("message",  {value: data.value});
		mobile.emit("message",  {value: data.value});
		gadget.emit("message",  {value: data.value});
		//mobile.emit("message",  {value: data.value});
	});

	socket.on('gadget', function(data) {
		// console.log("message to gadget");
		gadget.emit("message",  {value: data.value});
	});

	// 切断
	socket.on('disconnect',function(){
		console.log("unnei disconnect");
	});
});


// ビル
var proj = io.of("/proj").on("connection", function(socket){
	console.log("proj connection");

	// 切断
	socket.on('disconnect',function(){
		console.log("proj disconnect");
	});

	socket.on('gadget', function(data) {
		gadget.emit("message",  {value: data.value});
	});

	socket.on('unnei', function(data) {
		unnei.emit("message",  {value: data.value});
	});

});

// モバイル
var mobile = io.of("/mobile").on("connection", function(socket){
	console.log("mobile connection");

	// サンタに関するメッセージはビルへ
	socket.on("santa", function(data){
		//proj.volatile.emit("message",  {value: data.value});
		proj.emit("message",  {value: data.value});
		console.log(data.value);
		//mobile.emit("message",  {value: data.value});
	});

	socket.on('unnei', function(data) {
		console.log("message");
		unnei.emit("message",  {value: data.value});
		//mobile.emit("message",  {value: data.value});
	});

	// 切断
	socket.on('disconnect',function(){
		console.log("mobile disconnect");
	});

});


// ガジェットモバイル
var gadget = io.of("/gadget").on("connection", function(socket){
	console.log("gadget connection");

	// サンタに関するメッセージはビルへ
	socket.on("santa", function(data){
		//proj.volatile.emit("message",  {value: data.value});
		proj.emit("message",  {value: data.value});
		unnei.emit("message",  {value: data.value});
		console.log(data.value);
		//mobile.emit("message",  {value: data.value});
	});

	socket.on('unnei', function(data) {
		unnei.emit("message",  {value: data.value});
		console.log(data.value);
		//mobile.emit("message",  {value: data.value});
	});

	// 切断
	socket.on('disconnect',function(){
		console.log("mobile disconnect");
	});

});
