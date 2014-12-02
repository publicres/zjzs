var model = require('../models/models');

var ACTIVITY_DB = model.activities;
var db = model.db;

exports.getCurrentActivity = getCurrentActivity;

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