const { Router } = require('express');
const passport = require('passport');
const {setUserToken} = require('../utils/jwt');

const router = Router();

// passport local 로 authenticate 하기
router.post('/', passport.authenticate('local', {session: false}), (req, res, next) => {
  setUserToken(res, req.user); // jwt 사용
  res.redirect('/');
  
});

module.exports = router;
