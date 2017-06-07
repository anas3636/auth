'use strict';

// The projects page
// Upload project images locally or in a the firebase cloud
const debug           = require('debug')('projectsCtrl');
const config          = require('../../../config')();
const airtable        = require('../../../modules/airtable');
const utils           = require('../utils');
const projImagesOpts  = utils.airtableProjectImages;
const Promise         = require('bluebird');
const _               = require('lodash');

const crud            = utils.airtableCrud;
const list            = utils.airtableList;
const helpers         = utils.airtableUtils;
const imageTable      = 'images';
const projectTable    = 'projects';
const placesTable     = 'places';

// The different types of images associated to a project
const projectImageField = [
  'imagesAfter',
  'imagesBefore',
  'imageCover',
];

// #1 Retrieve the project to delete
// to be able to deleted related content
var getProject = (projectId) => {
  return airtable.crud.retrieve(projectId, imageTable);
};

var getProjectInfo = (projectId) => {
  return airtable.crud.retrieveWithFields(projectId, projectTable, ['place']);
};

// #1 Delete project
var deleteProject = (projectId) => {
  return airtable.crud.delete(projectId, imageTable);
};

// #3 Each image deletion
var deleteProjectImage = (projectImageId) => {
  return airtable.crud.delete(projectImageId, imageTable);
};

exports.deleteProjectImage = deleteProjectImage;

// #3 Delete all project Images
var deleteProjectImages = (projectImages) => {
  // Async deletion of all project Images
  var projectImagesPromises = [];
  _.each(projectImages, (projectImage) => {
    projectImagesPromises.push(deleteProjectImage(projectImage));
  });

  return Promise.all(projectImagesPromises);
};

// Build an array of the images record Ids
// Associated to a project, will loop on all project fields
// Defined above
var extractProjectImagesIds = (project) => {
  let ids = [];
  if (project && projectImageField) {
    _.each(projectImageField, (imageFieldId) => {
      if (project[imageFieldId]) {
        ids = _.union(ids, project[imageFieldId]);
      }
    });
  }
  return ids;
};

var unlinkProjectFromPlace = (projectId, placeId) => {
  airtable.crud.retrieve(placeId, placesTable)
    .then((placeInfoData) => {
      let placeInfo = airtable.mapResponse(placeInfoData);
      let projectIndex = 0;
      placeInfo.projects.find(function(project, index){
        projectIndex = index;
        return project == projectId;
      });

      placeInfo.projects.splice(projectIndex, 1);

      let fields = { projects: placeInfo.projects };

      return airtable.crud.update(deleteResults.placeId, placesTable, fields);
    })
    .then((data) => {
      let updatedPlace = airtable.mapResponse(data);
      debug(updatedPlace.name + ' place has been update');
    });
};

/**
 * Simply delete the project without the images
 */
exports.deleteProjectWithoutImage = (req, res) => {

  let projectId = req.params.projectId || null;
  if (projectId) {
    deleteProject(projectId)
    .then((deletedProject) => {
      debug('project is now deleted. sending response to UI');
      utils.response(airtable.mapResponse(deletedProject), req, res);
    })
    .catch((err) => {
      utils.errors(err, req, res);
    });
  } else {
    utils.errors('Missing params', req, res);
  }
}

var deleteResults = {};
exports.delete = (req, res) => {
  let projectId = req.params.projectId || null;
  if (projectId) {
    getProject(projectId)
    .then((projectToDelete) => {
      deleteResults.imagesIds = extractProjectImagesIds(airtable.mapResponse(projectToDelete));
      return getProjectInfo(projectId);
    })
    .then((data) => {
      let projectInfo = airtable.mapResponse(data);
      if (projectInfo.place && projectInfo.place.length > 0){
        deleteResults.placeId = projectInfo.place[0];
      }
      return deleteProject(projectId);
    })
    .then((projectDeleted) => {
      deleteResults.projectDeleted = airtable.mapResponse(projectDeleted);

      // unlin project from place when project has been successfully deleted
      if (deleteResults.placeId){
        unlinkProjectFromPlace(projectId, deleteResults.placeId);
      }
      // We delete project Images
      // Only if project have been deleted
      return deleteProjectImages(deleteResults.imagesIds)
    })
    .then((deletedProjectImages) => {
      deleteResults.deletedProjectImages = [];
      _.each(deletedProjectImages, (deletedProjectImage) => {
        deleteResults.deletedProjectImages.push(airtable.mapResponse(deletedProjectImage));
      })
      // We send back the response
      utils.response(deleteResults, req, res);
    })
    .catch((err) => {
      utils.errors(err, req, res);
    });
  } else {
    utils.errors('Missing params', req, res);
  }
}
