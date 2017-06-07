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
  require('./auth')(app, passport);

  app.use(config.api.base, router);

  // Just to test that api is working
  router.route('/status')
  .get(auth.requiresLogin,function(req, res) {
    res.send('The api is working!');
  });

  // Portfolio seciton
  require('./architects')(router);

  expressListRoutes({ prefix: config.api.base }, 'API routes:', router);
};
