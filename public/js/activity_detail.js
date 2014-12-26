/***************控制下面的栏显现/隐藏****************/
function hide_div(x)
{
    $(x).fadeTo(500,0);
}
function show_div(x)
{
    $(x).fadeTo(500,1);
}


/*时间格式处理*/
var time1_start = new Date(activity_time_raw);
var time1_end = new Date(activity_end_time_raw);
var time2_start = new Date(activity_book_ticket_time_raw);
var time2_end = new Date(activity_book_ticket_end_time_raw);

function show_time(t)
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
function combine_time(t1, t2)
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
    if (m1==12&&m2==1&&d1==31&&d2==1)
        return "12月31日 "+h1+':'+mi1+'－'+"次日 "+h2+':'+mi2;
    if (y1!=y2)
        return y1+u+m1+u+d1+' '+h1+':'+mi1+'－'+y2+u+m2+u+d2+' '+h2+':'+mi2;
    if (m1!=m2)
        return m1+'月'+d1+'日 '+h1+':'+mi1+'－'+m2+'月'+d2+'日 '+h2+':'+mi2;
    if (d1!=d2)
        return m1+'月'+d1+'日 '+h1+':'+mi1+'－'+d2+'日 '+h2+':'+mi2;
    return m1+'月'+d1+'日 '+h1+':'+mi1+'－'+h2+':'+mi2;
}
var activity_time = combine_time(time1_start, time1_end);
var activity_book_ticket_time = combine_time(time2_start, time2_end);
/**/


/******添加额外信息******/
var activity_extra_info=[{t:'活动时间',c:activity_time},{t:'活动地点',c:activity_place}];
if (activity_ticket_status==0)
{
    activity_extra_info.push({t:'活动票数',c:activity_remain_ticket+" 张"});
}
else if (activity_ticket_status==1)
{
    activity_extra_info.push({t:'剩余票数',c:"<span style='color:#dd001e'>"+activity_remain_ticket+"</span> 张"});
}
else
{
    //activity_extra_info.push({t:'抢票时间',c:activity_book_ticket_time});
}

/********************************/
var activity_detail_title_2="抢票方式";
var get_ticket_method_title="抢票方式:";
var activity_content_2=
    '<b>'+activity_book_ticket_time+'</b>'+
    '， "清华大学紫荆之声"线上抢票，数量有限，先到先得。<br><div style="height:8px"></div>您可以:<br>'+
    '· 在微信中回复<i style="color:#dd881e">"抢票　'+activity_key+'"</i>进行抢票;<br>'+
    '· 点击"抢票"下设二级菜单<i style="color:#dd881e">"'+activity_key+'"</i>按钮抢票。<br>'+
    (activity_seat_type==0?'':(activity_seat_type==1?'该活动分区域选座，抢到票后可进入查票界面进行选座。<br>':'抢到票后可进入查票界面进行选座。<br>'));

var get_ticket_method_content=''+activity_book_ticket_time+''+
    ' 线上抢票，先到先得！<br><div style="height:1px"></div>'+
    '· 在微信中直接回复<i style="color:#d0dd1e">"抢票　'+activity_key+'"</i><br>'+
    '· 或者，点击"抢票"菜单下的<i style="color:#d0dd1e">"'+activity_key+'"</i>按钮<br>';
$('title').text(activity_page_title);
if (activity_title.length > 8)
{
    var s = $('#activity_title').css('font-size');
    s = s.split(s.length-1)[0];
    s = parseInt(s);
    s *= 8 / activity_title.length;
    s = Math.floor(s);
    $('#activity_title').css('font-size',s+'px');
}
$('#activity_title').text(activity_title);
$('#activity_time').text(activity_time);
$('#activity_content').append(activity_content);
$('#activity_content_2').append(activity_content_2);
$('#get_ticket_method_content').append(get_ticket_method_content);
//var seat_type=["不选座","分区选座","选座"];
//$('#activity_seat_type').append(seat_type[activity_seat_type]);

for (var i in activity_extra_info)
{
  $('#activity_extra_info').append(
    '<div><span>'+activity_extra_info[i].t+'</span><span>:</span>'+
       '<label>'+activity_extra_info[i].c+'</label>'+
    '</div>');
}
$('#activity_detail_title').append('<b>'+activity_detail_title+'</b>');
$('#activity_detail_title_2').append('<b>'+activity_detail_title_2+'</b>');
$('#get_ticket_method_title').append('<b>'+get_ticket_method_title+'</b>');
$('#activity_main_image').attr("src",activity_main_image);
$('#activity_title_image').css("background","url("+activity_title_image+") repeat")
var ticket_status=[
    "<b id='ticket_getting' style='color:#dd001e;'></b>",
    "<b id='ticket_getting' style='color:#dd001e;'></b>",
    "抢票已结束",
    "抢票成功",
    "已领票"
];
$('#activity_ticket_status').append(activity_place);//ticket_status[activity_ticket_status]);

var get_ticket_show=true;
var time_left=(activity_ticket_status==0?activity_book_ticket_time_raw:(activity_book_ticket_end_time_raw))-time_server;

if (activity_content.length<150)
{
    $("#get_ticket_2").css('display','none');
    $("#huahua").css("padding-bottom","150px");
    var timer1=setInterval(function()
    {
        time_left-=100;
        $('#ticket_getting')[0].innerHTML=
            activity_ticket_status>=2?'抢票已结束':
                ((activity_ticket_status?'距抢票结束还有:<br>':'抢票倒计时:<br>')+'　　'+(show_time(time_left)));
    },100);
}
else
{
    var timer1=setInterval(function()
    {
        time_left-=100;
        var y = $(window).scrollTop();
        if (y > 30 && get_ticket_show)
        {
            hide_div(".auto_hide");
            get_ticket_show=false;
            //show_div("#get_ticket_2");
        }
        if (y <= 30 && !get_ticket_show)
        {
            show_div(".auto_hide");
            get_ticket_show=true;
            //hide_div("#get_ticket_2");
        }
        $('#ticket_getting')[0].innerHTML=
            activity_ticket_status>=2?'抢票已结束':
                ((activity_ticket_status?'距抢票结束还有:<br>':'抢票倒计时:<br>')+'　　'+(show_time(time_left)));
    },100);
}
