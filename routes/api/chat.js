const mongoose = require('mongoose');
const router = require('express').Router();
const { ObjectId } = require('mongodb');

const ChatRoom = mongoose.model('ChatRoom');
const User = mongoose.model('User');
const Message = mongoose.model('Message');

const auth = require('../auth');

router.post('/create', auth.required, (req, res, next) => {
  const messageDetails = req.body.message;
  
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.status(401); }
    
    ChatRoom.findById(messageDetails.chatId).then((chatroom) => {
      if (!chatroom) { return res.status(404).json({ error: 'Chatroom not found' }); }

      let userHasAccess = chatroom.members.some((room) => {
        return room.equals(user._id);
      });

      if (userHasAccess) {
        let message = new Message({
          author: user,
          inGroup: chatroom,
          message: messageDetails.text
        });

        return message.save().then((msg) => {
          res.send(msg);
        });
      } else {
        return res.status(403).json({ error: 'You do not have access to that chatroom' });
      }
    });
  });
});

router.get('/chatmessages', auth.required, (req, res, next) => {
  ChatRoom.findById(req.query.chatId).then((chat) => {
    if (!chat) { return res.status(404).json('Chatroom not found'); }

    let userHasAccess = chat.members.some((room) => {
      return room.equals(req.payload.id);
    });

    if (userHasAccess) {
      Message.find({ inGroup: chat._id }).then((messages) => {
        if (!messages) { return res.status(401); }

        return res.status(200).send(messages);
      });
    }
  });
});


module.exports = router;