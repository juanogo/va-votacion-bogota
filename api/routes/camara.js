var express = require('express');
var router = express.Router();
var Camara = require('../models/Camara.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  Camara.aggregate([
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
  Camara.aggregate([
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
  Camara.aggregate([
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
  Camara.aggregate([
    {
      $match: req.body
    },
    {
      $group: {
        _id: '$partido',
        votos: { $sum: '$votos' },
      }
    },

    {
      $lookup: {
        from: 'partidos',
        localField: '_id',
        foreignField: '_id',
        as: 'partido_n'
      }
    }, {
      $unwind: "$partido_n"
    }, {
      $project: {
        partido: "$partido_n.nombre",
        votos: 1,
        zona: 1,
        anio: 1
      }
    }
  ], (err, votes) => {
    if (err) next(err);
    res.json(votes);
  });
})

module.exports = router;