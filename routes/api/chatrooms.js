const mongoose = require('mongoose');
const router = require('express').Router();
const ChatRoom = mongoose.model('ChatRoom');
const User = mongoose.model('User');
const auth = require('../auth');
const { app } = require('./../../server');

router.post('/create', auth.required, (req, res, next) => {
  const chatId = new ObjectId();
  const chatDetails = req.body.chat;
  console.log(req.payload);
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStatus(401); }

    let chat = new ChatRoom({
      _id: chatId,
      roomName: chatDetails.name,
      roomDescription: chatDetails.desciption,
      roomImage: chatDetails.image
    });

    return chat.save().then((chat) => {
      res.send(chat);
    });
  });
});

router.get('/test', auth.optional, (req, res, next) => {
  console.log(app);
  return res.status(200).json({ message: 'Required auth: Worked in chat' });
});

module.exports = router;