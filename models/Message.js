const mongoose = require('mongoose');
const validator = require('validator');

let MessageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },
  message: {
    type: String,
    required: true,
  },
  
}, {
  timestamps: true
});

mongoose.model('Message', MessageSchema);