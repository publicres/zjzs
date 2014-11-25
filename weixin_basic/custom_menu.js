var https = require('https');
var set = require('./settings')
var at = require('./access_token')

var muneStr = JSON.stringify(set.WEIXIN_COSTUM_MENU_TEMPLATE);

var options = {
     hostname: 'api.weixin.qq.com',
     port: '443',
     path: '/cgi-bin/menu/create?access_token=',
     method: 'POST',
     headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'Content-Length': '' + Buffer.byteLength(muneStr)
     }
};

function createMenu(access_token){
    options.path = options.path + access_token;

    var post = https.request(options, function (response) {
        response.on('data', function(d) {
        process.stdout.write(d);
        });
    }).on('error', function(e) {
        console.error(e);
    });
    post.write(muneStr);
    post.end();
}

exports.createMenu = at.getAccessToken(createMenu);
