var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var weixin = require('./routes/weixin');
var validate = require('./routes/validate');
var ticketsinfo = require('./routes/ticketsinfo');
var login = require('./routes/login');
var actinfo = require('./routes/activity_info');
var chooseat = require('./routes/choose_seat');
var chooarea = require('./routes/choose_area');
var logout = require('./routes/logout');
var acquireid = require('./routes/acquireid');

var app = express();

process.on('uncaughtException', function(err)
{
    console.log("****LETHAL EXCEPTION!!!******");
    if (err.stack)
        console.log(err.stack);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'Bingo Lingo!', saveUninitialized: false, resave: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/weixin', weixin);
app.use('/', routes);
app.use('/ticketsinfo', ticketsinfo);
app.use('/actinfo', actinfo);
app.use('/chooseseat', chooseat);
app.use('/choosearea', chooarea);
app.use('/users', users);
app.use('/login', login);
app.use('/validate', validate);
app.use('/logout', logout);
app.use('/acquireid', acquireid);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace

app.use(function(err, req, res, next) {
  console.error(err.stack);
  next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
