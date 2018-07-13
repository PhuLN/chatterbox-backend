require('./config/index');
require('./models/User');
require('./models/ChatRoom');
require('./models/Message');
require('./models/InviteCode');
require('./config/passport');

const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      socketio = require('socket.io'),
      passport = require('passport'),
      { mongoose } = require('./config/mongoose');
      port = process.env.PORT || 3000;

let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);

app.use(bodyParser.json());
app.use(cors());
app.use(require('./routes'));

io.on('connection', (socket) => {
  app.set('user', socket);
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('attemptJoinChat', (chat) => {
    Object.keys(socket.rooms).forEach((room) => {
      socket.leave(room);
      console.log(`Left room ${room}`);
    });
    socket.join(chat, () => {
      io.to(chat).emit('newUserJoined');
      console.log(`Joined room ${chat}`);
    });
  });

  socket.on('sendMessage', (message) => {
    console.log(message);
    io.to(Object.keys(socket.rooms)[0]).emit('newMessage', message);
  })
});

server.listen(port, () => {
  console.log(`Chat server has been started on port ${server.address().port}`);
});

module.exports = { app }