'use strict';

const config = require('../../config')();
const debug = require('debug')('Airtable_saveCoverImage');
const Airtable = require('airtable');
const base = new Airtable({ apiKey: config.airtable.apiKey }).base(config.airtable.base);
const Promise = require('bluebird');
const crud = require('./crud');
const list = require('./list');
const utils = require('./utils');
const imageTable = config.airtable.imageRefTable;

/**
  * Make an existing  image a project cover
  *
  * 1/ get the record of the existing image to make a cover
  * 2/ copy the row
  * 3/ remove any field ref (an image is attached to one ref only)
  * 4/ save the new image with the project cover ref
  *
  * @param {string} params.projectId // the id of the project
  * @param {string} params.imageId // The id of the image to make a cover of
  * @param {string} params.imageId // The id of the image to make a cover of
*/

var saveCoverImage = (params) => {
  return new Promise((resolve, reject) => {
    if (params.imageId && params.projectId && params.userId) {
      // We load the image record to duplicate as a cover
      crud.retrieve(params.imageId, config.airtable.imageRefTable)
        .then((image2MakeCover) => {
          debugger;

          let newImageRef = {
            file: image2MakeCover.fields.file,
            projects_imageCover: [params.projectId],
            user: params.userId,
          };
          // // we delete other image that was the cover
          // list.listFirstPage(config.airtable.imageRefTable, { filterByFormula: "projects_imagesCoverId = 'recMySAXGl863u8Gz'" })
          //     .then((exCoverImage) => {
          //       debugger;
          //       let deleteAll = []

              // Create a new image which is the duplicate of the image
              // but with a cover ref instead of a field  ref
              crud.create(null, config.airtable.imageRefTable, newImageRef)
              .then((coverImage) => {

                let response = {
                    // image: coverImage.fields,
                    projectId: params.projectId,
                    imageId: params.imageId,
                };
                debugger;
                resolve(response);
              },
              (err) => {
                debug('Problem saving image cover', err);
                reject(err);
              })

          // },
          // (err) => {
          //   debug('error at retrieving old cover image', err);
          //   reject(err);
          // });

        },
        (err) => {
          debug('The image Id is not existing', err);
          reject(err);
        })
    } else {
      reject('missing parameters');
    }
  });
};

module.exports = saveCoverImage;
