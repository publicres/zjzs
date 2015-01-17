var handler_ticket = require("./handler_ticket");
var template = require('./reply_template');
var urls = require("../address_configure");
var model = require('../models/models');
var lock = require('../models/lock');
var act_infoer = require("../weixin_basic/activity_info");
var checker = require("./checkRequest");
var basicInfo = require("../weixin_basic/settings.js");

//Attentez: keep the activity::key unique globally.
var TICKET_DB = model.tickets;
var USER_DB = model.students;
var ACTIVITY_DB = model.activities;
var db = model.db;

exports.check_bind_accout=function(msg)
{
    if (msg.MsgType[0]==="text")
        if (msg.Content[0]==="绑定")
            return true;
    if (checker.checkMenuClick(msg)===basicInfo.WEIXIN_EVENT_KEYS['account_bind'])
        return true;
    return false;
}
function sendBindInfo(msg,res,openID)
{
    res.send(
        template.getPlainTextTemplate(msg,"请在绑定页面输入学生卡号以及校园账户密码以验证身份。\n"
            + template.getHyperLink("打开绑定页面",urls.validateAddress+"?openid="+openID))
    );
}
exports.faire_bind_accout=function(msg,res)
{
    var openID=msg.FromUserName[0];
    handler_ticket.verifyStu(openID,function()
    {
        sendBindInfo(msg,res,openID);
    },function()
    {
        res.send(template.getPlainTextTemplate(msg,"该账号已经绑定，如需绑定其他学号请先解绑。"));
    });
}
//=============================================
exports.check_unbind_accout=function(msg)
{
    if (msg.MsgType[0]==="text")
        if (msg.Content[0]==="解绑")
            return true;
    if (checker.checkMenuClick(msg)===basicInfo.WEIXIN_EVENT_KEYS['account_unbind'])
        return true;
    return false;
}
exports.faire_unbind_accout=function(msg,res)
{
    var openID=msg.FromUserName[0];
    handler_ticket.verifyStu(openID,function()
    {
        res.send(template.getPlainTextTemplate(msg,"该账号尚未绑定。"));
    },function()
    {
        lock.acquire(USER_DB,function()
        {
            db[USER_DB].update({weixin_id:openID,status:1},
            {
                $set:{status:0}
            },{multi:false},function()
            {
                lock.release(USER_DB);
                res.send(template.getPlainTextTemplate(msg,"绑定已经解除。"));
            });
        });
    });
}
//=============================================
exports.check_bookable_activity=function(msg)
{
    if (msg.MsgType[0]==="text")
        if (msg.Content[0]==="抢啥")
            return true;
    if (checker.checkMenuClick(msg)===basicInfo.WEIXIN_EVENT_KEYS['ticket_book_what'])
        return true;
    return false;
}
exports.faire_bookable_activity=function(msg,res)
{
    act_infoer.getCurrentActivity_EX(function(docs)
    {
        if (docs.length===0)
        {
            res.send(template.getPlainTextTemplate(msg,"对不起，最近没有可以抢票的活动 orz..."));
            return;
        }
        var showList=[];
        var tmpEle;
        for (var i=0;i<docs.length;i++)
        {
            tmpEle={};
            tmpEle[template.rich_attr.title]=docs[i].name;
            tmpEle[template.rich_attr.description]=docs[i].description.replace(/\\n/g,"\n");
            if (tmpEle[template.rich_attr.description].length>100)
            {
                tmpEle[template.rich_attr.description]=tmpEle[template.rich_attr.description].substr(0,100);
                tmpEle[template.rich_attr.description]+="...";
            }
            tmpEle[template.rich_attr.url]=urls.activityInfo+"?actid="+docs[i].id;
            tmpEle[template.rich_attr.picture]=docs[i].pic_url;
            showList.push(tmpEle);
        }
        res.send(template.getRichTextTemplate(msg,showList));
    });
}
//======================================
exports.check_get_help=function(msg)
{
    return true;
    if (msg.MsgType[0]==="text")
        if (msg.Content[0]==="帮助")
            return true;
    if (checker.checkSubscribe(msg))
        return true;
    return false;
}
exports.faire_get_help=function(msg,res)
{
    var showList=[];
    var tmpEle;
    tmpEle={};
    tmpEle[template.rich_attr.title]="紫荆之声-操作指南";
    tmpEle[template.rich_attr.description]=
        "刚刚关注平台不知道该做什么？抢票时间将近却不知从何入手？点这里，三步内带你抢票，分秒间玩转紫荆之声！";
    tmpEle[template.rich_attr.url]=urls.help;
    showList.push(tmpEle);

    res.send(template.getRichTextTemplate(msg,showList));
}
//============================================
exports.check_apply_exp=function(msg)
{
    return false;
    if (msg.MsgType[0]==="text")
        if (msg.Content[0]==="获取实验账号")
            return true;
    return false;
}
exports.faire_apply_exp=function(msg,res)
{

    var openID=msg.FromUserName[0];
    handler_ticket.verifyStu(openID,function()
    {
        lock.acquire(USER_DB,function()
        {
            db[USER_DB].update({stu_id:"2333333333",status:1},
            {
                $set:{weixin_id:openID}
            },{upsert:true},function()
            {
                lock.release(USER_DB);
                res.send(template.getPlainTextTemplate(msg,"获取实验账号成功"));
            });
        });
    },function()
    {
        res.send(template.getPlainTextTemplate(msg,"该账号已经绑定。"));
    });
}
