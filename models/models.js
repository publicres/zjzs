var mongojs = require('mongojs');
var tickets = "ticket";
var activities = "activity";
var students = "student";
var admins = "manager";


exports.tickets = tickets;
exports.activities = activities;
exports.students = students;
exports.admins = admins;

exports.db = mongojs('mongodb://localhost/test23', [tickets, activities, students, admins]);
