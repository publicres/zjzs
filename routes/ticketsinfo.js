var express = require('express');
var router = express.Router();
var models = require('../models/models');
var lock = require('../models/lock');

var db = models.db;
var tickets = models.tickets;
var activities = models.activities;

//0是被人退掉的票，1是订了但未支付，2是订了且支付了，3是使用过的票，4是活动结束的票
router.get('/', function(req, res) {
    if (req.query.ticketid == null){
        res.send("不要捣乱，要有ticketid！！");
        return;
    }

    db[tickets].find({unique_id: req.query.ticketid}, function(err, docs) {
        if (docs.length == 0){
            res.send("不要捣乱，你的ticketid没有对应的票！！");
            return;
        }
        else{
            var activityid = docs[0].activity;
            var ticketstatus = docs[0].status;
            var tiSeat = docs[0].seat;

            db[activities].find({_id: activityid}, function(err, docs1) {
                if (docs1.length == 0){
                    res.send("您的票所对应的活动不存在！");
                    return;
                }
                else{
                    var activityName = docs1[0].name;
                    var activityPhoto = docs1[0].pic_url;
                    var activityPlace = docs1[0].place;
                    var tmp1 = new Date(docs1[0].start_time);
                    var beginTime = tmp1.getFullYear() + "年" + (tmp1.getMonth()+1) + "月" + (tmp1.getDate()+1) + "日" + tmp1.getHours() + "时" + tmp1.getMinutes() + "分";
                    var tmp2 = new Date(docs1[0].end_time);
                    var endTime = tmp2.getFullYear() + "年" + (tmp1.getMonth()+1) + "月" + (tmp1.getDate()+1) + "日" + tmp2.getHours() + "时" + tmp2.getMinutes() + "分";
                    var activityKey = docs1[0].key;
                    res.render('ticketsinfo', {
                        act_name: activityName,
                        act_photo: activityPhoto,
                        act_place: activityPlace,
                        act_begintime: beginTime,
                        act_endtime: endTime,
                        act_key: activityKey,
                        ticket_status:ticketstatus,
                        tid:req.query.ticketid,
                        act_need_seat: docs1[0].need_seat,
                        seat: tiSeat
                    });

                    return;
                }
            });
        }
    });
});

module.exports = router;
