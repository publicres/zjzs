var parseString = require('xml2js').parseString;

module.exports = function(req, res)
{
    parseString(req.rawData, function (err, result)
    {
        console.log(result.xml.Content);
    });
}
