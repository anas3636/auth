'use strict';

const debug           = require('debug')('projectsCtrl');
const airtable        = require('../../modules/airtable');
const _               = require('lodash');

const utils = require('../utils');
const crud = utils.airtableCrud;
const list = utils.airtableList;
const helpers = utils.airtableUtils;


// fields to be retrieved in list view
// do not add unused fields
const baseFields = [
  'title',
  'id',
  'typeName',
  'city',
  'type',
  'workType',
  'imageCover',
  'imageCoverUuid',
  'imageCoverUrl',
  'imagesAfter',
  'imageAfterCoverUrl'
];

var options = {
  id: 'projectId',
  table: 'projects',
  maps: 'bamProject',
};

/**
 * List the projects accepting search queries
 */
var listProjects = (req, res) => {
  let options = (req.body.options) ? req.body.options : {};
  options.maps = 'bamProject';
  // Possible parameters
  options = options || {};

  let params = {};

  // As a path used in the architect page
  if (req.params.architectId) params.architectId = req.params.architectId;

  // As a query params in the projects  page
  if (req.query.type) params.type = req.query.type;
  if (req.query.workType) params.workType = req.query.workType;
  if (req.query.city) params.city = req.query.city;

  // Fields to return
  options.fields = baseFields;
  options.view = 'db';
  var paramsKeys = _.keys(params);
  // Filter formula
  if (paramsKeys.length > 0) {
    let formula = helpers.setFormula(params,
    {
      deletable: true
    });
    options.filterByFormula = formula;
  } else {
    // We cache only non parametrized route
    options.cacheKey = "projects";
  }

  list(req, res, 'projects', options);

};

exports.list = listProjects;
