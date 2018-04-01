const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const User = mongoose.model('User');
const auth = require('../auth');

router.post('/users/signup', (req, res, next) => {
  let user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password).then(() => {
    user.save().then(() => {
      return res.json({ user: user.authenticatedJSON() });
    }).catch(next);
  });
});

router.post('/users/login', (req, res, next) => {
  if (!req.body.user.email || !req.body.user.password) {
    return res.status(422).json({ error: 'Missing fields' })
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {return next(err); }
    if (user) {
      return res.json({ user: user.authenticatedJSON() })
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.get('/users/test', auth.required, (req, res, next) => {
  return res.status(200).json({ message: 'Worked' });
})

module.exports = router;