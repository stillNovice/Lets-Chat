const path = require('path');
var express = require('express');
var app = express();
//app.listen(process.env.PORT || 3000);
var server = require('http').createServer(app);

var socketServer = require('socket.io')(server.listen(process.env.PORT || 8478));

//console.log('connection started');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var allUsers = [];
socketServer.sockets.on("connection", function(socket) {
  console.log('connected at serverside - ', socket.id);

  socket.on("oldMessage", function(data) {
    //console.log(data.msg);
    socketServer.sockets.emit("newMessage", {msg: data.msg, user: socket.currentUser});
  });

  socket.on("thisUser", function(data) {
    socket.currentUser = data.user;
    socket.userStatus = data.onlineStatus;

    allUsers.push({
      user: socket.currentUser,
      status: socket.userStatus
    });

    //console.log('inside this user - ', allUsers);
    socketServer.sockets.emit("all-Users", allUsers);
  });

  socket.on('disconnect', function(data) {
    console.log('inside disconnect');
    allUsers.splice(allUsers.indexOf({
      user: socket.currentUser,
      status: socket.userStatus
    }), 1);
    //console.log(allUsers,' disconnected');
    socketServer.sockets.emit("all-Users", allUsers);
  });

  socket.on('updateUserStatus', function(status) {
    for (var i = 0; i < allUsers.length; i++) {
      if(allUsers[i].user == socket.currentUser) {
        allUsers[i].status = status;
        socket.userStatus = status;
        break;
      }
    }
    //console.log('allUsers ------ ', allUsers);
    socketServer.sockets.emit("all-Users", allUsers);
  });

  socket.on('error', function(err) {
    console.error(err);
  })
});


