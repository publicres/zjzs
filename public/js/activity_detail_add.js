/*把处理好的动态添加的信息挂到网页上*/



/***************控制某个div显现/隐藏****************/
function hide_div(x)
{
    $(x).fadeTo(500,0);
}
function show_div(x)
{
    $(x).fadeTo(500,1);
}

/******添加额外信息******/

function add_to_html()
{
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
    
    $('#activity_ticket_status').append(activity_place);//ticket_status[activity_ticket_status]);
    
    
    if (activity_content.length<300)
    {
        $("#get_ticket_2").css('display','none');
        $("#main_area").css("padding-bottom","150px");
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
            if (y > 80 && get_ticket_show)
            {
                hide_div(".auto_hide");
                get_ticket_show=false;
                //show_div("#get_ticket_2");
            }
            if (y <= 80 && !get_ticket_show)
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
}

add_to_html();