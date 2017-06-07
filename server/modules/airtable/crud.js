'use strict';

const config = require('../../config')();
const debug = require('debug')('AirtableCrud');
const Airtable = require('airtable');
const base = new Airtable({ apiKey: config.airtable.apiKey }).base(config.airtable.base);
const Promise = require('bluebird');

const debugAction = (custom, method, table, data) => {
  custom = custom || '';
  debug(custom, method + ' ' + table + ' airtable record with ', data);
  // Logging
};

/**
 * Save a record in airtable
 * Wrap the airtable SDK
 *
 * @param {string} action update / create / destroy
 * @param {string} id id of the element to update or delete / null if create
 * @param {string} tableName table name
 * @param {object} fields fields to use for record // need to be at the correct airtable format
 * @param {object} airtable instantiated base to use instead of the default
 */
const saveData = (action, id, tableName, fields, baseOverride) => {
  debugger;
  let workingBase = (baseOverride) ? baseOverride : base;
  return new Promise((resolve, reject) => {
    if (!baseOverride && base) {
      debug('using default airtable base');
    } else if  (baseOverride) {
      debug('using baseoverride passed by the caller');
    }
    else {
      reject('No valid base to save in airtable');
    }
    var handleResult = (err, results) => {
      if (err) {
        debugAction('error', action, tableName, err);
        reject(err);
      }
      debugAction('success', action, tableName);
      resolve(results);
    };

    switch (action) {
      // Create
      // fields, function
      case 'create':
        debugAction('starting', action, tableName);
        workingBase(tableName)
        .create(fields, handleResult);
      break;

      // Update
      // id, fields, function
      case 'update':
        debugAction('starting', action, tableName);
        workingBase(tableName)
        .update(id, fields, handleResult);
      break;

      // Delete
      // id, function
      case 'find':
        workingBase(tableName)
        .find(id, handleResult);
      break;

      // Retrieve
      // id, function
      case 'retrieve':
        workingBase(tableName)
        .find(id, handleResult);
      break;

      case 'findWithFields':
        workingBase(tableName)
        .find(id, fields, handleResult);

      default:
        reject('No valid airtable action method');
    }
  });
};

var crud = {};

/**
 * Crud functions called from all modules & controllers
 *
 * @param {string} id of the record pass null for create
 * @param {string} tableName name of the table
 * @param {object} fields Data to save pass null for delete & retrieve
 * @param {base} object Optional override airtable base defined in the controllers
 */
// id is ignored
crud.create = function(id, tableName, fields, base) {
  return saveData('create', null, tableName, fields, base);
};

crud.update = function(id, tableName, fields, base) {
  return saveData('update', id, tableName, fields, base);
};

// fields is ignored
crud.delete = function(id, tableName, fields, base) {
  if (config.airtable.softDeletion && config.airtable.softDeletionBolean) {
    let softDeletionFields = {};
    softDeletionFields[config.airtable.softDeletionBolean] = true;
    return saveData('update', id, tableName, softDeletionFields, base);
  } else {
    return saveData('destroy', id, tableName, null, base);
  }
};

// fields is ignored
crud.retrieve = function(id, tableName, fields, base) {
  debug('crud retrieve ', id, tableName, fields);
  return saveData('find', id, tableName, null, base);
};

// fields are used
crud.retrieveWithFields = function(id, tableName, fields, base) {
  debug('crud retrieve ', id, tableName, fields);
  return saveData('find', id, tableName, fields, base);
};

module.exports = crud;
