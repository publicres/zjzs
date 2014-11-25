
exports.WEIXIN_TOKEN = 'F8ZFW1Cyzr5z6nNoJ5uZhA8iXEbe1hvX'

exports.WEIXIN_APPID = 'wxba2385bd8746d139'

exports.WEIXIN_SECRET = 'e6f9aea61c5511cb2adb0543e1f2f206'

exports.WEIXIN_EVENT_KEYS = WEIXIN_EVENT_KEYS
var WEIXIN_EVENT_KEYS = {
	'info_activity': 'V1001_TODAT_ACTIVE',
    'info_lecture': 'V1001_TODAT_LECTURE',
    'info_news': 'V1001_SCHOOL_NEWS',
    'info_organization': 'V1001_OGNIZATION',
    'ticket_book_what': 'TSINGHUA_BOOK_WHAT',
    'ticket_get': 'TSINGHUA_TICKET',WEIXIN_EVENT_KEYS
    'account_bind': 'TSINGHUA_BIND',
    'help': 'TSINGHUA_HELP',
    'ticket_no_book_recommand': 'TSINGHUA_NO_BOOK_ACTS',
    'ticket_book_header': 'TSINGHUA_BOOK_',
    'modern_figure': 'V1001_MODERN_FIGURE',
}

exports.WEIXIN_COSTUM_MENU_TEMPLATE = {
    "button": [
        {
            "name": "资讯",
            "sub_button": []
        },
        {
            "name": "服务",
            "sub_button": [
                {
                    "type": "click",
                    "name": "抢啥",
                    "key": WEIXIN_EVENT_KEYS['ticket_book_what'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "查票",
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
                    "name": "帮助",
                    "key": WEIXIN_EVENT_KEYS['help'],
                    "sub_button": []
                }
            ]
        },
        {
            "name": "抢票",
            "sub_button": []
        }
    ]
}

exports.WEIXIN_BOOK_HEADER = 'TSINGHUA_BOOK_';

exports.get_custom_menu_with_book_acts = function(actsbtn){
    var tmpmenu = 1
}