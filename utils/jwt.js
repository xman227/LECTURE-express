const jwt = require('jsonwebtoken');

const secret = 'hsm';

const test = 'sd';


exports.secret = secret;

exports.setUserToken = (res, user) => {
  // 유저 jwt 토큰생성
  const token = jwt.sign(user, secret);
  // 토큰을 쿠키로 전달
  res.cookie('token', token);
}