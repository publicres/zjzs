var express = require('express');
var verifier = require('../weixin_basic/connect_verify');
var router = express.Router();

router.use('/', function(req, res, next) {
    if (verifier.check_weixin_signature(req.query.signature,req.query.timestamp,req.query.nonce))
        next();
    else
        res.send('Only approachble by Wechat.');
});
router.get('/', function(req, res) {
    verifier.echo_back_weixin(req,res);
});

module.exports = router;
