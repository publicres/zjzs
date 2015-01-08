/*时间格式处理*/

function show_time(t)//输入一个毫秒数，转成文字，用作倒计时
{
    if (t<0) t=0;
    var f=Math.floor;
    var d=f(t/86400000);
    var h=f(t%86400000/3600000);
    var m=f(t%3600000/60000);
    var s=f(t%60000/1000);
    var ms=f(t%1000);
    s=s+'.'+f(ms/100);
    if (d)
        return d+'天'+h+'小时'+m+'分';
    if (h)
        return h+'小时'+m+'分'+s+'秒';
    if (m)
        return m+'分'+s+'秒';
    return s+'秒';
}
function combine_time(t1, t2)//合并两个时间，比如1月1日12:00-2日13:00
{
    var u='/';
    var y1=t1.getFullYear();
    var y2=t2.getFullYear();
    var m1=1+t1.getMonth();
    var m2=1+t2.getMonth();
    var d1=t1.getDate();
    var d2=t2.getDate();
    var h1=t1.getHours()+''; h1=h1.length==1?'0'+h1:h1;
    var h2=t2.getHours()+''; h2=h2.length==1?'0'+h2:h2;
    var mi1=t1.getMinutes()+''; mi1=mi1.length==1?'0'+mi1:mi1;
    var mi2=t2.getMinutes()+''; mi2=mi2.length==1?'0'+mi2:mi2;
    var day=['Sun.','Mon.','Tue.','Wed.','Thur.','Fri.','Sat.'];
    var day1=day[t1.getDay()];
    var day2=day[t2.getDay()];
    if (y1!=y2)
        return y1+u+m1+u+d1+' '+h1+':'+mi1+'－'+y2+u+m2+u+d2+' '+h2+':'+mi2;
    if (m1!=m2)
        return m1+'月'+d1+'日 '+h1+':'+mi1+'－'+m2+'月'+d2+'日 '+h2+':'+mi2;
    if (d1!=d2)
        return m1+'月'+d1+'日 '+h1+':'+mi1+'－'+d2+'日 '+h2+':'+mi2;
    return m1+'月'+d1+'日 '+h1+':'+mi1+'－'+h2+':'+mi2;
}

/*把毫秒转成Date型*/
var time1_start = new Date(activity_time_raw);
var time1_end = new Date(activity_end_time_raw);
var time2_start = new Date(activity_book_ticket_time_raw);
var time2_end = new Date(activity_book_ticket_end_time_raw);

var activity_time = combine_time(time1_start, time1_end);
var activity_book_ticket_time = combine_time(time2_start, time2_end);

/*初始化倒计时*/
var time_left = (!activity_ticket_status?activity_book_ticket_time_raw:(activity_book_ticket_end_time_raw))-time_server;