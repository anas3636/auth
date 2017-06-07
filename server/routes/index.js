'use strict';

var config = require('../config');
var debug = require('debug')('routes');

// https://github.com/labithiotis/express-list-routes
var expressListRoutes = require('express-list-routes');
var express = require('express');
var router = express.Router();
const auth = require('../config/middlewares/authorizations');


/**
 * Routes definition
 */
module.exports = function(app, passport) {

  app.use(config.api.base, router);

  // Set Routes
  require('./auth')(router, passport);
  require('./architects')(router);
  require('./projects')(router);

  expressListRoutes({ prefix: config.api.base }, 'API routes:', router);
};
