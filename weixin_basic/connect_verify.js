var crypto = require('crypto');
var settings = require('./settings');

exports.check_weixin_signature=
function(signature, timestamp, nonce)
{
    //Attentez: used for jmeter
    //return true;
    if (signature==null || timestamp==null || nonce==null)
        return false;

    var sha1Hasher = crypto.createHash('sha1');
    var sortArray=[settings.WEIXIN_TOKEN,timestamp,nonce];

    sortArray.sort();
    sha1Hasher.update(sortArray[0]+sortArray[1]+sortArray[2]);
    var cout=sha1Hasher.digest('hex');
    return (signature==cout);
}

exports.echo_back_weixin=
function(req,res)
{
    res.send(req.query.echostr);
}
