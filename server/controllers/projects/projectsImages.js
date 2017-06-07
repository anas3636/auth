'use strict';
const debug           = require('debug')('projectImagesCtrls');
const config          = require('../../../config')();
const utils           = require('../utils');
const list            = utils.airtableList;
const helpers         = utils.airtableUtils;
const projImagesOpts  = utils.airtableProjectImages;
const airtable        = require('../../../modules/airtable');
const projectDelete   = require('./projectsDelete');

// List all project images
exports.list = (req, res) => {
  let projectId = req.params.projectId || null;
  let fieldId = req.params.fieldId || null;

  if (projectId && fieldId) {
    let options = projImagesOpts.getOptions(projectId, fieldId);
    debug('Querying project image with options ', options);
    list(req, res, config.airtable.imageRefTable , options)
  }
  else {
    utils.errors('Missing parameters', req, res);
  }
};

exports.setCoverImage = (req, res) => {
  let projectId = (req.params.projectId) ? req.params.projectId : null;
  let imageId = (req.params.imageId) ? req.params.imageId : null;
  var userId = req.body.user || null;
  let willRemoveCover = req.body.willRemoveCover || null;

  if(willRemoveCover){
    let fields = {
      imageCover: null,
      imagesAfter: null
    };
    airtable.crud.update(projectId, config.airtable.imageTable, fields, null)
    .then((data) => {
      let resp = {
        projectId: projectId,
        imageId: null
      };
      utils.response(resp, req, res);
    },
    (err) => {
      debug(err);
      utils.errors(err, req, res);
    });
  }
  else if (projectId && imageId) {
    airtable.saveCoverImage({
      projectId: projectId,
      imageId: imageId,
      userId: userId
    })
    .then(
      (data) => {
        // data is already formated in the module
        // as it is a special multi object response
        utils.response(data, req,res);
      },
      (err) => {
        debug(err);
        utils.errors(err, req, res);
      }
    );
  }
}

exports.deleteProjectImage = (req, res) => {
  let imageId = (req.params.imageId) ? req.params.imageId : null;
  projectDelete.deleteProjectImage(imageId).then((data) => {
    utils.response(data, req,res);
  });
}