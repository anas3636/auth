'use strict'

var mongoose = require('mongoose');

var ArchitectSchema = new mongoose.Schema({
	Ready: Boolean,
	Email: String,
	Name: String
}, {timestamps: true});

// Requires population of author
// ArchitectSchema.methods.toJSONFor = function(user){
//   return {
//     id: this._id,
//     body: this.body,
//     createdAt: this.createdAt,
//     author: this.author.toProfileJSONFor(user)
//   };
// };

module.exports = mongoose.model('Architect', ArchitectSchema);
