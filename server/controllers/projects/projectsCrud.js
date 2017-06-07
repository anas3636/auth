'use strict';

const debug           = require('debug')('projectsCtrl');
const config          = require('../../../config')();

const utils = require('../utils');
const crud = utils.airtableCrud;

var options = {
  id: 'projectId',
  table: 'projects',
  maps: 'bamProject',
};

// test of base override
// const customBase = new Airtable({ apiKey: config.airtable.apiKey }).base('appBdc2Fna7uL8lVp');

exports.retrieve = (req, res) => {
  crud(req, res, 'retrieve', options /*, customBase*/);
}
exports.create = (req, res) => {
  crud(req, res, 'create', options /*, customBase*/);
}
exports.update = (req, res) => {
  crud(req, res, 'update', options /*, customBase*/);
}
