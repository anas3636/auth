'use strict';
// Sync all projects from airtable to firebase
var _ = require('lodash');
var async = require('async');
var path = require('path');
var config = require('../../config')();
var debug = require('debug')('AirtableSyncObjects');
var Airtable = require('airtable');
var utils = require('./utils');
var base = new Airtable({ apiKey: config.airtable.apiKey }).base(config.airtable.base);
var firebase = require('../firebase');

// Sync airtable projects to firebase
// table: projects / architects...
module.exports = function(req, res, table) {
  var items = 0;
  base(table)
  .select(config.airtable.requestOptions)
  .eachPage(function page(records, fetchNextPage) {

    async.each(utils.recordsMap(records), function(record, cb) {
      firebase.save[table](utils.recordMap(record))
      .then(function() {
        items++;
        debug(table + ' object ' + object.id + ' saved in firebase');
        cb();
      },
      function(err) {
        debug('error at saving object to firebase', err);
      })
    }, function(err) {
      utils.asyncDone(fetchNextPage);
    });
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
  }, function done(err) {
      utils.queryDone(err, res, { items: items, table: table});
  });
}
