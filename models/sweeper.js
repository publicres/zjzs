var model = require('../models/models');

var TICKET_DB = model.tickets;
var ACTIVITY_DB = model.activities;
var db = model.db;

function wipeActivity(actID,callback)
{
    db[ACTIVITY_DB].update({_id:actID},
    {
        $set: {status:99}
    },{multi:false},function()
    {
        db[TICKET_DB].update(
        {
            activity:actID,
            $or:[{status:1},{status:2}]
        },
        {
            $set: {status:99}
        },{multi:true},function()
        {
            console.log("+++++Wipe out one ACTIVITY SUCCESSFULLY+++++");
            callback();
        });
    });
}

function genericWiper(callback)
{
    var current=(new Date()).getTime();
    db[ACTIVITY_DB].find(
    {
        status:1,
        end_time:{$lt:current}
    },function(err,docs)
    {
        if (err || docs.length==0)
        {
            callback();
            return;
        }
        var t=0;
        for (var i=0;i<docs.length;i++)
        {
            wipeActivity(docs[i]._id,function()
            {
                t++;
                if (t==docs.length)
                    callback();
            });
        }
    });
}

module.exports = genericWiper;
