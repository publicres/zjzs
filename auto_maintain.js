var sweeper = require("./models/sweeper");
var assigner= require("./models/assign_seat");
var cm = require("./weixin_basic/custom_menu");
var act_info = require('./weixin_basic/activity_info');

var currentHour=(new Date()).getHours();
if (currentHour!=4)
{
    console.log("Wrong time to exec.")
    process.exit(0);
}
sweeper(function()
{
    assigner(function()
    {
        cm.isExit=true;
        act_info.getCurrentActivity(cm.autoClearOldMenus);
    });
});
