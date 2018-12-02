var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var PresidenciaV1Schema = new mongoose.Schema({
    "departamento": Number,
    "municipio": Number,
    "zona": Number,
    "circunscripcion": Number,
    "candidato": ObjectId,
    "partido": ObjectId,
    "anio": Number,
    "votos": Number
});

module.exports = mongoose.model('PresidenciaV1', PresidenciaV1Schema, 'presidencia_v1');