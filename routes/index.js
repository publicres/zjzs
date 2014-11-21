var express = require('express');
var router = express.Router();

var i=0;

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express', tester: i++ });
});

module.exports = router;
