'use strict';
const config = require('../../config')();

var _ = require('lodash');
var debug = require('debug')('Airtable');

// common way to save to firebase DB
exports.recordMap = (record) => {
  if (record && record.fields) {
    var object = record.fields;
    object.createdTime = record.createdTime;
    return object;
  }
  return record;
};

exports.recordsMap = (records) => {
  return _.mapValues(records, function(r) {
    return r._rawJson;
  });
};

// Get the json for query response
exports.getJson = (response) => {
  return response._rawJson;
}

// common way to handle query process ending
exports.queryDone = (err, res, opts) => {
  var items = opts.items || null;
  var table = opts.table || null;
  var action = opts.action || null;

  if (err) {
    debug('an error occured', err);
    res.status(500).send('Errors at syncing objects of table!', table)
  }
  debug('All ' + items + ' ' + table + ' have been saved');
  var returnObject  = {
    action: action,
    table: table,
    items: items,
  };
  debug(returnObject);
  res.json(returnObject);
};

exports.handleResult = () => {

};

// Common way to handle async process (looping in records)
exports.asyncDone = (err, cb) =>  {
  // if any of the file processing produced an error, err would equal that error
  if (err) {
    // One of the iterations produced an error.
    // All processing will now stop.
    debug('An error occured, the async processes were stopped early ', err);
  } else {
    debug('All current objects have been synced successfully');
    if (cb && _.isFunction(cb)) {
      cb();
    }
    return;
  }
};

// create a new file object with the essential record info
// record : the full airtable record
// file : a airtable file object (element of the attachement array)
// field : the name of the image field (will be used as firebase key)
//
exports.prepareAirtableFile = (record, file, field) => {
  return {
    // the airtable file id used to save in firebase
    id: file.id,
    // the container project id used to saved in firebase
    objectId: record.id,
    airtable: file,
    field: field,
  };
};

// Add uploadcare object to airtable
exports.mixUcareAirtable = (airtableFile, ucareFile) => {
  airtableFile.ucare = ucareFile;
  return airtableFile;
}

/**
 * Return the reference image field name
 * to be used in the image table
 *
 * @param {string} table // Name of the table linked
 * @param {string} field // Name of the field linked
 */
exports.getImageField = (table, field) => {
  if (table && field) {
    return table + '_' + field;
  }
  return null;
};

exports.getImageFieldId = (table, field) => {
  if (table && field) {
    return exports.getImageField(table, field) + 'Id';
  }
  return null;
};

/**
 * Set the filterByFormula depending of the fields
 *
 * @param  {object} fields  Object of params
 * @param  {string} fields.key : name of the field
 * @param  {string} fields.value : value it should have
 */

 // Kasra Kyanzadeh infos
 // plus https://codepen.io/airtable/full/rLKkYB
 // to encode  url to test
 // If you want to use filterByFormula with record IDs in the linked table,
 // you can create a formula in the linked table that is RECORD_ID(),
 // then add a lookup to that formula field in the main table.
 // Now when querying the main table you can use NameOfYourFormulaField="rec123123123" for filterByFormula.
// In your specific case, you need quote the record IDs and use AND
// (& concatenates strings): AND(typeId = "recQV2hPoo3OtZIlg", cityId = "recqJSOeMDYYtZBDB")

/**
 *
 * @param {object} options / Options
 * options.deletable : default False is the content fetched soft deletable (with a delete field)
 */
exports.setFormula = (fields, options) => {
  options = options || {}
  let deletable = options.deletable || false;

  let setFormula = (key, value) => {
    return key + '="' + value + '"';
  };

  debugger;
  let deletedQueryStatement = ',NOT(' + config.airtable.softDeletionBolean + ' = 1)';
  if (_.isObject(fields)) {
    var keys = _.keys(fields);
    // Simple parameters
    if (keys.length == 1) {
      let object = fields[0];
      let formulaSimple = '';
      var key = _.keys(object)[0];

      formulaSimple = setFormula(keys[0], fields[keys[0]]);

      if (config.airtable.softDeletion && deletable) {
        formulaSimple = 'AND(' + formulaSimple + deletedQueryStatement + ')';
      }
      debug('Simple formula ', formulaSimple);
      return formulaSimple;
    }
    // COmbined parameters with ANd operator
    // AND(city='ckljsldjds'&workType='skjlkdsjsd')
    else if (keys.length > 1) {
      let formulaMultiple = 'AND(';

      _.each(keys, (key, index) => {
        if (index == 0) {
          formulaMultiple += setFormula(key, fields[key]);
        } else {
          formulaMultiple += "," + setFormula(key, fields[key]);
        }
      });
      if (config.airtable.softDeletion && deletable) {
        formulaMultiple += deletedQueryStatement;
      }
      formulaMultiple += ')';
      debug('Multiple formula ', formulaMultiple);
      return formulaMultiple;
    }
  }

  return null;
}
