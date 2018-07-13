const mongoose = require('mongoose');
const router = require('express').Router();
const { ObjectId } = require('mongodb');

const ChatRoom = mongoose.model('ChatRoom');
const User = mongoose.model('User');
const Invite = mongoose.model('InviteCode');

const auth = require('../auth');

router.post('/create', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.status(401).json({ error: 'User does not exist or is not authenticated properly' }); }
    
    ChatRoom.findById(req.body.chatId).then((chatroom) => {
      if (!chatroom) { return res.status(404).json({ error: 'Chatroom not found' }); }

      let userHasAccess = chatroom.members.some((room) => {
        return room.equals(user._id);
      });

      if (userHasAccess) {
        let invite = new Invite({
          chatId: chatroom._id,
          isSingleUse: req.body.isSingleUse,
        });

        return invite.save().then((inv) => {
          res.send(inv);
        });
      } else {
        return res.status(403).json({ error: 'You do not have access to that chatroom' });
      }
    });
  });
});

router.post('/join', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.status(401).json({ error: 'User does not exist or is not authenticated properly' }); }
    Invite.findOne({ code: req.body.invite }).then((inv) => {
      if (!inv) { return res.status(404).json({ error: 'Invite code does not exist' }); }

      if (inv.isSingleUse && inv.usedBy.length > 1) {
        return res.status(401).json({ error: 'Invite code use limit has been reached' }); 
      } else {
        Invite.findOneAndUpdate({ _id: inv._id }, {
          $push: { usedBy: user }
        }).then((invite) => {
            ChatRoom.findOneAndUpdate({ _id: inv.chatId }, {
              $addToSet: { members: user }
            }).then((chat) => {
              return res.send(chat);
            });
          });
      }
    }).catch(() => res.status(400).json({ error: 'Invite code is not valid' }));
  });
});
module.exports = router;