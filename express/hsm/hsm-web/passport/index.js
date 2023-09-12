const passport = require('passport');

const local = require('./strategies/local');
const jwt = require('./strategies/jwt');

module.exports = () => {
  passport.use(local);
  passport.use(jwt);


  // 세션을 사용하는 경우
  // passport.serializeUser((user, callback) => {
  //   callback(null, user);
  // });

  // passport.deserializeUser((obj, callback) => {
  //   callback(null, obj);
  // });
};