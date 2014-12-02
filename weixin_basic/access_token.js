var set = require("./settings.js");
var https = require('https');

var ACCESS_TOKEN;
var AT_UPDATE_TIME;

exports.getAccessToken = function getAccessToken(callback){
    var now = new Date();
  
    if(AT_UPDATE_TIME != undefined && now.getYear() == AT_UPDATE_TIME.getYear() && now.getMonth() == AT_UPDATE_TIME.getMonth() && now.getDay() == AT_UPDATE_TIME.getDay() && (now.getHours() - AT_UPDATE_TIME.getHours()) <= 1){
        callback(ACCESS_TOKEN);
    }
    else{
    	var at_tmp = ACCESS_TOKEN;
    	https.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+set.WEIXIN_APPID+"&secret="+set.WEIXIN_SECRET, function (response) {
            response.on('data', function(d) {
   	            var obj = JSON.parse(d);
   	            ACCESS_TOKEN = obj.access_token;
   	            AT_UPDATE_TIME = new Date();
   	            callback(ACCESS_TOKEN);
            });
        }).on('error', function(e) {
            console.error(e);
        });
    }
}

