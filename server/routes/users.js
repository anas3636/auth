'use strict';

var ctrls = require('../controllers/index.js');
var mw = require('../middlewares/index.js');

module.exports = function(router) {
  // When a new account is created
  // We do a few tasks
  router.post('/users', ctrls.users.create);

  // :fbId is the firebase id of the user
  router.get('/users/:fbId', ctrls.users.retrieveFromFirebaseId);

  // Launch the password receover email... (using firebase API)
  // router.post('/users/password/recover', )

  // change the email (using firebase API)
  // how
  // router.put('/users/:userId')

  // change the password (using firebase API)
  // router.put('/users/password', )

  // Once the profile is loaded and we have the userId
  // we use airtable userId
  router.patch('/users/:userId', ctrls.users.update);

  // Invites users checked as invitable from a airtable table
  router.route('/users/invites/list')
        .get(ctrls.invites.listInvites)

  router.route('/users/invites/list/validate')
        .post(ctrls.invites.sendInvites);

  router.post('/users/invites/email', mw.debug.params, ctrls.invites.inviteEmail);
}

