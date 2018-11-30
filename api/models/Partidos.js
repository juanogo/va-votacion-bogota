var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var PartidosSchema = new mongoose.Schema({
    "nombre": String
});

module.exports = mongoose.model('Partidos', PartidosSchema, 'partidos');