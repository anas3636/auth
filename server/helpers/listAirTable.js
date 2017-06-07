'use strict'
const Promise = require('bluebird');
const config = require('../config');
const Airtable = require('airtable');


/**
 * Get All Pages data from any air table base
 *
 * @param {string} baseName Base Name
 *
 */
exports.getAnyDataAirTable = (baseName) => {
	// set the base AirTable Project 
	const base = new Airtable({apiKey: config.airtable.apiKey}).base(config.airtable.bases.base1);
	//set container for all the data
	var allData = [];

	return new Promise((resolve, reject) => {
		// loop on page to get data from each
		base(baseName).select({}).eachPage(
			function page(records, fetchNextPage) {
				allData = allData.concat(records.map((val)=>{
					var fields = val.fields
					return fields
				}))
				//if no next page call done
			    fetchNextPage();

			}, function done(err) {
			    if (err) { reject(err); return; }
			    resolve(allData)
			});
	})
}
