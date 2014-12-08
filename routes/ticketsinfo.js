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

                    var ticket_status;
                    if (docs1[0].need_seat!=0 && tiSeat=="")
                        ticket_status=1;
                    else
                        ticket_status=2;
                    if (ticketstatus!=1 && ticketstatus!=2)
                        ticket_status=3;

                    if (tiSeat=="")
                    {
                        var current=(new Date()).getTime();
                        if (ticket_status==1 && (current<docs[0].book_start || current>docs[0].book_end))
                        {
                            ticket_status=2;
                            tiSeat="您未在抢票时间内选座，系统将稍后随机分配座位";
                        }
                    }
                    else
                    {
                        if (docs1[0].need_seat==1)
                            tiSeat=tiSeat[0]+"区";
                    }
                    var be=new Date(docs1[0].book_end);
                    res.render('checkTicket', {
                        act_name: activityName,
                        act_photo: activityPhoto,
                        act_place: activityPlace,
                        act_begintime: beginTime,
                        act_endtime: endTime,
                        act_key: activityKey,
                        tid:req.query.ticketid,
                        act_need_seat: docs1[0].need_seat,
                        seat: tiSeat,
                        ticket_status:ticket_status,
                        act_book_end: be.getFullYear() + "年"
                                    +(be.getMonth()+1) + "月"
                                    + (be.getDate()+1) + "日 "
                                       + be.getHours() + ":"
                                     + be.getMinutes()
                    });

                    return;
                }
            });
        }
    });
});

module.exports = router;
