const http = require('http'),
      path = require('path'),
      express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      passport = require('passport'),
      mongoose = require('mongoose');

const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = require('socket.io').listen(server);

app.use(cors)
app.use(bodyParser.json());

server.listen(port, () => {
  console.log(`Chat server has been started on port ${port}`);
})