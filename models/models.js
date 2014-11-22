var mongojs = require('mongojs');
var tickets = "ticket";
var activities = "activity";
var students = "student";


exports.tickets = tickets;
exports.activities = activities;
exports.students = students;

exports.db = mongojs('mongodb://localhost/test23', [tickets, activities, students]);
