var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var CandidatosSchema = new mongoose.Schema({
    "nombre": String
});

module.exports = mongoose.model('Candidatos', CandidatosSchema, 'candidatos');