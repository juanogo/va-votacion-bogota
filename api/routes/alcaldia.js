var express = require('express');
var router = express.Router();
var Alcaldia = require('../models/Alcaldia.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  Alcaldia.find((err, votes) => {
    if (err) return next(err);
    res.json(votes);
  })
});

module.exports = router;