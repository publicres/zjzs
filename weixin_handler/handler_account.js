var handler_ticket = require("./handler_ticket");
var template = require('./reply_template');
var urls = require("../address_configure");
var model = require('../models/models');
var lock = require('../models/lock');

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
