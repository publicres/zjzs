//WARNING: it is the deprecated version of ticket handler
//DONOT try to refer to it.

var template = require('./reply_template');
var model = require('../models/models');
var lock = require('../models/lock');
var urls = require("../address_configure");

//Attentez: keep the activity::key unique globally.
var TICKET_DB = model.tickets;
var USER_DB = model.students;
var ACTIVITY_DB = model.activities;
var db = model.db;

var timer = new Date();
var alphabet = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";

var stu_cache={};
var act_cache={};

function verifyStudent(openID,ifFail,ifSucc)
{
    db[USER_DB].find({weixin_id:openID,status:1},function(err,docs)
    {
        if (err || docs.length==0)
        {
            ifFail();
            return;
        }
        ifSucc(docs[0].stu_id);
    });
}
exports.verifyStu=verifyStudent;
function verifyActivities(actKey,ifFail,ifSucc)
{
    var current=timer.getTime();
    var theAct=act_cache[actKey];
    if (theAct)
    {
        if (current>theAct.book_start && current<theAct.book_end)
        {
            ifSucc(theAct._id,theAct);
            return;
        }
        act_cache[actKey]=null;
        ifFail();
        return;
    }
    db[ACTIVITY_DB].find(
    {
        key:actKey,
        book_start:{$lt:current},
        book_end:{$gt:current},
        status:1
    },function(err,docs)
    {
        if (err || docs.length==0)
        {
            ifFail();
            return;
        }
        act_cache[actKey]=docs[0];
        //Attentez: Avoid to change activities info when booking time.
        ifSucc(docs[0]._id,docs[0]);
    });
}
function getRandomString()
{
    var ret="";

    for (var i=0;i<32;i++)
        ret+=alphabet[Math.floor(Math.random()*alphabet.length)];
    return ret;
}
//Attentez: this function can only be called on condition that the collection is locked.
function generateUniqueCode(callback)
{
    var tickCode=getRandomString();
    db[TICKET_DB].find({unique_id:tickCode},function(err,docs)
    {
        if (err) return;
        if (docs.length==0)
            callback(tickCode);
        else
            generateUniqueCode(callback);
    })
}
function presentTicket(msg,res,tick,act)
{
    var tmp=[renderTicketList(tick,act,true)];
    res.send(template.getRichTextTemplate(msg,tmp));
}

exports.check_get_ticket=function(msg)
{
    if (msg.MsgType[0]==="text")
        if (msg.Content[0]==="抢票" || msg.Content[0].substr(0,3)==="抢票 ")
            return true;
    return false;
}
exports.faire_get_ticket=function(msg,res)
{
    var actName,openID;
    if (msg.Content[0]==="抢票")
    {
        //WARNING: Fill the activity name!!
        res.send(template.getPlainTextTemplate(msg,"bie nao."));
        return;
    }
    else
    {
        actName=msg.Content[0].substr(3);
    }

    openID=msg.FromUserName[0];
    verifyStudent(openID,function()
    {
        //WARNING: may change to direct user to bind
        res.send(template.getPlainTextTemplate(msg,"请先绑定学号。"));
    },function(stuID)
    {
        verifyActivities(actName,function()
        {
            res.send(template.getPlainTextTemplate(msg,"目前没有符合要求的活动处于抢票期。"));
        },function(actID,staticACT)
        {
            //Attentez: unlike stuID which is THUid, act id is simply act._id
            db[TICKET_DB].find({stu_id:stuID, activity:actID, status:{$ne:0}},function(err,docs)
            {
                if (err || docs.length>0)
                {
                    res.send(template.getPlainTextTemplate(msg,"你已经有票啦，请用查票功能查看抢到的票吧！"));
                    return;
                }

                db[ACTIVITY_DB].update(
                {
                    _id:actID,
                    remain_tickets:{$gt:0}
                },
                {
                    $inc: {remain_tickets:-1}
                },{multi:false},function(err,result)
                {
                    if (err || result.n==0)
                    {
                        res.send(template.getPlainTextTemplate(msg,"对不起，票已抢完...(╯‵□′)╯︵┻━┻。如果你已经抢到票，请使用查票功能查看抢到票的信息。"));
                        return;
                    }

                    generateUniqueCode(function(tiCode)
                    {
                        db[TICKET_DB].insert(
                        {
                            stu_id:     stuID,
                            unique_id:  tiCode,
                            activity:   actID,
                            status:     1,
                            seat:       "",
                            cost:       0
                        }, function()
                        {
                            presentTicket(msg,res,{unique_id:tiCode},staticACT);
                            return;
                        });
                    });
                });
            });
        });
    });
}
//========================================
exports.check_reinburse_ticket=function(msg)
{
    if (msg.MsgType[0]==="text")
        if (msg.Content[0]==="退票" || msg.Content[0].substr(0,3)==="退票 ")
            return true;
    return false;
}
exports.faire_reinburse_ticket=function(msg,res)
{
    var actName,openID;
    if (msg.Content[0]==="退票")
    {
        //WARNING: Fill the activity name!!
        res.send(template.getPlainTextTemplate(msg,"bie nao."));
        return;
    }
    else
    {
        actName=msg.Content[0].substr(3);
    }

    openID=msg.FromUserName[0];
    verifyStudent(openID,function()
    {
        //WARNING: may change to direct user to bind
        res.send(template.getPlainTextTemplate(msg,"请先绑定学号。"));
    },function(stuID)
    {
        verifyActivities(actName,function()
        {
            res.send(template.getPlainTextTemplate(msg,"目前没有符合要求的活动处于退票期。"));
        },function(actID)
        {
            db[TICKET_DB].update(
            {
                stu_id:stuID,
                activity:actID,
                status:1
            },
            {
                $set: {status:0}
            },{multi:false},function(err,result)
            {
                if (err || result.n==0)
                {
                    res.send(template.getPlainTextTemplate(msg,
                        "未找到您的抢票记录或您的票已经支付，退票失败。如为已支付票，请联系售票机构退还钱款后退票。"));
                    return;
                }

                db[ACTIVITY_DB].update({_id:actID},
                {
                    $inc: {remain_tickets:1}
                },{multi:false},function()
                {
                    res.send(template.getPlainTextTemplate(msg,"退票成功。"));
                    return;
                });
            });
        });
    });
}
//========================================
exports.check_list_ticket=function(msg)
{
    if (msg.MsgType[0]==="text")
        if (msg.Content[0]==="查票")
            return true;
    return false;
}
function renderTicketList(oneTicket,oneActivity,isSingle)
{
    var ret={};

    if (isSingle)
    {
        //Attentez: notify the user to select seat.
        ret[template.rich_attr.title]="抢票成功！";
        ret[template.rich_attr.description]=oneActivity.name;
    }
    else
        ret[template.rich_attr.title]=oneActivity.name;
    ret[template.rich_attr.url]=urls.ticketInfo+"?ticketid="+oneTicket.unique_id;
    ret[template.rich_attr.picture]=oneActivity.pic_url;

    return ret;
}
exports.faire_list_ticket=function(msg,res)
{
    var openID;

    openID=msg.FromUserName[0];
    verifyStudent(openID,function()
    {
        //WARNING: may change to direct user to bind
        res.send(template.getPlainTextTemplate(msg,"请先绑定学号。"));
    },function(stuID)
    {
        db[TICKET_DB].find(
        {
            stu_id:stuID,
            $or:[{status:1},{status:2}]
        },function(err,docs)
        {
            if (err || docs.length==0)
            {
                res.send(template.getPlainTextTemplate(msg,"没有找到属于您的票哦，赶快去抢一张吧！"));
                return;
            }
            var actList=[];
            var actMap={};
            var list2Render=[];
            for (var i=0;i<docs.length;i++)
            {
                actList.push({_id:docs[i].activity});
            }
            db[ACTIVITY_DB].find(
            {
                $or: actList
            },function(err1,docs1)
            {
                if (err1 || docs1.length==0)
                {
                    res.send(template.getPlainTextTemplate(msg,"出错了 T T，稍后再试。"));
                    return;
                }
                //WARNING: what if tickets>=WEIXIN_LIMIT?
                for (var i=0;i<docs1.length;i++)
                {
                    actMap[docs1[i]._id]=docs1[i];
                }
                for (var i=0;i<docs.length;i++)
                {
                    list2Render.push(renderTicketList(docs[i],actMap[docs[i].activity],false));
                }
                res.send(template.getRichTextTemplate(msg,list2Render));
            });
        });
    });
}
