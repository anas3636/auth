'use strict';

var ctrls = require('../controllers/index.js');

module.exports = function(router) {
  // Simple message send via the button
  router.route('/messages/:archiId')
        // Send a message to an architect
        .post(ctrls.messages.create)
}
