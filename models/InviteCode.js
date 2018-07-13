const mongoose = require('mongoose');
const validator = require('validator');

let InviteCodeSchema = new mongoose.Schema({
  code: {
    type: mongoose.Schema.ObjectId,
    auto: true,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
  },
  isSingleUse: {
    required: true,
    type: Boolean,
    default: true,
  },
  expiresIn: {
    required: true,
    type: Number,
    default: 900,
  },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  usePushEach: true,
  timestamps: true,
});

mongoose.model('InviteCode', InviteCodeSchema);