//Express
const express = require('express');
const join = require('path').join;
const debug = require('debug')('api');
const cors = require('cors');
const morgan = require('morgan');
//Get Config File
const config = require('./config');

//Init express APP
const app = express();
// Log activated
app.use(morgan('dev'))

app.use(express.static(join(__dirname , '../client')));
//load up Mongo model
require('./models');

//Passport
var passport = require('passport');
require('./config/passport')(passport); // pass passport for configuration

//Cookie and session
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(session({
  secret: 'this is the secret'
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//Body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
}));

// Enable cors for all  request
app.use(cors());

// //Load .env file
// var dotenv = require('dotenv');
// dotenv.load();

// routes ======================================================================
require('./routes')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(config.ports.api, function() {
  debug('API working on port ' + config.ports.api);
});
