const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
    index: true,
    validate: [{
      validator: value => validator.isAlphanumeric(value),
      message: 'Only alpha-numeric characters are allowed'
    }]
  },
  email: {
    type: String,
		required: true,
		minlength: 6,
		maxlength: 40,
		trim: true,
		unique: true,
		validate: [{
				validator: value => validator.isEmail(value),
				message: 'Invalid email'
		}]
  },
  passwordHash: String,
  profileImage: {
    type: String,
    default: 'https://cdn.discordapp.com/avatars/143067792957112320/653c0b2651682704d8f5d238124c4ac4.jpg?size=2048',
    validate: [{
      validator: value => validator.isURL(value),
      message: 'Provided URL is not a png or jpg image'
    }]
  },
  chatrooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chatroom'
  }]
}, {
  timestamps: true
});

UserSchema.methods.setPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (hash) {
          this.passwordHash = hash;
          resolve();
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.methods.validatePassword = function (password) {
  bcrypt.compareSync(password, this.passwordHash, (err, res) => {
    return res;
  });
};

UserSchema.methods.generateJWT = function () {
  let today = new Date();
  let expiry = new Date(today);
  expiry.setDate(today.getDate() + 30);

  return jwt.sign({
    id: this._id,
    username: this.username,
    expiry: parseInt(expiry.getTime() / 1000),
  }, process.env.JWT_SECRET);
};

UserSchema.methods.authenticatedJSON = function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    profileImage: this.profileImage,
    token: this.generateJWT()
  };
};

mongoose.model('User', UserSchema);