var urls=require("../address_configure");

exports.WEIXIN_TOKEN = 'F8ZFW1Cyzr5z6nNoJ5uZhA8iXEbe1hvX';

exports.WEIXIN_APPID = 'wxba2385bd8746d139';

exports.WEIXIN_SECRET = 'e6f9aea61c5511cb2adb0543e1f2f206';

var WEIXIN_EVENT_KEYS = {
	'info_news': 'V1001_SCHOOL_NEWS',
	'info_organization': 'V1001_OGNIZATION',
	'info_job': 'V1001_JOB',
	'info_vote': 'IN_THE_AIR_VOTE',
    'ticket_book_what': 'TSINGHUA_BOOK_WHAT',
    'ticket_get': 'TSINGHUA_TICKET',
    'account_bind': 'TSINGHUA_BIND',
    'account_unbind': 'TSINGHUA_UNBIND',
    'help': 'TSINGHUA_HELP',
    'ticket_no_book_recommand': 'TSINGHUA_NO_BOOK_ACTS',
    'ticket_book_header': 'TSINGHUA_BOOK_',
    'ticket_no_activity': 'NO_ACTIVITY',
};

exports.WEIXIN_EVENT_KEYS = WEIXIN_EVENT_KEYS;

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
                }
            ]
        },
        {
            "name": "抢票",
            "type": "click",
            "key": WEIXIN_EVENT_KEYS['ticket_no_activity'],
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
exports.WEIXIN_COSTUM_MENU_TEMPLATE = WEIXIN_COSTUM_MENU_TEMPLATE;

exports.WEIXIN_BOOK_HEADER = 'I_WANNA_BOOK_';

exports.getCustomMenuWithBookActs = function(actsbtn){
    var menuStr = JSON.stringify(WEIXIN_COSTUM_MENU_TEMPLATE);
    var tmpmenu = eval('(' + menuStr + ')');
    book_btn = tmpmenu['button'][1];

    if(actsbtn[0] == undefined){
        book_btn['type'] = 'click';
        book_btn['key'] = WEIXIN_EVENT_KEYS['ticket_no_book_recommand']
    }
    book_btn['sub_button'] = actsbtn;
    book_btn['sub_button'].push(objBW);
    return tmpmenu;
}

objBW = {
            "type": "click",
            "name": "近期活动",
            "key": WEIXIN_EVENT_KEYS['ticket_book_what'],
            "sub_button": []
        }
