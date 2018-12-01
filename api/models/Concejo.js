var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ConcejoSchema = new mongoose.Schema({
    "departamento": Number,
    "municipio": Number,
    "zona": Number,
    "circunscripcion": Number,
    "candidato": ObjectId,
    "partido": ObjectId,
    "anio": Number,
    "votos": Number
});

module.exports = mongoose.model('Concejo', ConcejoSchema, 'concejo');