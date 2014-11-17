var crypto = require('crypto');
var settings = require('./settings');
var sha1Hasher = crypto.createHash('sha1');

exports.check_weixin_signature=
function(signature, timestamp, nonce)
{
    if (signature==null || timestamp==null || nonce==null)
        return false;

    var sortArray=[settings.WEIXIN_TOKEN,timestamp,nonce];

    console.log(signature);
    console.log(timestamp);
    console.log(nonce);

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
