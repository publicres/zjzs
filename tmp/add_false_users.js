var model = require('../models/models');
var TICKET_DB = model.tickets;
var USER_DB = model.students;
var ACTIVITY_DB = model.activities;
var db = model.db;

for (var i=0;i<=3000;i++)
{
    var str=""+i;
    while (str.length<4)
        str="0"+str;
    var str2="test"+str;
    db[USER_DB].insert({weixin_id:str2, stu_id:str, status:1},function(){});
}
