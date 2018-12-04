var express = require('express');
var router = express.Router();
var Alcaldia = require('../models/Alcaldia.js');
var Senado = require('../models/Senado.js');
var PresidenciaV1 = require('../models/PresidenciaV1.js');
var PresidenciaV2 = require('../models/PresidenciaV2.js');
var Camara = require('../models/Camara.js');
var Concejo = require('../models/Concejo.js');
var Partidos = require("../models/Partidos.js");
var JAL = require('../models/JAL.js');

router.get('/groupedbyparty', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var votes = [];
    getGroupedData(Senado, "Senado", (err, votesS) => {
        votes = votes.concat(votesS)
        getGroupedData(Camara, "Camara", (err, votescam) => {
            votes = votes.concat(votescam);
            getGroupedData(PresidenciaV1, "PresidenciaV1", (err, votespv1) => {
                for (var i = 0; i < votespv1.length; i++) {
                    votespv1[i].vuelta = 1;
                }
                votes = votes.concat(votespv1);
                getGroupedData(PresidenciaV2, "PresidenciaV2", (err, votespv2) => {
                    for (var i = 0; i < votespv2.length; i++) {
                        votespv2[i].vuelta = 2;
                    }
                    votes = votes.concat(votespv2);
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

router.get("/getcoaliciones", function (req, res, next) {
    Partidos.find({ nombre: /.*;.*/ }, (err, ps) => {
        if (err) res.json("error looking parties");
        else {
            var data = {nodes: [], links:[]};
            for (var i = 0; i < ps.length; i++){
                var d = ps[i];
                var names = d['nombre'].split(";");

                for (var j = 0; j < names.length; j++){
                    for (var k = j+1; k < names.length; k++) {

                        if (!data.nodes.includes(names[j])) {
                            data.nodes.push(names[j]);
                        }
                        if (!data.nodes.includes(names[k])) {
                            data.nodes.push(names[k]);
                        }

                        var link = null;
                        for (var l = 0; l < data.links.length; l++){
                            
                            if (data.links[l].source === names[j] && data.links[l].target === names[k] ||
                                data.links[l].target === names[j] && data.links[l].source === names[k]){
                                    link = data.links[l];
                                    break;
                                }
                        }

                        if (link !== null) {
                            link.value = link.value + 1;
                        }else {
                            data.links.push({source: names[j], target: names[k], value: 1})
                        }
                    }
                }
            }
            res.json(data);
        }
    })
});

module.exports = router;
