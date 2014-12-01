var https = require('https');
var set = require('./settings')
var at = require('./access_token')

exports.createMenu = createMenu
exports.getMenu = getMenu
exports.deleteMenu = deleteMenu
exports.modifyMenu = modifyMenu
exports.menuStr = menuStr
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
    menuStr = JSON.stringify(set.getCustomMenuWithBookActs(buttons));
    console.log(menuStr)
}

function checkIfActTimeOut(actid, actsHolder){
    // true for the activity is out, false for the activity is not out
    activity = "just_for_test"
    if(actsHolder != undefined){
       actsHolder[set.WEIXIN_BOOK_HEADER + actid] = activity 
    }
            
    return false;
}


/*
activities = {}
    toremove = []
    flag = False
    for button in buttons:
        try:
            if check_if_activity_out(int(button['key'].split('_')[-1]), actsHolder=activities):
                toremove.append(button)
                flag = True
        except:
            continue
    for mv in toremove:
        buttons.remove(mv)
    while len(buttons) > 5:
        dstBtn = buttons[0]
        for button in buttons:
            if activities[button['key']].book_start > activities[dstBtn['key']].book_start:
                dstBtn = button
        buttons.remove(dstBtn)
        flag = True
    return flag
*/
function outClearOldMenus(buttons){
    activities = {}
    toremove = []
    flag = false
    for(var button in buttons){
        try{
            if(checkIfActTimeOut()){}
        }
        catch(err){
            continue;
        }
    }
}