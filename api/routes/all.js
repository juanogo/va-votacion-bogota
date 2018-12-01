var express = require('express');
var router = express.Router();
var Alcaldia = require('../models/Alcaldia.js');
var Senado = require('../models/Senado.js');
var Camara = require('../models/Camara.js');
var Concejo = require('../models/Concejo.js');
var JAL = require('../models/JAL.js');

router.get('/groupedbyparty', function (req, res, next) {
    var votes = [];
    getGroupedData(Senado, "Senado", (err, votesS) => {
        votes = votes.concat(votesS)
        getGroupedData(Camara, "Camara", (err, votescam) => {
            votes = votes.concat(votescam);
            getGroupedData(Alcaldia, "Alcaldia", (err, votesa) => {
                votes = votes.concat(votesa);
                getGroupedData(Concejo, "Concejo", (err, votescon) => {
                    votes = votes.concat(votescon);
                    getGroupedData(JAL, "JAL", (err, votesjal) => {
                        votes = votes.concat(votesjal);
                        res.json(votes);
                    })
                })
            })
        })
    })
})

function getGroupedData(collection, typeName, callback) {
    collection.aggregate([
        {
            $group: {
                _id: { zona: '$zona', partido: '$partido', anio: '$anio' },
                votos: { $sum: '$votos' },
            }
        },

        {
            $lookup: {
                from: 'partidos',
                localField: '_id.partido',
                foreignField: '_id',
                as: 'partido_n'
            }
        }, {
            $unwind: "$partido_n"
        }, {
            $project: {
                partido: "$partido_n.nombre",
                votos: 1,
                zona: "$_id.zona",
                anio: "$_id.anio",
                _id: 0,
                tipo: typeName
            }
        }
    ], (err, votes) => {
        callback(err, votes);
    });
}

module.exports = router;