var express = require('express');
var router = express.Router();
var adminRouter = require('./admin/index');
var mrRouter = require('./mr/index');
var docRouter = require('./doctor/index');
var categoryRouter = require('./category/index');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

router.use('/admin', adminRouter);  
router.use('/mr', mrRouter);
router.use('/doctor', docRouter);
router.use('/category', categoryRouter);
module.exports = router;
