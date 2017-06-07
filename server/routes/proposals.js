'use strict';

var ctrls = require('../controllers/index.js');

module.exports = function(router) {

  // List all proposals (for BAM team)
  router.route('/proposals')
        .get(ctrls.proposals.list)

  // Manage the proposal
  router.route('/proposals/:proposalId')
        // By bam team, client or the author architect
        .get(ctrls.proposals.retrieve)
        // by an architect or BAM team
        .patch(ctrls.proposals.update)
        // not used at first
        // .delete(ctrls.proposals.delete)

  router.route('/proposals/:proposalId/validate')
        .patch(ctrls.proposals.validate)

  // List the proposals associated with an offer
  // used in the offer proposal tab
  router.route('/offers/:offerId/proposals')
        .get(ctrls.proposals.listByOffer)
        .post(ctrls.proposals.createOfferProposal)

  router.route('/offers/:offerId/proposals/architects/:architectId')
        .get(ctrls.proposals.listByOfferByArchi)

  // List all architect proposals (useful for the architect)
  router.route('/architects/:architectId/proposals')
        .get(ctrls.proposals.listByArchi)

}
