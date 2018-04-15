const mongoose = require('mongoose');
const validator = require('validator');

let ChatRoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
    index: true,
  },
  roomDescription: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 60,
    trim: true,
  },
  roomImage: {
    type: String,
    default: 'https://cdn.discordapp.com/avatars/143067792957112320/653c0b2651682704d8f5d238124c4ac4.jpg?size=2048',
    validate: [{
      validator: value => validator.isURL(value),
      message: 'Provided URL is not a png or jpg image'
    }]
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

mongoose.model('ChatRoom', ChatRoomSchema);