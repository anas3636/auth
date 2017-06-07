'use strict';

const config = require('../../config')();
const debug = require('debug')('Airtable_SaveNewImage');
const Airtable = require('airtable');
const base = new Airtable({ apiKey: config.airtable.apiKey }).base(config.airtable.base);
const Promise = require('bluebird');
const crud = require('./crud');
const utils = require('./utils');
const imageTable = config.airtable.imageRefTable;
const fileTable = config.airtable.imageFileTable;

/**
  * Save new files uploaded with upload care
  * In airtable in the image & file table
  *
  * The image table is linked to the object associated with the upload
  * for example if it is an upload in a project 1223 in field
  * imagesAfter a link to this content will be created
  * File table store the file information
  * If a copy of the image is made later
  * the file record will be unique
  * whereas the image record with be copied
  *
  * @param {object} file // File Object
  * @param {object} file.uuid // Uuid of the file
  *
  * @param {object} ref // Reference object
  * All 3 subproperties are mandatory
  * @param {string} ref.table // Name of the table of the referenced object
  * @param {string} ref.field // Name of the fields of the referenced object
  * @param {string} ref.id // id of the reference object to attache the image to
  * @param {string} ref.user // User id of the connected user
*/

var saveNewImage = (file, ref) => {
 return new Promise((resolve, reject) => {
   let fileFields = {
     uuid: file.uuid,
     fileInfo: JSON.stringify(file),
   };
   debugger;
   // Save file info in file table
   crud.create(null, fileTable, fileFields)
   .then((savedFile) => {
      debugger;
      let imageFields  = {
        // The link to the file table
        file: [savedFile.id],
      };
      let refField = utils.getImageField(ref.table, ref.field);
      // The link to the object table (project, proposal....)
      imageFields[refField] = [ref.id];
      imageFields.user = ref.user || null;

      crud.create(null, imageTable, imageFields)
      .then((savedImage) =>{
        debugger;
        resolve(savedImage);
      },
      (err) => {
        debug('Error while saving image in images table', err);
        reject(err);
      })
    },
    (err) => {
      debug('Error while saving file in files table', err);
      reject(err);
    });
  });
};
module.exports = saveNewImage;
