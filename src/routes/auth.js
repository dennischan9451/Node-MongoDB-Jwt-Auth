const express = require('express');
const {
  authorize, decodeToken, revokeToken, generateToken,
} = require('../middleware/jwtAuth');
const JsonResult = require('../results/json');
const NotifyResult = require('../results/notify');
const AuthService = require('../services/auth');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const authService = new AuthService();
    await authService.register(req.body);
    res.json(new NotifyResult('Registered successfully'));
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const authService = new AuthService();
    req.user = await authService.login(req.body);
    req.result = new NotifyResult('Login Successful!');
    next();
  } catch (err) {
    next(err);
  }
}, generateToken);

router.post('/logout', authorize, decodeToken, revokeToken, async (req, res, next) => {
  try {
    res.header('Authorization', null);
    res.send();
  } catch (err) {
    next(err);
  }
});

router.get('/refresh', authorize, decodeToken, revokeToken, async (req, res, next) => {
  try {
    const authService = new AuthService();
    req.user = await authService.findUserById(req.user.sub);
    next();
  } catch (err) {
    next(err);
  }
}, generateToken);

router.get('/user', authorize, async (req, res, next) => {
  try {
    const authService = new AuthService();
    const data = await authService.findUserById(req.user.sub);
    res.json(new JsonResult({ data }));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
