'use strict'
const mongoose = require('mongoose');

const listAirTable = require('../helpers/listAirTable')
const Architect = mongoose.model('Architect');

// List all Architects in Air Table
const list = (req, res) => {
	listAirTable.getAnyDataAirTable('all').then((data,err)=>{
		res.send(data)
	})
}
// List all Architects in mongoDB
const listM = (req, res) => {
	Architect.find((err, data) => {
	  if (err) return console.error(err);
	  res.send(data)
	})
}
//Export Controller
module.exports = {
	list : list,
	listM : listM
}
