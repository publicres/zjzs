var express = require('express');
var router = express.Router();

var model = require('../models/models');
var lock = require('../models/lock');
var urls = require("../address_configure");

var ACTIVITY_DB = model.activities;
var db = model.db;

function getTime(datet,isSecond)
{
    if (!(datet instanceof Date))
        datet=new Date(datet);
    return datet.getFullYear() + "年"
        + (datet.getMonth()+1) + "月"
        + (datet.getDate()+1) + "日 "
        + datet.getHours() + ":"
        + datet.getMinutes()
        + (isSecond===true? ":"+datet.getSeconds() : "");
}
router.get("/", function(req, res, next)
{
    if (req.query.actid == null)
    {
        res.send("Activity not exist!");
        return;
    }
    //WARNING: 500 when invalid id
    var theActID=model.getIDClass(req.query.actid);

    db[ACTIVITY_DB].find(
    {
        _id:theActID,
        status:{$ne:0}
    },function(err, docs)
    {
        if (err || docs.length==0)
        {
            res.send("Activity not exist!");
            return;
        }
        var theAct=docs[0];
        var nowStatus=0;
        var current=(new Date()).getTime();
        if (current>theAct.book_start && current<theAct.book_end)
            nowStatus=1;
        var tmp=
        {
            act_name:           theAct.name,
            act_book_start:     getTime(theAct.book_start),
            act_book_end:       getTime(theAct.book_end),
            act_start:          getTime(theAct.start_time),
            act_end:            getTime(theAct.end_time),
            act_place:          theAct.place,
            act_key:            theAct.key,
            act_pic_url:        theAct.pic_url,
            act_desc:           theAct.description,

            cur_time:           getTime(new Date(),true),
            rem_tik:            theAct.remain_tickets,

            time_rem:           theAct.book_start-current,
            act_status:         nowStatus
        };
        console.log(tmp);
        res.render("actinfo", tmp);
    });
});

module.exports = router;
