var airtable = {
  crud: require('./crud'),
  create: require('./crud').create,
  udpate: require('./crud').update,
  retrieve: require('./crud').retrieve,
  delete: require('./crud').delete,
  list: require('./list'),

  saveNewImage: require('./saveNewImage'),
  saveCoverImage: require('./saveCoverImage'),

  mapResponse: require('./mapResponse'),
  syncObjects: require('./syncObjects'),

  upload: require('./_deprecated_upload'),

  utils: require('./utils'),
};

module.exports = airtable;
