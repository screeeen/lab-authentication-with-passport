'use strict';

const express = require('express');
const router = express.Router();
const passportRouter = require('./passportRouter')

router.use('/', passportRouter);



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Passport' });
});

module.exports = router;
