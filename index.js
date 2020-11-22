var express = require('express');
var csv = require("fast-csv");
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var Question  = mongoose.model('Questions');
var csvfile = __dirname + "/Questions.csv";
var stream = fs.createReadStream(csvfile);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('index', { title: 'Import CSV file using NodeJS' });
})

module.exports = router;
