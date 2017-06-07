'use strict';
const _ = require('lodash');
const airtableFields = 'fields';

/**
 * Format the airtable response
 */
module.exports = function(response) {
  if (_.isArray(response)) {
    return _.map(response, (iteratee) => { return iteratee[airtableFields] });
  }
  else if (_.isObject(response)) {
    return response[airtableFields];
  }
  return null;
};
