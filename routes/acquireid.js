var express = require('express');
var router = express.Router();

var model = require('../models/models');

var USER_DB = model.students;
var db = model.db;

router.get("/", function(req, res)
{
    if (req.query.openid==null)
    {
        res.send("-1");
        return;
    }
    db[USER_DB].find(
    {
        status:1,
        weixin_id:req.query.openid
    },function(err,docs)
    {
        if (err || docs.length==0)
        {
            res.send("-1");
            return;
        }
        res.send(docs[0].stu_id);
    });
});

module.exports = router;
