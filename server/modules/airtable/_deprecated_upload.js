'use strict';
var Airtable = require('airtable');
var config = require('../../config')();
var base = new Airtable({ apiKey: config.airtable.apiKey }).base(config.airtable.base);
//var uploadUrl = config.domains.local + ':' + config.ports.express + '/' + config.images.upload.dir;
var uploadUrl = '/' + config.images.upload.dir
var debug = require('debug')('airtableUpload');
var _ = require('lodash');
var utils = require('./utils');
var firebase = require('../firebase');
var Promise = require('bluebird');

// fields : the fields of the record where the images are
let upload2Firebase = function(fields, airtableFile, ucareFile, fieldName) {
  return new Promise(function (resolve, reject) {
    if (fields && airtableFile && ucareFile) {
      let airtableFileFormated = utils.prepareAirtableFile(fields, airtableFile, fieldName);
      let file2Save = utils.mixUcareAirtable(airtableFileFormated, ucareFile)
      firebase.save.images(file2Save, file2Save.objectId, config.airtable.imageTable, fieldName)
      .then(function() {
        debug('Images info saved in firebase.');
        resolve('done');
      },
      function(err) {
        debug('Error at saving Images info to firebase', err);
        reject(err);
      });
    } else {
      reject('missing object for firebase');
    }
  });
};

// fileUrl : distant url of the file (airtable need to be able to access it)
// opts: {
//   objectId: id of the object to update
//   table: airtable table name to save in
//   field: name of the image field to update
//   fileName: Name of the file
// }
var newfile = function(fileUrl, opts) {
  return new Promise(function(resolve, reject) {
    // To add attachments to images and imagesBefore,
    // add new attachment objects to the existing array.
    // Be sure to include all existing attachment objects
    // that you wish to retain. For the new attachments being added,
    // url is required, and filename is optional.
    // To remove attachments, include the existing array of attachment objects,
    //  excluding any that you wish to remove.
    if (fileUrl && opts.objectId && opts.table && opts.field && opts.fileName && opts.ucareFile) {
      // we load the object to upload images to
      // Indeed we need to have the existing attachements array
      base(opts.table)
      .find(opts.objectId, function(err, record) {
        if (err) {
          debug('Failed to load object from ' + opts.table + ' with id ' + opts.objectId, err);
          reject(err);
        }
        let fields = record._rawJson.fields;

        // Airtable do not list empty field
        // Image fields are always arrays in airtable
        // So we initialize an array if  the field not existing
        let imageField = fields[opts.field] || [];
        let newFile = {
          filename: opts.fileName,
          // url: 'https://dl.airtable.com/fU5uyHaeSK2MD9dXzg6q_chat.jpg',
          url: fileUrl,
        };
        var imageIndex = imageField.push(newFile);
        debug('new image ready to be saved in image field', imageField);
        // We only update one image field at a time
        // But the image field could be any field
        var fields2Update = {};
        fields2Update[opts.field] = imageField;

        imageField;
        base(opts.table)
        .update(opts.objectId, fields2Update, function(err, record) {
          if (err) {
            debug('Failed to update airtable image field', err);
            reject(err);
          }
          let files = record._rawJson.fields[opts.field];
          let savedFileIndex = _.findIndex(files, { filename: opts.fileName});
          let fileSaved = record._rawJson.fields[opts.field][savedFileIndex];
          debug('Airtable upload OK !', fileSaved);
          // We return the created image object

          let returnObject = {
            airtableId: fileSaved.id,
            file: fileSaved,
            index: savedFileIndex,
          };

          upload2Firebase(fields, fileSaved, opts.ucareFile, opts.field)
          .then(function(message) {
            resolve(message);
          }, function(err) {
            reject(err);
          });
        });
      });
    } else {
      reject('missing data');
    }
  });
};

exports.newfile = newfile;
