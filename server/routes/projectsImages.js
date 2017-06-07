'use strict';

const ctrls = require('../controllers/index.js');

module.exports = function(router) {

  router.route('/projects/:projectId/images/:imageId/cover')
        .patch(ctrls.projectsImages.setCoverImage);
        // there is not route to unset cover
        // as it is by selecting another image
        // that we replace the cover

  router.route('/projects/:projectId/images/:fieldId')
        // List all images in a defined field
        .get(ctrls.projectsImages.list);

  router.route('/projects/:projectId/images/:imageId')
        .delete(ctrls.projectsImages.deleteProjectImage);

}
