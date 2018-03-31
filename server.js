require('./config/index');
require('./models/User');
require('./config/passport');

const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      passport = require('passport'),
      { mongoose } = require('./config/mongoose');
      port = process.env.PORT || 3000;

let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);


app.use(bodyParser.json());
app.use(cors());
app.use(require('./routes'));

io.on('connection', function(socket) {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
})

server.listen(port, () => {
  console.log(`Chat server has been started on port ${server.address().port}`);
})