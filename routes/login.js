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

module.exports = router;
