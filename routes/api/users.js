const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const User = mongoose.model('User');
const auth = require('../auth');

router.post('/users/signup', (req, res, next) => {
  if (!req.body.user.username || !req.body.user.email || !req.body.user.password) {
    if (req.body.user.email.length < 6) {
      return res.status(422).json({ error: 'Signup failed: email must be at least 6 characters long' }) 
    }
    return res.status(422).json({ error: 'Signup failed: missing fields' });
  }

  let user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;

  user.setPassword(req.body.user.password).then(() => {
    user.save().then(() => {
      return res.json({ user: user.authenticatedJSON() });
    }).catch((e) => {
      next();
      if (e.code === 11000) {
        return res.status(422).json({ error: 'Signup failed: Email or username is taken' });
      }
      return res.status(422).json({ error: e._message });
    });
  });
});

router.post('/users/login', (req, res, next) => {
  if (!req.body.user.email || !req.body.user.password) {
    return res.status(422).json({ error: 'Authentication failed: missing fields' })
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {return next(err); }
    if (user) {
      return res.json({ user: user.authenticatedJSON() })
    } else {
      return res.status(422).json({ error: 'Authentication failed: check your credentials' });
    }
  })(req, res, next);
});

router.get('/test', auth.required, (req, res, next) => {
  return res.status(200).json({ message: 'Required auth: Worked' });
});

module.exports = router;