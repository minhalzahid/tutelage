var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


require('./startup/db')();
require('./startup/routes')(app);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});


// Socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http);
const SOCKET_PORT = 5252;
var connected_users = [];
var pending_messages = [];
io.sockets.on('connection', function(client) {
  client.on('add-user', function(data) {
    connected_users[client.id] = data;
    console.log(`${data.name} is online`);
    console.log(connected_users);
  });

  client.on('new_message', function(data) {
    console.log(data)
  });

  client.on('disconnect', function(data) {
    console.log(data)
    console.log('User Disconnected');
  })
});
io.listen(SOCKET_PORT);
console.log('Socket working on ' + SOCKET_PORT);

module.exports = app;
