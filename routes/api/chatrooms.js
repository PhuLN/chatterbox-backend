const mongoose = require('mongoose');
const router = require('express').Router();

const ChatRoom = mongoose.model('ChatRoom');
const User = mongoose.model('User');

const auth = require('../auth');

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
  let io = req.app.get('socket');
  
  req.app.get('user').join('room1');
  io.to('room1').emit("test1", "test1");
  return res.status(200).json({ message: 'Required auth: Worked in chat' });
});

router.post('/testmsg', auth.optional, (req, res, next) => {
  let io = req.app.get('socket');

  io.to('room1').emit("send", req.body.message);
  return res.status(200).json({ message: 'Required auth: Worked in chat' });
})

module.exports = router;