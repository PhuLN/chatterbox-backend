const mongoose = require('mongoose');
const router = require('express').Router();
const { ObjectId } = require('mongodb');
const _ = require('lodash');

const ChatRoom = mongoose.model('ChatRoom');
const User = mongoose.model('User');

const auth = require('../auth');

router.post('/create', auth.required, (req, res, next) => {
  const chatId = new ObjectId();
  const chatDetails = req.body.chat;
  
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStatus(401); }

    let chat = new ChatRoom({
      _id: chatId,
      roomName: chatDetails.name,
      roomDescription: chatDetails.description,
      roomImage: chatDetails.image
    });
    chat.members.push(user);

    return chat.save().then((chat) => {
      res.send(chat);
    });
  });
});

router.get('/yourchats', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStatus(401); }

    ChatRoom.find({ members: user._id }).then((chats) => {
      return res.status(200).send(chats);
    });
  });
});

router.get('/chatmembers', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStatus(401); }

    ChatRoom.findById(req.query.chatId).populate('members').then((chat) => {
      const { members } = _.pick(chat, ['members']);
      return res.status(200).send(_.map(members , member => _.pick(member, ['_id', 'username', 'profileImage'])));
    });
  });
});

module.exports = router;