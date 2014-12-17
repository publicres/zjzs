var width;
var status;
var max_width;

$(document).ready(function(){
    status = ticket.status;
    width=$(".cz_order").width();
    max_width=$(window).height();
    if(width > max_width)
        width = max_width;

    initETicket();
});

//ticket.id is formed randomly in mongodb
//transfer it to show on the "订单编号"
//just for beauty
function addTicketId(){
    var str = ticket.id.substring(0,12);
    var strId = 0;
    var i = 0;
    for(i=0; i<str.length; i++){
        strId = strId * 10 + str[i].charCodeAt() % 10;
    }
    $("#ticket_order").html("&nbsp;订单编号："+ strId);
}

function initETicket(){
    setValue();
    //现在仅在综体区有座位引导
    if(ticket.needseat == 1){
        $("#seat-guide").css("display", "");
        $("#blockNotify").css("display", "");
    }

    if(ticket.needseat == 0){    //不需要选座
        $("#ticket_ddl").remove();
        $("#qrcodeWrap").css("display", "");
        $("#qrcodeWrap").width(width*0.65)
        $('#qrcode').qrcode({
            width: width*0.65,
            height: width*0.65,
            text: ticket.id
        });
    }
    else{
        $("#ticket_seat").css("display", "");

        //已选票
        if(status>=2){
            $("#ticket_ddl").remove();
            $("#qrcodeWrap").css("display", "");
            $("#qrcodeWrap").width(width*0.65)
            $('#qrcode').qrcode({
                width: width*0.65,
                height: width*0.65,
                text: ticket.id
            });
        }
        else
            waitSeatSelection();
    }
}

function setValue(){
    var id = ticket.id;
    var seat = ticket.seat;
    if(ticket.status == 1){
        seat = "等待选座";
    }
    else{
        var w = seat.substring(0,1);
        if(w <= 'E' && w >= 'A'){
            $("#blockNotify").html(w);
            $("#block_"+w).css("background-image", "url(img/seat/block_"+w+"_selected.png)");
        }
    }

    var statusList = ["", "等待选座", "等待检票", "已检票"];
    var status = ticket.status;
    if(status > 3 || status < 1)
        status = 0;

    $("#ticket_time").html("&nbsp;日期："+ticket.time);
    $("#ticket_title").html("&nbsp;"+ticket.title);
    $("#ticket_ddl").html("&nbsp;选座截止时间："+ticket.seatddl);
    $("#ticket_seat").html("&nbsp;座位："+seat);
    $("#ticket_place").html("&nbsp;场馆："+ticket.place);
    $("#ticket_status").html("&nbsp;" + statusList[status]);
    $("#ticket_cancel").html("&nbsp;退票方式：回复 '退票 "+ ticket.name + "'");
    addTicketId();
}

function waitSeatSelection(){
    var widthCurrent = 0.4*width;
    $("#qrcodeWrap").css("display", "none");
    $("#seatEntrance").css("display", "");
    $("#fakeQrcode").width(widthCurrent);
    $("#fakeQrcode").height(widthCurrent);

    $("#noteImage").width(widthCurrent*0.8);
    $("#noteImage").height(widthCurrent*0.8);

    if(ticket.needseat == 1)
        $("#seatButton").attr("href", "/choosearea?ticketid="+ticket.id);
    else if(ticket.needseat == 2)
        $("#seatButton").attr("href", "/chooseseat?ticketid="+ticket.id);
}

$("#e-ticket").click(function(){
    $("#seat-guide").attr("class", "");
    $("#e-ticket").attr("class", "active");
    $("#guideMap-zt").css("display", "none");
    $("#guideMap-xq").css("display", "none");

    if(status > 3 || status < 1)
        status = 0;
    if(status < 2){
        $("#seatEntrance").css("display", "");
    }

    $(".cz_order").css("display", "");
});

$("#seat-guide").click(function(){
    if(ticket.needseat == 1){
        $("#guideMap-zt").css("display", "");
    }
    else if(ticket.needseat == 2){
        $("#guideMap-xq").css("display", "");
    }
    else{
        return;
    }
    $("#e-ticket").attr("class", "");
    $("#seat-guide").attr("class", "active");
    $("#seatEntrance").css("display", "none");
    $(".cz_order").css("display", "none");

    initMapZt();
});

//author: 林聪
//function: 设置图片的长宽比，可适
function initMapZt(){
    var a = $('#front');
    a.height(0.25*a.width());

    a = $('#Zongti');
    a.height(a.width());

    a = $('#block_A');
    a.width(a.height()/0.76);
    left = 0.5*a.parent().width() - 0.5*a.width();
    a.css("left", left);

    a = $('#block_B');
    a.width(0.44*a.height());

    a = $('#block_C');
    a.width(0.45*a.height());

    a = $('#Friend_block');
    a.width(4.45*a.height());
    left = 0.5*a.parent().width() - 0.5*a.width();
    topTemp = $('#block_A').height()+0.5*a.height();
    a.css("left", left);
    a.css("top", topTemp);

    a = $('#block_D');
    a.width(2.5*a.height());
    left = 0.5*a.parent().width() - 0.5*a.width();
    topTemp = $('#block_A').height() + 2 * $('#Friend_block').height();
    a.css("left", left);
    a.css("top", topTemp);

    a = $('#block_E');
    a.height(a.width()/5);
    left = 0.5*a.parent().width() - 0.5*a.width();
    topTemp = $('#block_A').height() + 2.5 * $('#Friend_block').height() + $('#block_D').height();
    a.css("left", left);
    a.css("top", topTemp);

    a = $('#bottom');
    a.height(a.width()/5.5);
}
