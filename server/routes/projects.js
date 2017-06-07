'use strict';

const ctrls = require('../controllers/index.js');

module.exports = function(router) {

  // Create a project
  router.route('/projects')
        .get(ctrls.projectsList.list)
        .post(ctrls.projectsCrud.create);

  router.route('/projects/:projectId')
        // Get project information
        .get(ctrls.projectsCrud.retrieve)
        // for the moment list communicate directly with airtable or firebase
        // .get(ctrls.projects.list)

        // Edit project information
        .patch(ctrls.projectsCrud.update)
        // delete project
        .delete(ctrls.projectsDelete.deleteProjectWithoutImage);
}
