var express = require('express');
var verifier = require('../weixin_basic/connect_verify');
var wxhandler = require('../weixin_handler/handler_main');
var router = express.Router();

router.use('/', function(req, res, next) {
    if (verifier.check_weixin_signature(req.query.signature,req.query.timestamp,req.query.nonce))
        next();
    else
        res.send('Only approachable by Wechat.');
});
router.use(function(req, res, next){
    if (req.is('text/*'))
    {
        req.rawData = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk){ req.rawData += chunk });
        req.on('end', next);    
    }
    else
    {
        for (i in req.body)
        {
            req.rawData=i;
        }
        next();
    }
});

router.get('/', function(req, res) {
    verifier.echo_back_weixin(req,res);
});

router.post('/', function(req, res) {
    wxhandler(req, res);
});

module.exports = router;
