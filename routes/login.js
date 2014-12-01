var express = require('express');
var router = express.Router();

var model = require('../models/models');
var lock = require('../models/lock');
var urls = require("../address_configure");

var ADMIN_DB = model.admins;
var db = model.db;

router.get("/", function(req, res, next)
{
    if (req.session.user!=null)
        res.redirect("/users");
    else
        res.render("login", {});
});

router.post("/", function(req, res)
{
    var resData={};
    db[ADMIN_DB].find({user:req.body.username},function(err,docs)
    {
        if (err || docs.length==0)
        {
            resData.message="failed";
            resData.error="none";
        }
        else
        {
            if (docs[0].password===req.body.password)
            {
                resData.message="success";
                resData.next=urls.userPage;
                req.session.user=req.body.username;
            }
            else
            {
                resData.message="failed";
                resData.error="wrong";
            }
        }
        res.send(JSON.stringify(resData));
        return;
    });
});

module.exports = router;
