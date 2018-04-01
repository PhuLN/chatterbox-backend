const jwt = require('express-jwt');

function getTokenFromHeader(req){
  console.log(req.headers);
  if (req.headers.token) {
    return req.headers.token;
  }
  return null;
}

const auth = {
  required: jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;