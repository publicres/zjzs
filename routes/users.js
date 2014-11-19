var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res) {
    req.session.huahua="baomihua!";
    res.send('respond with a resource');
});

module.exports = router;
