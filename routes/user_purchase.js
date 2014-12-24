var express = require('express');
var router = express.Router();

var model = require('../models/models');
var lock = require('../models/lock');
var urls = require("../address_configure");

var ADMIN_DB = model.admins;
var TICKET_DB = model.tickets;
var ACTIVITY_DB = model.activities;
var db = model.db;

router.get("/", function(req, res, next)
{
    res.render("cashier",{});
});

router.get("/listticket",function(req,res)
{
    if (req.query.stuid==null)
    {
        res.send("[]");
        return;
    }
    db[TICKET_DB].find(
    {
        stu_id:     req.query.stuid,
        $or:        [{status:2},{status:1,cost:{$ne:0}}]
    },function(err,docs)
    {
        if (err || docs.length==0)
        {
            res.send("[]");
            return;
        }
        var antiHash={};
        var actList=[];
        for (var i=0;i<docs.length;i++)
        {
            actList.push({_id:docs[i].activity});
        }
        db[ACTIVITY_DB].find({$or:actList},function(err, docs1)
        {
            if (err || docs1.length!=docs.length)
            {
                res.send("[]");
                return;
            }
            for (var i=0;i<docs1.length;i++)
            {
                antiHash[docs1[i]._id.toString()]=docs1[i];
            }
            var single;
            var ret=[];
            for (var i=0;i<docs.length;i++)
            {
                single={};
                single.ticketid=docs[i].unique_id;
                single.actname=antiHash[docs[i].activity.toString()].name;

                ret.push(single);
            }
            res.send(JSON.stringify(ret));
        });
    });
});

router.get("/getticket",function(req,res)
{
    if (req.query.tid==null)
    {
        res.send('{"err":"Lack tid."}');
        return;
    }
    db[TICKET_DB].find(
    {
        unique_id:  req.query.tid,
        $or:        [{status:2},{status:1,cost:{$ne:0}}]
    },function(err, docs)
    {
        if (err || docs.length==0)
        {
            res.send('{"err":"无效的票或该票无需支付。"}');
            return;
        }
        db[ACTIVITY_DB].find(
        {
            status: 1,
            _id:    docs[0].activity
        },function(err, docs1)
        {
            if (err || docs1.length==0)
            {
                res.send('{"err":"由于活动无效，该票无效。"}');
                return;
            }
            var ret={};
            ret.id=docs[0].unique_id;
            ret.stu_id=docs[0].stu_id;
            ret.act_name=docs1[0].name;
            ret.price=docs[0].cost;
            ret.status=docs[0].status;
            res.send(JSON.stringify(ret));
        });
    });
});

router.get("/buy",function(req,res)
{
    if (req.query.tid==null)
    {
        res.send('{"err":"Lack tid."}');
        return;
    }
    lock.acquire("cashier",function()
    {
        db[TICKET_DB].find(
        {
            unique_id:  req.query.tid,
            status:     1,
            cost:       {$ne:0}
        },function(err, docs)
        {
            if (err || docs.length==0)
            {
                lock.release("cashier");
                res.send('该票并不需要支付。');
                return;
            }
            db[TICKET_DB].update({unique_id:  req.query.tid},{$set:{status:2}},{},function()
            {
                lock.release("cashier");
                res.send('success');
                return;
            });
        });
    });
});

router.get("/refund",function(req,res)
{
    if (req.query.tid==null)
    {
        res.send('{"err":"Lack tid."}');
        return;
    }
    lock.acquire("cashier",function()
    {
        db[TICKET_DB].find(
        {
            unique_id:  req.query.tid,
            status:     2
        },function(err, docs)
        {
            if (err || docs.length==0)
            {
                lock.release("cashier");
                res.send('该票并不需要支付。');
                return;
            }
            db[TICKET_DB].update({unique_id:  req.query.tid},{$set:{status:1}},{},function()
            {
                lock.release("cashier");
                res.send('success');
                return;
            });
        });
    });
});

module.exports = router;
