'use strict';

const config = require('../../config')();
const debug = require('debug')('AirtableList');
const Airtable = require('airtable');
const base = new Airtable({ apiKey: config.airtable.apiKey }).base(config.airtable.base);
const Promise = require('bluebird');
const requestOptions = config.airtable.requestOptions;
const _ = require('lodash');

/**
 * Merge given options with list base options
 *
 * @param {object} options / Airtable API options object
 */
var addListBaseOptions = (options) => {
  if  (requestOptions.pageSize && !options.pageSize ) {
    options.pageSize = requestOptions.pageSize;
  }
  if (requestOptions.maxRecords && !options.maxRecords) {
    options.maxRecords = requestOptions.maxRecords
  }
  return options;
};

/**
 * Add a criteria in the request to hide softDeleted Items
 * if this mode is set
 * @param {object} options / Airtable API options object
 */
var addFalseDeletionExclude = (options) => {
  if (config.airtable.softDeletion && config.airtable.softDeletionBolean) {
    // @todo add the criteria
    // something like
    // &!config.airtable.softDeletionBolean
    return options;
  }
  return options;
};

/**
 * Retrieve the first page of results
 *
 * @param {object} table table name to use
 * @param {object} options All valid airtable api options
 * @param {object} baseOverride base name if we want to override default base
 */
exports.listFirstPage = (table, options, baseOverride) => {
  addFalseDeletionExclude(options);
  addListBaseOptions(options);
  let workingBase = (baseOverride) ? baseOverride : base;

  return new Promise((resolve, reject) => {
    debug('List airtable first page (no pagination) in tableName: >', table, options);
    workingBase(table).select(options)
    .firstPage(function(error, records) {
      // debug(error, records);
      if (error) {
       reject(error);
      }
      else {
        resolve(records);
      }
    });
  });
};

/**
 * Retrieve all pages of results (100 raw per 100 raw)
 *
 * @param {object} table table name to use
 * @param {object} options All valid airtable api options
 * @param {object} baseOverride base name if we want to override default base
 */
exports.listAllPages = (table, options, baseOverride) => {
  options = options || {};
  addFalseDeletionExclude(options);
  addListBaseOptions(options);
  let workingBase = (baseOverride) ? baseOverride : base;

  return new Promise((resolve, reject) => {
    let allRecords = [];
    workingBase(table).select(options)
    .eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        allRecords = _.union(allRecords, records);
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { reject(err); return; }
        resolve(allRecords);
    });
  });
};
