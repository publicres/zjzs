var parseString = require('xml2js').parseString;
var template = require('./reply_template');
var exactHandler = require('./handler_ticket');

//First element is the check function which returns a boolean
//value indicating whether to execute the branch. The second
//one is the function executed, with the message and the responser
//passed in as parameters. Attentez, it is asynchronous, so
//never expect it return anything. Every executing function must
//end up in respond something or a time-out will be gauged.
var pattern =
[
    [exactHandler.check_get_ticket,         exactHandler.faire_get_ticket],
    [exactHandler.check_reinburse_ticket,   exactHandler.faire_reinburse_ticket]
]

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
        for (var i=0;i<pattern.length;i++)
        {
            if (pattern[i][0](msg))
            {
                pattern[i][1](msg,res);
                return;
            }
        }
        res.send(template.getPlainTextTemplate(msg,"Bingo Lingo!"));
    });
}
