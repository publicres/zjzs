var express = require('express');
var moment = require('moment');
var nodeExcel = require('excel-export');
var router = express.Router();

var model = require('../models/models');
var lock = require('../models/lock');
var urls = require("../address_configure");
var checkin = require('./checkin');
var cm = require("../weixin_basic/custom_menu");
var act_info = require('../weixin_basic/activity_info');
var cache = require("../weixin_handler/handler_ticket");

var ADMIN_DB = model.admins;
var db = model.db;
var getIDClass = model.getIDClass;
var ACTIVITY_DB = model.activities;
var TICKET_DB = model.tickets;
var SEAT_DB = model.seats;

var seat_row_2 = 8;
var seat_col_2 = 40;

router.get("/", function(req, res)
{
	res.redirect("/users/manage/list");
});

router.use("/checkin",checkin);

router.get("/list", function(req, res) {
	var activities1 = new Array();
	db[ACTIVITY_DB].find({status:{$gte:0}}, function(err, docs){
		if (err)
		{
			res.send("数据库抓取活动列表出错！请检查数据库。");
			return;
		}
		for (var i = 0; i < docs.length; i++)
		{
			var j = docs.length-1-i;
			var activity = {
        		status: docs[j].status,
        		name: docs[j].name,
				description: docs[j].description,
				start_time: docs[j].start_time,
				end_time: docs[j].end_time,
				place: docs[j].place,
				book_start: docs[j].book_start,
				book_end: docs[j].book_end,
				id: docs[j]["_id"].toString()
    		};
    		activities1[i] = activity;
		}
		res.render("activity_list", {activities1: activities1});
	});
});

router.post("/delete", function(req, res){
	var idObj = getIDClass(req.body.activityId);
	var activity = {status:-1};
	lock.acquire(ACTIVITY_DB, function(){
		db[ACTIVITY_DB].find({_id:idObj}, function(err, docs){
			if (err || docs.length == 0)
			{
				res.send("数据库查找不到要删除的活动！");
				lock.release(ACTIVITY_DB);
				return;
			}
			if (docs[0]["status"] == 1 &&
				moment(docs[0]["book_start"]).isBefore() && moment(docs[0]["end_time"]).isAfter())
			{
				res.send("活动处于抢票开始到活动结束间的阶段，此阶段不能删除活动！");
				lock.release(ACTIVITY_DB);
				return;
			}
			db[ACTIVITY_DB].update({_id:idObj}, {$set: activity}, {multi:false}, function(err, result){
				if (err || result.n == 0)
				{
					res.send("数据库查找不到要删除的活动！");
					lock.release(ACTIVITY_DB);
				}
				else
				{
					res.send("活动删除成功！");
					lock.release(ACTIVITY_DB);
				}
			});
		});

	});
});

router.get("/export", function(req, res){
	if (req.query.actid == undefined)
	{
		res.send("导出命令缺少actid参数！");
		return;
	}

	var idObj = getIDClass(req.query.actid);
	db[ACTIVITY_DB].find({_id:idObj}, function(err, docs){
		if (err || docs.length == 0)
		{
			res.send("找不到要导出的活动！");
			return;
		}

		var filename = docs[0]["name"] + ".xlsx";
		var payFlag;
		var seatFlag;
		var conf ={};

		payFlag = (docs[0].need_seat == 2);
		seatFlag = docs[0].need_seat;

		conf.cols = [{caption:'学号', type:'string'}];
		if (payFlag)
			conf.cols.push({caption:'支付状态', type:'string'});
		conf.cols.push({caption:'入场状态', type:'string'});
		if (seatFlag != 0)
			conf.cols.push({caption:'座位', type:'string'});

		db[TICKET_DB].find({activity:idObj, status:{$ne:0}}, function(err, docs){
			if (err)
			{
				res.send("票务数据库查找出错！");
				return;
			}
			conf.rows = [];
			for (var i = 0; i < docs.length; i++)
			{
				var item = [];
				item.push(docs[i]["stu_id"]);
				if (payFlag) //需要支付
				{
					if (docs[i].status == 1)
					{
						if (docs[i].cost == 0)
							item.push("免费票");
						else
							item.push("未支付");
						item.push("未入场");
					}
					else if (docs[i].status == 2)
					{
						item.push("已支付");
						item.push("未入场");
					}
					else
					{
						if (docs[i].cost == 0)
							item.push("免费票");
						else
							item.push("已支付");
						item.push("已入场");
					}
				}
				else //不需要支付
				{
					if (docs[i].status != 3)
						item.push("未入场");
					else
						item.push("已入场");
				}

				if (seatFlag == 1) //分区选座的活动
				{
					switch (docs[i].seat)
					{
					case "A_area":
						item.push("A区");
						break;
					case "B_area":
						item.push("B区");
						break;
					case "C_area":
						item.push("C区");
						break;
					case "D_area":
						item.push("D区");
						break;
					case "E_area":
						item.push("E区");
						break;
					default:
						item.push("未选区");
					}
				}

				if (seatFlag == 2) //精确选座的活动
				{
					if (docs[i].seat)
						item.push(docs[i].seat);
					else
						item.push("未选座");
				}

				conf.rows.push(item);
			}

			var result = nodeExcel.execute(conf);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats');

			var userAgent = (req.headers['user-agent']||'').toLowerCase();
			if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0)
				res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
			else if(userAgent.indexOf('firefox') >= 0)
				res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\''
							  + encodeURIComponent(filename)+'"');
			else
				res.setHeader('Content-Disposition', 'attachment; filename='
							  + new Buffer(filename).toString('binary'));

			res.end(result, 'binary');
		});
	});
});

router.get("/detail", function(req, res)
{
	if (!req.query.actid)
	{
		var activity = {name: "新建活动"};
		res.render("activity_detail", {activity:activity});
		return;
	}
	else
	{
		var idObj = getIDClass(req.query.actid);
		lock.acquire(ACTIVITY_DB, function(){
			db[ACTIVITY_DB].find({_id:idObj},function(err,docs){
				if (err || docs.length == 0)
				{
					res.send("没有这个id对应的活动！");
					lock.release(ACTIVITY_DB);
					return;
				}

				var act = docs[0];
				var st = parseInt(docs[0].start_time, 10);
				var et = parseInt(docs[0].end_time, 10);
				var bs = parseInt(docs[0].book_start, 10);
				var be = parseInt(docs[0].book_end, 10);
				docs[0].description.replace(/\n/g,"\\\\n");
				var activity = {
						name: act.name,
						key: act.key,
						place: act.place,
						description: act.description,
						start_time: {
							year: moment(st).get("year"),
							month: (moment(st).get("month")+1),
							day: moment(st).get("date"),
							hour: moment(st).get("hour"),
							minute: moment(st).get("minute")
						},
						end_time: {
							year: moment(et).get("year"),
							month: (moment(et).get("month")+1),
							day: moment(et).get("date"),
							hour: moment(et).get("hour"),
							minute: moment(et).get("minute")
						},
						total_tickets: act.remain_tickets,
						pic_url: act.pic_url,
						book_start: {
							year: moment(bs).get("year"),
							month: (moment(bs).get("month")+1),
							day: moment(bs).get("date"),
							hour: moment(bs).get("hour"),
							minute: moment(bs).get("minute")
						},
						book_end: {
							year: moment(be).get("year"),
							month: (moment(be).get("month")+1),
							day: moment(be).get("date"),
							hour: moment(be).get("hour"),
							minute: moment(be).get("minute")
						},
						need_seat: act.need_seat,
						status: act.status,
						id: req.query.actid
					};
				if (activity.need_seat == 0){
					res.render("activity_detail", {activity:activity});
					lock.release(ACTIVITY_DB);
					return;
				}
				else if (activity.need_seat == 1){
					lock.acquire(SEAT_DB, function(){
						db[SEAT_DB].find({activity:idObj},function(err,docs){
							if (err || docs.length != 1)
							{
								res.send("这个活动的票是分区的，但数据库找不到分区票数信息，或有多个票数信息！");
								lock.release(SEAT_DB);
								lock.release(ACTIVITY_DB);
								return;
							}
							var ar = {a:docs[0].A_area, b:docs[0].B_area, c:docs[0].C_area,
									  d:docs[0].D_area, e:docs[0].E_area};
							activity["area_arrange"] = ar;
							res.render("activity_detail", {activity:activity});
							lock.release(SEAT_DB);
							lock.release(ACTIVITY_DB);
							return;
						});
					});
				}
				else if (activity.need_seat == 2){
					lock.acquire(SEAT_DB, function(){
						db[SEAT_DB].find({activity:idObj},function(err,docs){
							if (err || docs.length != 1)
							{
								res.send("这个活动的票是选座的，但数据库找不到选座票数信息，或有多个票数信息！");
								lock.release(SEAT_DB);
								lock.release(ACTIVITY_DB);
								return;
							}
							var seatArray = [];
							var rowNum = 65;
							var ch;
							var colNum;
							for (i = 0; i < seat_row_2; i++)
							{
								seatArray[i] = [];
								ch = String.fromCharCode(rowNum);
								colNum = 1;
								for (j = 0; j < seat_col_2; j++)
								{
									if (j == 8 || j == 31 || (j == 30 && i % 2 == 0))
										seatArray[i][j] = 0;
									else if (i == 0 && (j < 3 || j > 36))
										seatArray[i][j] = 0;
									else if (i == 1 && (j < 2 || j > 37))
										seatArray[i][j] = 0;
									else if (i == 2 && (j < 1 || j > 38))
										seatArray[i][j] = 0;
									else
									{
										if (colNum < 10)
											seatArray[i][j] = docs[0][ch + "0" + colNum] + 1;
										else
											seatArray[i][j] = docs[0][ch + colNum] + 1;
										colNum++;
									}
								}
								rowNum++;
							}
							activity["seat_map"] = JSON.stringify(seatArray);
							activity["price"] = act.price;
							res.render("activity_detail", {activity:activity});
							lock.release(SEAT_DB);
							lock.release(ACTIVITY_DB);
							return;
						});
					});
				}
				else
				{
					lock.release(ACTIVITY_DB);
					return;
				}
			});
		});
	}
});

router.post("/detail", function(req, res)
{
	var key;
	var activity = {};
	if (req.body.publish)
		activity.status = 1;
	else
		activity.status = 0;
	for (key in req.body)
	{
		if (key == "total_tickets")
			activity["remain_tickets"] = req.body[key];
		else if (key == "seat_map")
			activity[key] = JSON.parse(req.body[key]);
		else
			activity[key] = req.body[key];
	}

	if (activity.publish)
		delete activity.publish;
	if (activity.id)
		delete activity.id;
	if (activity.remain_tickets)
		activity.remain_tickets = parseInt(activity["remain_tickets"]);
	if (activity.start_time)
		activity.start_time = parseInt(activity["start_time"]);
	if (activity.end_time)
		activity.end_time = parseInt(activity["end_time"]);
	if (activity.book_start)
		activity.book_start = parseInt(activity["book_start"]);
	if (activity.book_end)
		activity.book_end = parseInt(activity["book_end"]);
	if (activity.need_seat)
		activity.need_seat = parseInt(activity["need_seat"]);

	if (req.body.id == undefined) //新建活动
	{
		lock.acquire(ACTIVITY_DB, function(){
			db[ACTIVITY_DB].find({key:activity["key"], $or:[{status:0},{status:1}]},function(err,docs){
				var a, b, c, d, e;
				var seatDBmap = {};
				if (err || docs.length != 0)
				{
					res.send("404#新建活动失败，已经有同代称的活动！");
					lock.release(ACTIVITY_DB);
					return;
				}
				else {
					if (!(activity["name"] && activity["key"] && activity["place"] && activity["description"] &&
						activity["remain_tickets"] != undefined && activity["pic_url"] && activity["start_time"] &&
						activity["end_time"] && activity["book_start"] && activity["book_end"] &&
						activity["need_seat"] != undefined))
					{
						res.send("404#活动信息不完整，没有录入数据库！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (activity["remain_tickets"] < 0)
					{
						res.send("404#活动余票量小于0！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (moment(activity["end_time"]).isBefore(activity["start_time"]))
					{
						res.send("404#活动结束时间早于开始时间！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (moment(activity["book_end"]).isBefore(activity["book_start"]))
					{
						res.send("404#抢票结束时间早于开始时间！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (moment(activity["start_time"]).isBefore())
					{
						res.send("404#活动开始时间早于当前时间！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (moment(activity["book_start"]).isBefore())
					{
						res.send("404#抢票开始时间早于当前时间！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					
					if (activity["need_seat"] == 1) //综体
					{
						a = parseInt(activity["A_area"]);
						b = parseInt(activity["B_area"]);
						c = parseInt(activity["C_area"]);
						d = parseInt(activity["D_area"]);
						e = parseInt(activity["E_area"]);
						if (!(a != undefined && b != undefined && c != undefined &&
							d != undefined && e != undefined))
						{
							res.send("404#分区票数信息不完整，没有录入数据库！请重新检查。");
							lock.release(ACTIVITY_DB);
							return;
						}
						if (a<0 || b<0 || c<0 || d<0 || e<0)
						{
							res.send("404#分区票数有负数，没有录入数据库！请重新检查。");
							lock.release(ACTIVITY_DB);
							return;
						}
						if (a+b+c+d+e != activity["remain_tickets"])
						{
							res.send("404#分区票数和不等于总票数，没有录入数据库！请重新检查。");
							lock.release(ACTIVITY_DB);
							return;
						}
						delete activity.A_area;
						delete activity.B_area;
						delete activity.C_area;
						delete activity.D_area;
						delete activity.E_area;
					}
					
					if (activity["need_seat"] == 2) //新清
					{
						var i, j;
						var rowNum = 65;
						var colNum;
						var ch;
						var totalCount = 0;
						if (activity["price"] == undefined)
						{
							res.send("404#选座活动需要一个票价！请重新检查。");
							lock.release(ACTIVITY_DB);
							return;
						}
						for (i = 0; i < seat_row_2; i++)
						{
							ch = String.fromCharCode(rowNum);
							colNum = 1;
							for (j = 0; j < seat_col_2; j++)
							{
								if (activity.seat_map[i][j] == 0)
									continue;
								if (colNum < 10)
									seatDBmap[ch + "0" + colNum] = activity.seat_map[i][j] - 1;
								else
									seatDBmap[ch + colNum] = activity.seat_map[i][j] - 1;
								colNum++;
								if (activity.seat_map[i][j] == 2)
									totalCount++;
							}
							rowNum++;
						}

						if (totalCount != activity["remain_tickets"])
						{
							res.send("404#选座票数和不等于总票数，没有录入数据库！请重新检查。");
							lock.release(ACTIVITY_DB);
							return;
						}
						delete activity.seat_map;
					}
					
					var st = activity["start_time"];
					var be = activity["book_end"];
					if (!(moment([moment(be).year(), moment(be).month(), moment(be).date()]).isBefore(
						[moment(st).year(), moment(st).month(), moment(st).date()])))
					{
						res.send("404#抢票结束时间应不晚于活动开始的前一天！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (activity["description"])
						activity["description"] = activity["description"].replace(/\r?\n/g, "\\n");
					db[ACTIVITY_DB].insert(activity, function(){
						if (activity["need_seat"] != 0)
						{
							db[ACTIVITY_DB].find({key:activity["key"], $or:[{status:0},{status:1}]},
							function(err,docs){
								if (err || docs.length != 1)
								{
									res.send("404#活动数据库录入出错，或有相同代称的活动被同时录入，请删除它们再重新录入！");
									lock.release(ACTIVITY_DB);
									return;
								}
								else if (activity["need_seat"] == 1)
								{
									var ar = {activity: docs[0]["_id"],
											  A_area:a, B_area:b, C_area:c, D_area:d, E_area:e};
									db[SEAT_DB].insert(ar, function(){
										if (activity.status == 1)
										{
											if (urls.autoRefresh)
											{
												act_info.getCurrentActivity(cm.autoClearOldMenus);
											}
											cache.clearCache();
										}
										res.send("200#新建活动成功(分区票务)！");
										lock.release(ACTIVITY_DB);
										return;
									});
								}
								else
								{
									seatDBmap["activity"] = docs[0]["_id"];
									db[SEAT_DB].insert(seatDBmap, function(){
										if (activity.status == 1)
										{
											if (urls.autoRefresh)
											{
												act_info.getCurrentActivity(cm.autoClearOldMenus);
											}
											cache.clearCache();
										}
										res.send("200#新建活动成功(选座票务)！");
										lock.release(ACTIVITY_DB);
										return;
									});
								}
							});
						}
						else
						{
							if (activity.status == 1)
							{
								if (urls.autoRefresh)
								{
									act_info.getCurrentActivity(cm.autoClearOldMenus);
								}
								cache.clearCache();
							}
							res.send("200#新建活动成功(无选座票务)！");
							lock.release(ACTIVITY_DB);
							return;
						}
					});
				}
			});
		});
	}
	else //修改活动
	{
		var idObj = getIDClass(req.body.id);
		lock.acquire(ACTIVITY_DB, function(){
			db[ACTIVITY_DB].find({_id:idObj, $or:[{status:0},{status:1}]},function(err,docs){
				if (err || docs.length != 1)
				{
					res.send("404#修改活动失败，没有此ID对应的活动！");
					lock.release(ACTIVITY_DB);
					return;
				}
				if (docs[0].status == 0) //修改暂存的活动
				{
					var a, b, c, d, e;
					var seatDBmap = {};
					if (!(activity["name"] && activity["key"] && activity["place"] && activity["description"] &&
						activity["remain_tickets"] != undefined && activity["pic_url"] && activity["start_time"] &&
						activity["end_time"] && activity["book_start"] && activity["book_end"] &&
						activity["need_seat"] != undefined))
					{
						res.send("404#活动信息不完整，没有录入数据库！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (activity["remain_tickets"] < 0)
					{
						res.send("404#活动余票量小于0！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (moment(activity["end_time"]).isBefore(activity["start_time"]))
					{
						res.send("404#活动结束时间早于开始时间！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (moment(activity["book_end"]).isBefore(activity["book_start"]))
					{
						res.send("404#抢票结束时间早于开始时间！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (moment(activity["start_time"]).isBefore())
					{
						res.send("404#活动开始时间早于当前时间！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (moment(activity["book_start"]).isBefore())
					{
						res.send("404#抢票开始时间早于当前时间！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (activity["need_seat"] == 1) //综体
					{
						a = parseInt(activity["A_area"]);
						b = parseInt(activity["B_area"]);
						c = parseInt(activity["C_area"]);
						d = parseInt(activity["D_area"]);
						e = parseInt(activity["E_area"]);
						if (!(a != undefined && b != undefined && c != undefined &&
							d != undefined && e != undefined))
						{
							res.send("404#分区票数信息不完整，没有录入数据库！请重新检查。");
							lock.release(ACTIVITY_DB);
							return;
						}
						if (a<0 || b<0 || c<0 || d<0 || e<0)
						{
							res.send("404#分区票数有负数，没有录入数据库！请重新检查。");
							lock.release(ACTIVITY_DB);
							return;
						}
						if (a+b+c+d+e != activity["remain_tickets"])
						{
							res.send("404#分区票数和不等于总票数，没有录入数据库！请重新检查。");
							lock.release(ACTIVITY_DB);
							return;
						}
						delete activity.A_area;
						delete activity.B_area;
						delete activity.C_area;
						delete activity.D_area;
						delete activity.E_area;
					}

					if (activity["need_seat"] == 2) //新清
					{
						var i, j;
						var rowNum = 65;
						var colNum;
						var ch;
						var totalCount = 0;
						if (activity["price"] == undefined)
						{
							res.send("404#选座活动需要一个票价！请重新检查。");
							lock.release(ACTIVITY_DB);
							return;
						}
						for (i = 0; i < seat_row_2; i++)
						{
							ch = String.fromCharCode(rowNum);
							colNum = 1;
							for (j = 0; j < seat_col_2; j++)
							{
								if (activity.seat_map[i][j] == 0)
									continue;
								if (colNum < 10)
									seatDBmap[ch + "0" + colNum] = activity.seat_map[i][j] - 1;
								else
									seatDBmap[ch + colNum] = activity.seat_map[i][j] - 1;
								colNum++;
								if (activity.seat_map[i][j] == 2)
									totalCount++;
							}
							rowNum++;
						}

						if (totalCount != activity["remain_tickets"])
						{
							res.send("404#选座票数和不等于总票数，没有录入数据库！请重新检查。");
							lock.release(ACTIVITY_DB);
							return;
						}
						delete activity.seat_map;
					}

					var st = activity["start_time"];
					var be = activity["book_end"];
					if (!(moment([moment(be).year(), moment(be).month(), moment(be).date()]).isBefore(
						[moment(st).year(), moment(st).month(), moment(st).date()])))
					{
						res.send("404#抢票结束时间应不晚于活动开始的前一天！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					db[ACTIVITY_DB].find({key:activity["key"], $or:[{status:0},{status:1}], _id:{$ne:idObj}},
					function(err,docs){
						if (err || docs.length != 0)
						{
							res.send("404#修改活动失败，已有同代称的活动！");
							lock.release(ACTIVITY_DB);
							return;
						}
						else
						{
							if (activity["description"])
								activity["description"] = activity["description"].replace(/\r?\n/g, "\\n");
							db[ACTIVITY_DB].update({_id:idObj},{$set: activity},{multi:false},function(err,result){
								if (err || result.n != 1)
								{
									res.send("404#修改活动失败，没有此ID对应的活动！");
									lock.release(ACTIVITY_DB);
									return;
								}
								if (activity["need_seat"] == 1)
								{
									var ar = {A_area:a,B_area:b,C_area:c,D_area:d,E_area:e,activity:idObj};
									db[SEAT_DB].update({activity:idObj},ar,{multi:false},
									function(err,result){
										if (err || result.n == 0)
										{
											db[SEAT_DB].insert(ar, function(){
												if (activity.status == 1)
												{
													if (urls.autoRefresh)
													{
														act_info.getCurrentActivity(cm.autoClearOldMenus);
													}
													cache.clearCache();
												}
												res.send("200#修改活动成功(分区票务)！");
												lock.release(ACTIVITY_DB);
												return;
											});
										}
										else
										{
											if (activity.status == 1)
											{
												if (urls.autoRefresh)
												{
													act_info.getCurrentActivity(cm.autoClearOldMenus);
												}
												cache.clearCache();
											}
											res.send("200#修改活动成功(分区票务)！");
											lock.release(ACTIVITY_DB);
											return;
										}
									});
								}
								else if (activity["need_seat"] == 2)
								{
									seatDBmap["activity"] = idObj;
									db[SEAT_DB].update({activity:idObj},seatDBmap,{multi:false},
									function(err,result){
										if (err || result.n == 0)
										{
											db[SEAT_DB].insert(seatDBmap, function(){
												if (activity.status == 1)
												{
													if (urls.autoRefresh)
													{
														act_info.getCurrentActivity(cm.autoClearOldMenus);
													}
													cache.clearCache();
												}
												res.send("200#修改活动成功(选座票务)！");
												lock.release(ACTIVITY_DB);
												return;
											});
										}
										else
										{
											if (activity.status == 1)
											{
												if (urls.autoRefresh)
												{
													act_info.getCurrentActivity(cm.autoClearOldMenus);
												}
												cache.clearCache();
											}
											res.send("200#修改活动成功(选座票务)！");
											lock.release(ACTIVITY_DB);
											return;
										}
									});
								}
								else
								{
									if (activity.status == 1)
									{
										if (urls.autoRefresh)
										{
											act_info.getCurrentActivity(cm.autoClearOldMenus);
										}
										cache.clearCache();
									}
									res.send("200#修改活动成功(无选座票务)！");
									lock.release(ACTIVITY_DB);
									return;
								}
							});
						}
					});
				}
				else //修改已经发布的活动
				{
					var a, b, c, d, e;
					var seatDBmap = {};
					if (activity.status == 0)
					{
						res.send("404#已发布的活动不允许暂存，没有录入数据库！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (!(activity["place"] && activity["description"] && activity["name"] &&
						activity["pic_url"] && activity["start_time"] &&
						activity["end_time"] && activity["book_end"]))
					{
						res.send("404#活动信息不完整，没有录入数据库！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}

					if (activity["key"])
					{
						res.send("404#已发布的活动不允许修改活动代称!");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (moment(activity["start_time"]).isBefore())
					{
						res.send("404#活动开始时间早于当前时间！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					if (moment(activity["end_time"]).isBefore(activity["start_time"]))
					{
						res.send("404#活动结束时间早于开始时间！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}
					var st = activity["start_time"];
					var be = activity["book_end"];
					if (!(moment([moment(be).year(), moment(be).month(), moment(be).date()]).isBefore(
						[moment(st).year(), moment(st).month(), moment(st).date()])))
					{
						res.send("404#抢票结束时间应不晚于活动开始的前一天！请重新检查。");
						lock.release(ACTIVITY_DB);
						return;
					}

					db[ACTIVITY_DB].find({_id:idObj},function(err,docs){
						if (err || docs.length == 0)
						{
							res.send("404#修改活动失败！数据库操作错误或没有这个活动ID!");
							lock.release(ACTIVITY_DB);
							return;
						}
						if (moment(docs[0]["book_start"]).isBefore()) //抢票已经开始
						{
							if (activity["book_start"])
							{
								res.send("404#抢票已开始，不允许修改抢票开始时间!");
								lock.release(ACTIVITY_DB);
								return;
							}
							if (moment(activity["book_end"]).isBefore(docs[0]["book_start"]))
							{
								res.send("404#抢票结束时间早于开始时间！请重新检查。");
								lock.release(ACTIVITY_DB);
								return;
							}
							if (activity["remain_tickets"] != undefined)
							{
								res.send("404#抢票已开始，不允许更改总票数！请重新检查。");
								lock.release(ACTIVITY_DB);
								return;
							}
							if (activity["need_seat"] != undefined)
							{
								res.send("404#抢票已开始，不允许更改座位分配方式！请重新检查。");
								lock.release(ACTIVITY_DB);
								return;
							}
							if (activity["A_area"] || activity["B_area"] || activity["C_area"] ||
								activity["D_area"] || activity["E_area"])
							{
								res.send("404#抢票已开始，不允许更改分区票数！请重新检查。");
								lock.release(ACTIVITY_DB);
								return;
							}
							if (activity["price"])
							{
								res.send("404#抢票已开始，不允许更改票价！请重新检查。");
								lock.release(ACTIVITY_DB);
								return;
							}
							if (activity["seat_map"])
							{
								res.send("404#抢票已开始，不允许更改座位情况！请重新检查。");
								lock.release(ACTIVITY_DB);
								return;
							}
							if (activity["description"])
								activity["description"] = activity["description"].replace(/\r?\n/g, "\\n");
							db[ACTIVITY_DB].update({_id:idObj},{$set: activity},{multi:false},function(err,result){
								if (err || result.n != 1)
								{
									res.send("404#修改活动失败，没有此ID对应的活动！");
									lock.release(ACTIVITY_DB);
									return;
								}
								if (activity.status == 1)
								{
									if (urls.autoRefresh)
									{
										act_info.getCurrentActivity(cm.autoClearOldMenus);
									}
									cache.clearCache();
								}
								res.send("200#修改活动成功！");
								lock.release(ACTIVITY_DB);
								return;
							});
						}
						else //抢票还没开始
						{
							if (moment(activity["book_end"]).isBefore(docs[0]["book_start"]))
							{
								res.send("404#抢票结束时间早于开始时间！请重新检查。");
								lock.release(ACTIVITY_DB);
								return;
							}
							if (!(activity["remain_tickets"] != undefined && activity["need_seat"] != undefined))
							{
								res.send("404#总票数和座位分配信息缺失，请重新检查。");
								lock.release(ACTIVITY_DB);
								return;
							}
							if (activity["remain_tickets"] < 0)
							{
								res.send("404#活动余票量小于0！请重新检查。");
								lock.release(ACTIVITY_DB);
								return;
							}
							if (activity["need_seat"] == 1) //综体
							{
								a = parseInt(activity["A_area"]);
								b = parseInt(activity["B_area"]);
								c = parseInt(activity["C_area"]);
								d = parseInt(activity["D_area"]);
								e = parseInt(activity["E_area"]);
								if (!(a != undefined && b != undefined && c != undefined &&
									d != undefined && e != undefined))
								{
									res.send("404#分区票数信息不完整，没有录入数据库！请重新检查。");
									lock.release(ACTIVITY_DB);
									return;
								}
								if (a<0 || b<0 || c<0 || d<0 || e<0)
								{
									res.send("404#分区票数有负数，没有录入数据库！请重新检查。");
									lock.release(ACTIVITY_DB);
									return;
								}
								if (a+b+c+d+e != activity["remain_tickets"])
								{
									res.send("404#分区票数和不等于总票数，没有录入数据库！请重新检查。");
									lock.release(ACTIVITY_DB);
									return;
								}
								delete activity.A_area;
								delete activity.B_area;
								delete activity.C_area;
								delete activity.D_area;
								delete activity.E_area;
							}

							if (activity["need_seat"] == 2) //新清
							{
								var i, j;
								var rowNum = 65;
								var colNum;
								var ch;
								var totalCount = 0;
								if (activity["price"] == undefined)
								{
									res.send("404#选座活动需要一个票价！请重新检查。");
									lock.release(ACTIVITY_DB);
									return;
								}
								for (i = 0; i < seat_row_2; i++)
								{
									ch = String.fromCharCode(rowNum);
									colNum = 1;
									for (j = 0; j < seat_col_2; j++)
									{
										if (activity.seat_map[i][j] == 0)
											continue;
										if (colNum < 10)
											seatDBmap[ch + "0" + colNum] = activity.seat_map[i][j] - 1;
										else
											seatDBmap[ch + colNum] = activity.seat_map[i][j] - 1;
										colNum++;
										if (activity.seat_map[i][j] == 2)
											totalCount++;
									}
									rowNum++;
								}

								if (totalCount != activity["remain_tickets"])
								{
									res.send("404#选座票数和不等于总票数，没有录入数据库！请重新检查。");
									lock.release(ACTIVITY_DB);
									return;
								}
								delete activity.seat_map;
							}

							if (activity["description"])
								activity["description"] = activity["description"].replace(/\r?\n/g, "\\n");
							db[ACTIVITY_DB].update({_id:idObj},{$set: activity},{multi:false},function(err,result){
								if (err || result.n != 1)
								{
									res.send("404#修改活动失败，没有此ID对应的活动！");
									lock.release(ACTIVITY_DB);
									return;
								}
								if (activity["need_seat"] == 1)
								{
									var ar = {A_area:a,B_area:b,C_area:c,D_area:d,E_area:e,activity:idObj};
									db[SEAT_DB].update({activity:idObj},ar,{multi:false},
									function(err,result){
										if (err || result.n == 0)
										{
											db[SEAT_DB].insert(ar, function(){
												if (activity.status == 1)
												{
													if (urls.autoRefresh)
													{
														act_info.getCurrentActivity(cm.autoClearOldMenus);
													}
													cache.clearCache();
												}
												res.send("200#修改活动成功(分区票务)！");
												lock.release(ACTIVITY_DB);
												return;
											});
										}
										else
										{
											if (activity.status == 1)
											{
												if (urls.autoRefresh)
												{
													act_info.getCurrentActivity(cm.autoClearOldMenus);
												}
												cache.clearCache();
											}
											res.send("200#修改活动成功(分区票务)！");
											lock.release(ACTIVITY_DB);
											return;
										}
									});
								}
								else if (activity["need_seat"] == 2)
								{
									seatDBmap["activity"] = idObj;
									db[SEAT_DB].update({activity:idObj},seatDBmap,{multi:false},
									function(err,result){
										if (err || result.n == 0)
										{
											db[SEAT_DB].insert(seatDBmap, function(){
												if (activity.status == 1)
												{
													if (urls.autoRefresh)
													{
														act_info.getCurrentActivity(cm.autoClearOldMenus);
													}
													cache.clearCache();
												}
												res.send("200#修改活动成功(选座票务)！");
												lock.release(ACTIVITY_DB);
												return;
											});
										}
										else
										{
											if (activity.status == 1)
											{
												if (urls.autoRefresh)
												{
													act_info.getCurrentActivity(cm.autoClearOldMenus);
												}
												cache.clearCache();
											}
											res.send("200#修改活动成功(选座票务)！");
											lock.release(ACTIVITY_DB);
											return;
										}
									});
								}
								else
								{
									if (activity.status == 1)
									{
										if (urls.autoRefresh)
										{
											act_info.getCurrentActivity(cm.autoClearOldMenus);
										}
										cache.clearCache();
									}
									res.send("200#修改活动成功(无选座票务)！");
									lock.release(ACTIVITY_DB);
									return;
								}
							});
						}
					});
				}
			});
		});
	}

});

module.exports = router;
