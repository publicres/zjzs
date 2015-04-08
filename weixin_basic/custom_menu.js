var https = require('https');
var set = require('./settings')
var at = require('./access_token')
var act_info = require('./activity_info')

exports.createMenu = createMenu
exports.getMenu = getMenu
exports.deleteMenu = deleteMenu
exports.modifyMenu = modifyMenu
exports.autoClearOldMenus = autoClearOldMenus
exports.menuStr = menuStr
exports.isExit = false;

var menuStr = JSON.stringify(set.WEIXIN_COSTUM_MENU_TEMPLATE);
var menuNowUsed;

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
            if (exports.isExit==true)
                process.exit(0);
        });
    }).on('error', function(e) {
        console.error(e);
    });
    post.write(menuStr);
    post.end();
}

//at.getAccessToken(createMenu);

var options_getMenu = {
     hostname: 'api.weixin.qq.com',
     port: '443',
     path: '/cgi-bin/menu/get?access_token=',
     method: 'GET'
};

function getMenu(access_token){
    options_getMenu.path = options_getMenu.path + access_token;

    var request = https.request(options_getMenu, function (response) {
        response.on("data",function(d){
            process.stdout.write(d);
            var obj = JSON.parse(d);
            menuNowUsed = obj;
        });
    });

    request.end();
}
//at.getAccessToken(getMenu);

var options_deleteMenu = {
     hostname: 'api.weixin.qq.com',
     port: '443',
     path: '/cgi-bin/menu/delete?access_token=',
     method: 'GET'
};

function deleteMenu(access_token){
    options_deleteMenu.path = options_deleteMenu.path + access_token;

    var request = https.request(options_deleteMenu, function (response) {
        response.on("data",function(d){
            process.stdout.write(d);
        });
    });

    request.end();
}
//at.getAccessToken(deleteMenu);


function modifyMenu(buttons){
	if(buttons.length > 0){
	   delete set.WEIXIN_COSTUM_MENU_TEMPLATE["button"][2]["type"];
	   delete set.WEIXIN_COSTUM_MENU_TEMPLATE["button"][2]["key"];
	}
    menuStr = JSON.stringify(set.getCustomMenuWithBookActs(buttons));
}

function autoClearOldMenus(activities){
    buttons = [];
    Obj = {};
    while(activities.length > 4){
        earliestAct = activities[0];
        for(var i in activities){
            act = activities[i];
            if(earliestAct.book_start > act.book_start){
                   earliestAct = act;
            }
        }
        var index = activities.indexOf(earliestAct);
        activities.splice(index,1);
    }
    console.log("Updated: "+activities.length);
    for (i = 0; i < activities.length; i++) {
        Obj["type"] = "click";
        if(Buffer.byteLength(activities[i].key) > 40){
            continue;
        }
        if(Buffer.byteLength(activities[i].id) > 114){
            continue;
        }
        Obj["name"] = activities[i].key;
        Obj["key"] = set.WEIXIN_BOOK_HEADER + activities[i].key;
        Obj["sub_button"] = [];

        buttons.push(JSON.parse(JSON.stringify(Obj)));
    };

    modifyMenu(buttons);
    at.getAccessToken(createMenu);
}
