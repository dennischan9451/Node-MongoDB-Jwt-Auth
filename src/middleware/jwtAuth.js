const jwt = require('jsonwebtoken');
const auth = require('express-jwt');
const crypto = require('crypto');
const uuid = require('uuid/v4');
const blacklist = require('express-jwt-blacklist');
const config = require('../config/app');

const refreshTokenList = {};

if (config.environment === 'production') {
  blacklist.configure({
    store: {
      type: config.blacklist.type,
      host: config.blacklist.host,
      port: config.blacklist.port,
      keyPrefix: config.blacklist.keyPrefix,
    },
  });
}

const authorize = auth({
  secret: config.jwt.secret,
  isRevoked: blacklist.isRevoked,
});

const decodeToken = (err, req, res, next) => {
  if (err.inner instanceof jwt.TokenExpiredError) {
    const token = req.headers.authorization.split(' ')[1];
    const { payload } = jwt.decode(token, { complete: true });
    const exp = refreshTokenList[payload.refreshToken];

    if (exp && new Date(exp).isAfter(new Date())) {
      req.user = payload;

      return next();
    }
  }

  return next(err);
};

const revokeToken = ({ user }, res, next) => {
  blacklist.revoke(user);
  delete refreshTokenList[user.refreshToken];

  next();
};

const generateToken = ({ user, result }, res) => {
  const refreshToken = crypto.createHash('sha256').update(uuid()).digest('hex');

  const token = jwt.sign({
    sub: user._id.toString(),
    email: user.email,
    permissions: user.permissions,
    refreshToken,
  }, config.jwt.secret, { expiresIn: config.jwt.accessExp });

  refreshTokenList[refreshToken] = new Date().addSeconds(config.jwt.refreshExp);

  res.header('Authorization', token);
  res.json(result);
};

module.exports = {
  authorize,
  decodeToken,
  revokeToken,
  generateToken,
};
