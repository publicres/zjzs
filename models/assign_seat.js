var model = require('../models/models');

var TICKET_DB = model.tickets;
var ACTIVITY_DB = model.activities;
var SEAT_DB = model.seats;
var db = model.db;

function random_assign_seat(actID, callback)
{
    db[TICKET_DB].find(
    {
        activity: actID,
        seat: "",
        $or: [{status:1},{status:2}]
    },function(err, docs)
    {
        if (err || docs.length==0)
        {
            callback();
            return;
        }
        db[SEAT_DB].find({activity: actID},function(err, result)
        {
            if (err || result.length==0)
            {
                callback();
                return;
            }
            result=result[0];
            var candidate=[];
            for (var i in result)
            {
                if (i=="_id" || i=="activity")
                    continue;
                result[i]=0+result[i];
                for (var j=0;j<result[i];j++)
                    candidate.push(i);
            }
            if (candidate.length<docs.length)
            {
                console.log("R U kidding?!!?!?!?");
                callback();
                return;
            }
            var ranPos,t;
            for (var i=0;i<docs.length;i++)
            {
                ranPos=Math.floor(Math.random()*(candidate.length-i));
                ranPos+=i;
                //void exchange (&e1, &e2)
                //{
                t=candidate[i];
                candidate[i]=candidate[ranPos];
                candidate[ranPos]=t;
                //}
            }

            for (var i=0;i<docs.length;i++)
            {
                result[candidate[i]]--;
            }

            var theid=result._id;
            delete result._id;

            db[SEAT_DB].update({_id:theid},result,{multi:false},function()
            {
                t=0;
                for (var i=0;i<docs.length;i++)
                {
                    db[TICKET_DB].update(
                    {
                        _id: docs[i]._id
                    },
                    {
                        $set: {seat: candidate[i]}
                    },{multi:false},function()
                    {
                        t++;
                        if (t==docs.length)
                        {
                            callback();
                        }
                    });
                }
            });
        });
    });
}

function maintain_seat(callback)
{
    var current=(new Date()).getTime();
    db[ACTIVITY_DB].find(
    {
        status:1,
        book_end: {$lt:current},
        need_seat: {$ne:0}
    },function(err, docs)
    {
        if (err || docs.length==0)
        {
            callback();
            return;
        }
        var t=0;
        for (var i=0;i<docs.length;i++)
        {
            random_assign_seat(docs[i]._id,function()
            {
                t++;
                console.log("Activity "+t+" has arranged seat.");
                if (t==docs.length)
                    callback();
            });
        }
    });
}

module.exports = maintain_seat;
