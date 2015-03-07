var sweeper = require("./models/sweeper");
var assigner= require("./models/assign_seat");
var cm = require("./weixin_basic/custom_menu");
var act_info = require('./weixin_basic/activity_info');
var urls = require('./address_configure.js');

var currentHour=(new Date()).getHours();
if (currentHour!=4)
{
    console.log("Wrong time to exec.")
    if (urls.autoRefresh==true)
    {
        cm.isExit=true;
        act_info.getCurrentActivity(cm.autoClearOldMenus);
    }
    else
    {
        process.exit(0);
    }
}
else
{
    sweeper(function()
    {
        assigner(function()
        {
            if (urls.autoRefresh==true)
            {
                cm.isExit=true;
                act_info.getCurrentActivity(cm.autoClearOldMenus);
            }
            else
            {
                process.exit(0);
            }
        });
    });
}

