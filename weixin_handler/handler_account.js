var handler_ticket = require("./handler_ticket");
var template = require('./reply_template');
var urls = require("../address_configure");

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
        template.getPlainTextTemplate(msg,"抢票等功能必须绑定学号后才能使用。\n"
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
