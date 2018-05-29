const mongoose = require('mongoose');
const router = require('express').Router();
const { ObjectId } = require('mongodb');

const ChatRoom = mongoose.model('ChatRoom');
const User = mongoose.model('User');
const Message = mongoose.model('Message');

const auth = require('../auth');

router.post('/create', auth.required, (req, res, next) => {
  const chatId = new ObjectId();
  const messageDetails = req.body.message;

  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStatus(401); }
    
    ChatRoom.findById(messageDetails.chatId).then((chatroom) => {
      if (!chatroom) { return res.sendStatus(404).json({ error: 'Chatroom not found' }); }

      let userHasAccess = chatroom.members.some ((room) => {
        return room.equals(user._id);
      });

      if (userHasAccess) {
        let message = new Message({
          author: user,
          inGroup: chatroom,
          message: messageDetails.text
        });

        return message.save().then((msg) => {
          res.sendStatus(200).send(chat);
        });
      } else {
        return res.sendStatus(403).json({ error: 'You do not have access to that chatroom' });
      }
    });
  });
});

module.exports = router;