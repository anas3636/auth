'use strict';

var ctrls = require('../controllers/index.js');

module.exports = function(router) {
  // upload from the front
  // with the ui-upload-uploadcare component
  // the file is already uploaded by the front
  // but a synchronisation (airtable + firebase) is necessary
  // webhook cannot be used because we also need the projectId
  // to associate the upload with the current project
  router.post('/uploadcare/project/:projectId/upload', ctrls.uploadcare.uploadImagesInProject);

  // Could not use web hook as we need more context
  // Like the id of the project to update
  // router.post('/uploadcare/webhook', ctrls.uploadcare.webhook);
  // router.get('/uploadcare/webhook', ctrls.uploadcare.webhook);
}
