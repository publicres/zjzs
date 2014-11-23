var https = require('https');
var at = require('./access_token')
var mune = {
    "button": [
        {
            "name": "资讯",
            "sub_button": [
                {
                    "type": "click",
                    "name": "文艺",
                    "key": 'info_activity',
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "讲座",
                    "key": 'info_lecture',
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "新闻",
                    "key": 'info_news',
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "人物",
                    "key":'modern_figure',
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "社团",
                    "key": 'info_organization',
                    "sub_button": []
                }
            ]
        },
        {
            "name": "服务",
            "sub_button": [
                {
                    "type": "click",
                    "name": "抢啥",
                    "key": 'ticket_book_what',
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "查票",
                    "key": 'ticket_get',
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "绑定",
                    "key": 'account_bind',
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "帮助",
                    "key": 'help',
                    "sub_button": []
                }
            ]
        },
        {   
            "name": "抢票",
            "sub_button": [
                {
                    "type": "click",
                    "name": "新年晚会",
                    "key": 'bok_what',
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "新年音乐会",
                    "key": 'get',
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "主题团日",
                    "key": 'bind',
                    "sub_button": []
                }
            ]
        }
    ]
};

var muneStr = JSON.stringify(mune);

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

var http = require("http");
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

at.getAccessToken(createMenu);
