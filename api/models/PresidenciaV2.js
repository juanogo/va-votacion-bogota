var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var PresidenciaV2Schema = new mongoose.Schema({
    "departamento": Number,
    "municipio": Number,
    "zona": Number,
    "circunscripcion": Number,
    "candidato": ObjectId,
    "partido": ObjectId,
    "anio": Number,
    "votos": Number
});

module.exports = mongoose.model('PresidenciaV2', PresidenciaV2Schema, 'presidencia_v2');