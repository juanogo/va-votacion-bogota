var express = require('express');
var router = express.Router();
var Concejo = require('../models/Concejo.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  Concejo.aggregate([
    {
      $lookup: {
        from: 'candidatos',
        localField: 'candidato',
        foreignField: '_id',
        as: 'candidato_n'
      }
    }, {
      $unwind: "$candidato_n"
    },
    {
      $lookup: {
        from: 'partidos',
        localField: 'partido',
        foreignField: '_id',
        as: 'partido_n'
      }
    }, {
      $unwind: "$partido_n"
    }
    , {
      $project: {
        candidato: "$candidato_n.nombre",
        partido: "$partido_n.nombre",
        _id: 1,
        zona: 1,
        circunscripcion: 1,
        anio: 1,
        votos: 1
      }
    }
  ], (err, votes) => {
    if (err) next(err);
    res.json(votes);
  });
});

router.get('/year/:year', function (req, res, next) {
  Concejo.aggregate([
    {
      $match: {
        anio: Number(req.params.year)
      }
    },
    {
      $lookup: {
        from: 'candidatos',
        localField: 'candidato',
        foreignField: '_id',
        as: 'candidato_n'
      }
    }, {
      $unwind: "$candidato_n"
    },
    {
      $lookup: {
        from: 'partidos',
        localField: 'partido',
        foreignField: '_id',
        as: 'partido_n'
      }
    }, {
      $unwind: "$partido_n"
    }
    , {
      $project: {
        candidato: "$candidato_n.nombre",
        partido: "$partido_n.nombre",
        _id: 1,
        zona: 1,
        circunscripcion: 1,
        anio: 1,
        votos: 1
      }
    }
  ], (err, votes) => {
    if (err) next(err);
    res.json(votes);
  });
})

router.get('/zone/:zone', function (req, res, next) {
  Concejo.aggregate([
    {
      $match: {
        zona: Number(req.params.zone)
      }
    },
    {
      $lookup: {
        from: 'candidatos',
        localField: 'candidato',
        foreignField: '_id',
        as: 'candidato_n'
      }
    }, {
      $unwind: "$candidato_n"
    },
    {
      $lookup: {
        from: 'partidos',
        localField: 'partido',
        foreignField: '_id',
        as: 'partido_n'
      }
    }, {
      $unwind: "$partido_n"
    }
    , {
      $project: {
        candidato: "$candidato_n.nombre",
        partido: "$partido_n.nombre",
        _id: 1,
        zona: 1,
        circunscripcion: 1,
        anio: 1,
        votos: 1
      }
    }
  ], (err, votes) => {
    if (err) next(err);
    res.json(votes);
  });
})

router.post('/groupedbyparty', function (req, res, next) {
  console.log(JSON.stringify(req.body));
  Concejo.aggregate([
    {
      $match: req.body
    },
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
        tipo: "Concejo"
      }
    }
  ], (err, votes) => {
    if (err) next(err);
    res.json(votes);
  });
})

module.exports = router;