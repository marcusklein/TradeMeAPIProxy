var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiUrl = process.env.API_URL || 'https://api.tmsandbox.co.nz'; // change this if needed
const consumerKey = process.env.CONSUMER_KEY || 'add your consumer key here';
const oauthSignature = process.env.OAUTH_SIGNATURE || 'add your oath sig here';

app.get('*', function(req, res){
  console.log("starting");
  console.log(`${apiUrl} ${consumerKey} ${oauthSignature}`);

  var userReq = req.originalUrl;

  var url = `${apiUrl}${userReq}`;

  var options = {
    url: url,
    method: 'GET',
    headers: {
      'Authorization' : `OAuth oauth_consumer_key="${consumerKey}", oauth_signature_method="PLAINTEXT", oauth_signature="${oauthSignature}&"`
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.send(data);
    } else if (error) {
      console.error(error);
    } else {
      res.send(body);
    }
  }

  request(options, callback);

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
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
