'use strict';
/**
 * A selection is a selection of an architect
 * To a project proposal
 */
var ctrls = require('../controllers/index.js');

module.exports = function(router) {

  // Get info about a selection
  router.route('/selections/:selectionId')
        .get(ctrls.selections.retrieve)

  // Validate (by the selected archi)
  router.route('/selections/:selectionId/validate')
        .patch(ctrls.selectionsValidate.validate)

  // Unvalidate (by the selected archi)
  router.route('/selections/:selectionId/unvalidate')
        .patch(ctrls.selectionsValidate.unvalidate)

  // All the selections made by BAM
  router.route('/selections')
        .get(ctrls.selections.list)

}
