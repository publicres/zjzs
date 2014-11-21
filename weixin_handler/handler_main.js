var parseString = require('xml2js').parseString;
var template = require('./reply_template');

module.exports = function(req, res)
{
    //Attentez! Stipulate that each route result in a sender command.
    parseString(req.rawData, function(err, result)
    {
        if (err)
        {
            console.log("+++Error occurs! Reason: Invalid format of wechat input.");
            res.send("Wrong format.");
            return;
        }
        var msg=result.xml;
        res.send(template.getPlainTextTemplate(msg,"Bingo Lingo!"));
    });
}
