var express = require('express');
var router = express.Router();

var model = require('../models/models');
var lock = require('../models/lock');
var urls = require("../address_configure");

var db = model.db;
var TICKET_DB = model.tickets;
var ACTIVITY_DB = model.activities;

function addZero(num)
{
    if (num<10)
        return "0"+num;
    return ""+num;
}
function getTime(datet,isSecond)
{
    if (!(datet instanceof Date))
        datet=new Date(datet);
    datet.getMinutes()
    return datet.getFullYear() + "-"
        + (datet.getMonth()+1) + "-"
        + (datet.getDate()) + " "
        + addZero(datet.getHours()) + ":"
        + addZero(datet.getMinutes())
        + (isSecond===true? ":"+datet.getSeconds() : "");
}
router.get("/", function(req, res, next)
{
    if (req.query.actid==null)
    {
        res.send("Must have actid.");
        return;
    }
    var id4Q=model.getIDClass(req.query.actid);
    db[ACTIVITY_DB].find({_id:id4Q, status:1},function(err, docs)
    {
        if (err || docs.length==0)
        {
            res.send("Invalid actid.");
            return;
        }

        activity = {
            name: docs[0].name,
            start_time: getTime(docs[0].start_time),
            end_time:  getTime(docs[0].end_time),
            actid: docs[0]._id.toString()
        };
        res.render("activity_checkin", {activity: activity});
        return;
    });
});

function checkValid(ticket,res)
{
    if (ticket.status==2)
        return true;
    if (ticket.status==3)
    {
        res.json(
        {
            stuid: ticket.stu_id,
            msg: 'used',
            result: 'error'
        });
        return false;
    }
    if (ticket.status==0 || ticket.status==99)
    {
        res.json(
        {
            stuid: ticket.stu_id,
            msg: 'rejected',
            result: 'error'
        });
        return false;
    }
    if (ticket.status==1 && ticket.cost>0)
    {
        res.json(
        {
            stuid: ticket.stu_id,
            msg: 'nouser',
            result: 'error'
        });
        return false;
    }
    if (ticket.status==1)
        return true;

    res.json(
    {
        stuid: ticket.stu_id,
        msg: 'unknown',
        result: 'error'
    });
    return false;
}
router.post("/",function(req, res)
{
    if (req.query.actid==null)
    {
        res.json(
        {
            stuid: 'Unknown',
            msg: 'noact',
            result: 'error'
        });
        return;
    }
    var id4Q=model.getIDClass(req.query.actid);
    db[ACTIVITY_DB].find({_id:id4Q, status:1},function(err, docs)
    {
        if (err || docs.length==0)
        {
            res.json(
            {
                stuid: 'Unknown',
                msg: 'noact',
                result: 'error'
            });
            return;
        }

        var uid=req.body.uid;
        if (uid.length==10)
        {
            db[TICKET_DB].find(
            {
                stu_id:     uid,
                activity:   id4Q,
                status:     {$ne:0}
            },function(err, tik)
            {
                if (err || tik.length==0)
                {
                    res.json(
                    {
                        stuid: uid,
                        msg: 'noticket',
                        result: 'error'
                    });
                    return;
                }
                if (checkValid(tik[0],res))
                {
                    db[TICKET_DB].update({_id:tik[0]._id},
                    {
                        $set:{status:3}
                    },function(err,result)
                    {
                        if (err || result.n==0)
                        {
                            res.json(
                            {
                                stuid: uid,
                                msg: 'unknown',
                                result: 'error'
                            });
                            return;
                        }
                        res.json(
                        {
                            stuid: uid,
                            msg: 'accepted',
                            result: 'success'
                        });
                        return;
                    });
                }
            });
        }
        else if (uid.length==32)
        {
            db[TICKET_DB].find({unique_id:uid},function(err, tik)
            {
                if (err || tik.length==0)
                {
                    res.json(
                    {
                        stuid: 'Unknown',
                        msg: 'noticket',
                        result: 'error'
                    });
                    return;
                }
                if (tik[0].activity.toString()!=req.query.actid)
                {
                    res.json(
                    {
                        stuid: tik[0].stu_id,
                        msg: 'rejected',
                        result: 'error'
                    });
                    return;
                }

                if (checkValid(tik[0],res))
                {
                    db[TICKET_DB].update({_id:tik[0]._id},
                    {
                        $set:{status:3}
                    },function(err,result)
                    {
                        if (err || result.n==0)
                        {
                            res.json(
                            {
                                stuid: tik[0].stu_id,
                                msg: 'unknown',
                                result: 'error'
                            });
                            return;
                        }
                        res.json(
                        {
                            stuid: tik[0].stu_id,
                            msg: 'accepted',
                            result: 'success'
                        });
                        return;
                    });
                }
            });
        }
        else
        {
            res.json(
            {
                stuid: 'Unknown',
                msg: 'rejected',
                result: 'error'
            });
            return;
        }
        return;
    });
});

module.exports = router;
