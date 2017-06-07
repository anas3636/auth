'use strict';
const debug = require('debug')('usersInvites');

// Modules
const firebase = require('../firebase/index');
const airtable = require('../airtable/index');
const emails = require('../emails/index');

const async = require('async');
const Promise = require('bluebird');


/**
 * STEP 1
 * Create a firebase user from a user object with email
 *
 * @param {object} invite An invite user object
 * @param {string} invite.email the email of the user to create
 */
var createFirebaseUser = (invite) => {
  return new Promise((resolve, reject) =>  {
    debug('STEP 1 / Creating firebase user', invite);
    firebase.auth.createUserFromEmail(invite)
    .then(
    (fbUser) => {
      resolve({
        fbUser: fbUser,
        invite: invite,
      });
    },
    (err) => {
      reject(err)
    });
  });
};

/**
 * STEP 2
 * Create a user in airtable from the info of firebase auth
 *
 * @param {object} inviteObject an object with cumulated steps information
 */
var createAirtableUser = (inviteObject) => {
  return new Promise((resolve, reject) =>  {
    debug('STEP 2 / Creating airtable user');
    airtable.create('users', {
      firebaseID: inviteObject.fbUser.uid,
      email: inviteObject.fbUser.email
    })
    .then(
      (atUser) => {
        inviteObject.atUser = atUser;
        resolve(inviteObject);
      },
      (err) => {
        reject(err)
      }
    );
  });
};

/**
 * STEP 3
 * Create an architect record in airtable linked to the user
 *
 * @param {object} inviteObject an object with cumulated steps information
 */
 var createAirtableArchitect = (inviteObject) => {
   return new Promise((resolve, reject) =>  {
     debug('STEP 3 / Creating airtable archi');
     airtable.create('architects', {
       user: inviteObject.fbUser.uid,
       email: 'lucas.sebastien@gmail.com' /*inviteObject.fbUser.email*/,
       name: inviteObject.invite.architect || 'Nouvelle agence',
     })
     .then(
       (atArchi) => {
         inviteObject.atArchi = atArchi;
         resolve(inviteObject);
       },
       (err) => {
         reject(err)
       }
     );
   });
};

/**
 * STEP 4
 * Send email to the invited architect
 *
 * @param {object} inviteObject an object with cumulated steps information
 */
 var sendEmail = (inviteObject) => {
   return new Promise((resolve, reject) =>  {
     debug('STEP 4 / Sending mail to the user');
     emails.send('invitation', {
      email: inviteObject.invite.email,
      name: inviteObject.invite.name,
      archiId: inviteObject.atArchi.id,
      userId: inviteObject.atUser.id,
    }).then(
      (emailStatus) => {
        inviteObject.email = emailStatus;
        resolve(inviteObject);
      },
      (err) => {
        reject(err)
      }
    );
  });
};

/**
 * Process a list of user to invites
 *
 * @param  {array} users an array of users to invite
 * @return {Promise<users>} A promise that resolves with the created users
 */
exports.process = function(users) {
  debug('Going to send invites to all invitables architects.', users);
  return new Promise(function (resolve, reject) {

    // First we take only one user
    let userExample = users[0];
    createFirebaseUser(userExample)
    .then(createAirtableUser)
    .then(createAirtableArchitect)
    .then(sendEmail)
    .then((data) => {
      resolve(data);
    });
  });
};
