var mongoose = require('mongoose');

var SavedOpportunitySchema = new mongoose.Schema({
  id: String,
  id_user: String,
  id_opportunity: String,
  // id_opportunity: { type: Number, min: 0, max: 100000 },
  comment: String,  
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SavedOpportunity', SavedOpportunitySchema);