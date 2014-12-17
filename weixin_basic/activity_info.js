var model = require('../models/models');

var ACTIVITY_DB = model.activities;
var db = model.db;

exports.getCurrentActivity = getCurrentActivity;
exports.getCurrentActivity_EX = getCurrentActivity_EX;

//获得抢票结束时间晚于当前的活动列表
function getCurrentActivity(callback)
{
    var current = (new Date()).getTime();
    db[ACTIVITY_DB].find(
    {
        status: 1,
        book_end: {$gt:current}
    },function(err,docs)
    {
        if (err)
        {
            callback([]);
            return;
        }
        for (var i=0;i<docs.length;i++)
        {
            docs[i].id=docs[i]._id.toString();
        }
        callback(docs);
    });
}

function getCurrentActivity_EX(callback)
{
    var current = (new Date()).getTime();
    db[ACTIVITY_DB].find(
    {
        status: 1,
        end_time: {$gt:current}
    }).sort({book_end:-1},function(err,docs)
    {
        if (err)
        {
            callback([]);
            return;
        }
        for (var i=0;i<docs.length;i++)
        {
            docs[i].id=docs[i]._id.toString();
            if (docs[i].book_end<current)
                docs[i].name+="(抢票已结束)";
        }
        callback(docs);
    });
}
