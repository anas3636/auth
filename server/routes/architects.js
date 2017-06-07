'use strict';

var ctrls = require('../controllers');

module.exports = function(router) {

  router.route('/architectsair')
        // Get all architects
        .get(ctrls.architects.list)
        // Create an architect
        //.post(ctrls.architects.create);
  router.route('/architectsmongo')
        // Get all architects
        .get(ctrls.architects.listM)
}
