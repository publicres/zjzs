var express = require('express');
var router = express.Router();
var request = require('request');
var http = require('http');
var querystring = require('querystring');
var models = require('../models/models');
var lock = require('../models/lock');

var db = models.db;
var students = models.students;

router.get('/', function(req, res) {
    if (req.query.openid == null) {
        res.send("不要捣乱，要有openid！！");
        return;
    }

    db[students].find({weixin_id: req.query.openid, status: 1}, function(err, docs) {
        var isValidated = 1;
        if (docs.length == 0)
            isValidated = 0;
        res.render('validate', {openid: req.query.openid, isValidated: isValidated});
        return;
    });

});

router.get('/time', function(req, res) {
    request('http://' + models.authIP + ':' + models.authPort + models.authPrefix + '/time', //
    function(error, response, body){
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
        else
            res.send('');
    });
});

router.post('/', function(req, res) {
    var tmp = req.body.secret;
    var openid = req.body.openid;
    var post_option = {
        host: models.authIP,
        port: models.authPort,
        path: models.authPrefix,
        method: "POST",
        headers:{
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    };
    var r = http.request(post_option, function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function(chunk){
            //console.log(chunk);
            var stu = JSON.parse(chunk);
            if (stu.code == 0){
                lock.acquire(students, function(){
                    db[students].find({weixin_id: openid, status: 1}, function(err, docs) {
                        if (docs.length == 0){
                            db[students].find({stu_id:stu.data.ID}, function(err, docs) {
                                if (docs.length == 0){
                                    db[students].insert({stu_id: stu.data.ID, weixin_id: openid, status: 1}, function(){
                                        lock.release(students);
                                        res.send('Accepted');
                                        return;
                                    });
                                }
                                else{
                                    db[students].update({stu_id: stu.data.ID},  {$set : {status: 1, weixin_id: openid}}, function() {
                                        lock.release(students);
                                        res.send('Accepted');
                                        return;
                                    });
                                }
                            });
                        }
                        else{
                            var flag = false;
                            var i;
                            for (i = 0; i < docs.length; i++) {
                                if (docs[i].stu_id == stu.data.ID){
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag){
                                    lock.release(students);
                                    res.send('Accepted');
                                    return;
                            }
                            else{
                                lock.release(students);
                                res.send('Binded');
                                return;
                            }
                        }
                    });
                });
            }
            else {
                res.send(stu.message);
                return;
            }
        });
        resp.on('end', function(){});
    });
    post_data = querystring.stringify({'secret':  tmp });
    r.write(post_data);
    r.end();
});

module.exports = router;
