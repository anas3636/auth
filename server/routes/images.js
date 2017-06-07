'use strict';

var ctrls = require('../controllers/index.js');

module.exports = function(router) {

  // Proposals  images
  router.route('/proposals/:proposalId/images')
        // all proposal images
        .get(ctrls.proposalsImages.listImages)
        .post(ctrls.proposalsImages.addImages)


  router.route('/proposals/:proposalId/images/:imageId')
        // create a new proposal image
        .post(ctrls.proposalsImages.addImage)
        .delete(ctrls.proposalsImages.deleteImage)
        .patch(ctrls.proposalsImages.updateImage)

  // Project images
  // In project routes

  // Image edition not depending of the content is is associated to
  router.route('/images/:imageId')
        .get(ctrls.images.retrieve)
        .delete(ctrls.images.delete)
        .patch(ctrls.images.update)
};
