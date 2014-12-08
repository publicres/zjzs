var sweeper = require("./models/sweeper");
var assigner= require("./models/assign_seat");

sweeper(function()
{
    assigner(function()
    {
        process.exit(0);
    });
});
