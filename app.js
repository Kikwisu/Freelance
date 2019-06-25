var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var privateOffice = require('./routes/privateOffice');
var admin = require('./routes/admin');
var reqOfOrders = require('./routes/reqOfOrders');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', (message) => {
    wss.broadcast(message)
  });
});

wss.broadcast = function broadcast(msg) {
  wss.clients.forEach(function each(client) {
    client.send(msg);
  });
};

var app = express();

let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(allowCrossDomain);

// view engine setup
/*app.engine('html', cons.swig)*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'i need more beers',
  resave: false,
  saveUninitialized: false,
  // Место хранения можно выбрать из множества вариантов, это и БД и файлы и Memcached.
  store: new MongoStore({
    url: 'mongodb://127.0.0.1:27017/usersSessions'
  }),
  cookie: {
    maxAge: 24*60*60*1000 //вот в этом объекте задается время жизни сессии
  }

}));



app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/privateOffice', privateOffice);
app.use('/admin', admin);
app.use('/reqOfOrders', reqOfOrders);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
