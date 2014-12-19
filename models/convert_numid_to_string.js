var model = require('./models');

var USER_DB = model.students;
var db = model.db;
var c=0;

db[USER_DB].find({}).forEach(function(err,doc)
{
    if (err || !doc)
    {
        return;
    }
    db[USER_DB].update({_id:doc._id},
    {
        weixin_id:  ""+doc.weixin_id,
        stu_id:     ""+doc.stu_id,
        status:     doc.status
    },{},function()
    {
        c++;
        console.log("Record "+c+" modified successfully.");
    });
});
