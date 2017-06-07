'use strict'
var ctrls = require('../controllers');

module.exports = function(router, passport) {
    // process the login form
    router.route("/login")
      .post(passport.authenticate('local-login'), ctrls.auth.login);

    // handle logout
    router.route("/logout")
      .post(ctrls.auth.logout)

    // loggedin
    router.route("/loggedin")
      .get(ctrls.auth.loggedin);

    // signup
    router.route("/signup")
      .post(ctrls.auth.signup);

};
