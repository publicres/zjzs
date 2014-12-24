var https = require('https');
var urls=require("../address_configure");
var at = require('./access_token')

/*modify menu artificially*/
at.getAccessToken(createMenu);


var WEIXIN_EVENT_KEYS = {
    'info_news': 'V1001_SCHOOL_NEWS',
    'info_organization': 'V1001_OGNIZATION',
    'info_job': 'V1001_JOB',
    'info_vote': 'TSINGHUA_VOTE',
    'ticket_book_what': 'TSINGHUA_BOOK_WHAT',
    'ticket_get': 'TSINGHUA_TICKET',
    'account_bind': 'TSINGHUA_BIND',
    'account_unbind': 'TSINGHUA_UNBIND',
    'help': 'TSINGHUA_HELP',
    'ticket_no_book_recommand': 'TSINGHUA_NO_BOOK_ACTS',
    'ticket_lottery': 'TSINGHUA_LOTTERY'
};

var WEIXIN_COSTUM_MENU_TEMPLATE = {
    "button": [
        {
            "name": "资讯",
            "sub_button": [
                {
                    "type": "click",
                    "name": "新闻",
                    "key": WEIXIN_EVENT_KEYS['info_news'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "就业",
                    "key": WEIXIN_EVENT_KEYS['info_job'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "社团",
                    "key": WEIXIN_EVENT_KEYS['info_organization'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "投票",
                    "key": WEIXIN_EVENT_KEYS['info_vote'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "近期抢票",
                    "key": WEIXIN_EVENT_KEYS['ticket_book_what'],
                    "sub_button": []
                }
            ]
        },
        {
            "name": "抽奖",
            "type": "click",
            "key": WEIXIN_EVENT_KEYS['ticket_lottery'],
            "sub_button": []
        },
        {
            "name": "个人中心",
            "sub_button": [
                {
                    "type": "click",
                    "name": "我的票夹",
                    "key": WEIXIN_EVENT_KEYS['ticket_get'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "绑定",
                    "key": WEIXIN_EVENT_KEYS['account_bind'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "解绑",
                    "key": WEIXIN_EVENT_KEYS['account_unbind'],
                    "sub_button": []
                },
                {
                    "type": "view",
                    "name": "帮助",
                    "url":  urls.help
                }
            ]
        }
    ]
};

var menuStr = JSON.stringify(WEIXIN_COSTUM_MENU_TEMPLATE);

var options_creatMenu = {
     hostname: 'api.weixin.qq.com',
     port: '443',
     path: '/cgi-bin/menu/create?access_token=',
     method: 'POST',
     headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         //'Content-Length': '' + Buffer.byteLength(menuStr)
     }
};

function createMenu(access_token){
    options_creatMenu.path = options_creatMenu.path + access_token;

    var post = https.request(options_creatMenu, function (response) {
        response.on('data', function(d) {
            process.stdout.write(d);
        });
    }).on('error', function(e) {
        console.error(e);
    });
    post.write(menuStr);
    post.end();
}
