var mongojs = require('mongojs');
var tickets = "ticket";
var activities = "activity";
var students = "student";
var admins = "manager";
var seats = "seat"


exports.tickets = tickets;
exports.activities = activities;
exports.students = students;
exports.admins = admins;
exports.seats = seats;

exports.db = mongojs('mongodb://localhost/test23', [tickets, activities, students, admins, seats]);

exports.getIDClass=function(idValue)
{
    idValue=""+idValue;
    return mongojs.ObjectId(idValue);
}
