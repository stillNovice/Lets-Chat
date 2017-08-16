const path = require('path');
var express = require('express');
var app = express();
//app.listen(process.env.PORT || 3000);

var server = require('http').createServer(app);

var socketServer = require('socket.io')(server.listen(process.env.PORT || 8478));

// serving static files.
app.use(express.static(path.join(__dirname, 'public')));

// setting up main route.
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var allUsers = [];  // array of "all users" Active
var typingUsersSet = [];  // array of all UNIQUE users currently Typing

socketServer.sockets.on("connection", function(socket) {
  console.log('connected at serverside - ', socket.id);

  /* SECTION - receiving the message from user input and firing an event that will display the message on UI. */
  socket.on("oldMessage", function(data) {
    socketServer.sockets.emit("newMessage", {msg: data.msg, user: socket.currentUser});
  });

  /* SECTION - adding the current user in "all users" list and then firing an event that displays all users on UI. */
  socket.on("thisUser", function(data) {
    socket.currentUser = data.user;
    socket.userStatus = data.onlineStatus;

    // pushing the current user in "all users" array.
    allUsers.push({
      id: socket.id,                  // storing user id.
      user: socket.currentUser,       // storing user name.
      status: socket.userStatus       // storing user status as Offline or Away.
    });

    // server emitting "all-Users" event to show "all users" name on the Page.
    socketServer.sockets.emit("all-Users", allUsers);
  });

  /* SECTION - Operations done after the socket gets disconnected. */
  socket.on('disconnect', function(data) {
    console.log('disconnected at serverside - ', socket.id);
    // removing the user if the socket connection ends.

    // removing the user with id equal current sockets id(disconnected socket) from "all users" list.
    var tempAllUsers = [];
    tempAllUsers = allUsers.filter(function(item) {
      return item.id != socket.id;
    });

    allUsers = tempAllUsers.slice();

    // removing typing user if the socket connection ends.

    // removing the user with id equal current sockets id(disconnected socket) from "typing users" list.
    var tempTypingUsersSet = [];
    tempTypingUsersSet = typingUsersSet.filter(function(item) {
      return item.uId != socket.id;
    });
    typingUsersSet = tempTypingUsersSet.slice();

    // after removing the disconnected user, show the remaining users on the Page.
    socketServer.sockets.emit("all-Users", allUsers);

    // getting the unique set of "typing users".
    var uniqArr = typingUsersSet.filter(function(item, idx) {
      return typingUsersSet.indexOf(item) == idx;
    });

    typingUsersSet = uniqArr.slice();

    // showing the name of the users currently typing on the UI.
    socketServer.sockets.emit('showTypingUsers', typingUsersSet);
  });

  /* SECTION - Update the current user's status as Online/Away  */
  socket.on('updateUserStatus', function(status) {
    for (var i = 0; i < allUsers.length; i++) {
      if(allUsers[i].id == socket.id) {
        allUsers[i].status = status;
        socket.userStatus = status;
        break;
      }
    }

    // update the current user's status and fire an event that will show the status on UI.
    socketServer.sockets.emit("all-Users", allUsers);
  });

  /* SECTION - adding the current user in the typingUsersSet */
  socket.on('addTypingUsers', function() {
    // adding the current user in "typing users" list.
    typingUsersSet.push({
      uId: socket.id,             // current users id.
      uName: socket.currentUser   // current users name.
    });

    var uniqArr = typingUsersSet.filter(function(item, idx) {
      return typingUsersSet.indexOf(item) == idx;
    });

    typingUsersSet = uniqArr.slice();

    // after adding the current user in the "typing users" list, show all the active typing as typing on UI.
    socketServer.sockets.emit('showTypingUsers', typingUsersSet);
  });

  /* SECTION - removing the current user from the typingUsersSet */
  socket.on('removeTypingUsers', function() {
    // removing the current user from "typing users" list.
    var tempTypingUsersSet = [];
    tempTypingUsersSet = typingUsersSet.filter(function(item) {
      return item.uId != socket.id;
    });
    typingUsersSet = tempTypingUsersSet.slice();

    var uniqArr = typingUsersSet.filter(function(item, idx) {
      return typingUsersSet.indexOf(item) == idx;
    });

    typingUsersSet = uniqArr.slice();

    // after adding the current user in the "typing users" list, show all the active typing as typing on UI.
    socketServer.sockets.emit('showTypingUsers', typingUsersSet);
  });

  socket.on('error', function(err) {
    console.error(err);
  })
});


