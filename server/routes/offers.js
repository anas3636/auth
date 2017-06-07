'use strict';

var ctrls = require('../controllers/index.js');

module.exports = function(router) {

  // All offers (for BAM team)
  router.route('/offers')
        .get(ctrls.offers.list)

  router.route('/offers/:offerId')
        // By bam team, client or the author architect
        .get(ctrls.offers.retrieve)
        // by an architect or BAM team
        .patch(ctrls.offers.update)
        // not used at first
        // .delete(ctrls.proposals.delete)

  // Validate the offer
  // trigger the mailing to the client...
  router.route('/offers/:offerId/validate/byadmin')
        .patch(ctrls.offers.admiValidate)

  // An admin select this architect
  router.route('/offers/:offerId/select/:architectId')
        .post(ctrls.selectionsCreate.send)

  router.route('/offers/:offerId/selections')
        .get(ctrls.selections.byOffer)

  router.route('/offers/:offerId/selections/architects/:architectId')
        .get(ctrls.selections.byArchiAndOffer)
}
