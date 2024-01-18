
// modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const passport = require('passport');

// session
// const session = require('express-session');
// const MongoStore = require('connect-mongo');

const app = express();

//middlewares
const loginRequired = require('./middlewares/login-required');
const getUserFromJWT =  require('./middlewares/get-user-from-jwt');

app.locals.formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

// login 기능
require('./passport')();

// DB 기능
mongoose.connect('mongodb://127.0.0.1:27017/hsm-board');
mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected');
});


// Router
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts')
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session 을 사용하는 경우
// app.use(
//   session({
//     secret: 'elice',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: 'mongodb://127.0.0.1:27017/final-board',
//     }),
//     // 세션 스토어 사용하기
//   }),
// );

app.use(passport.initialize());
app.use(getUserFromJWT);
//app.use(passport.session()); // session 사용하는 경우

//router middlewares
app.use('/', indexRouter);
app.use('/posts', loginRequired, postsRouter);
app.use('/users', usersRouter);
app.use('/api', loginRequired, apiRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error
app.use((err, req, res, next) => {
  res.status(500);
  res.json({
      result: 'fail',
      error: err.message,
  });
});

module.exports = app;
