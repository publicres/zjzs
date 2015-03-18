var width;
var status;
var max_width;
var ticketIdTransferd;

window.onload = function(){
    status = ticket.status;
    width=$(".cz_order").width();
    max_width=$(window).height();
    if(width > max_width)
        width = max_width;

    transferTicketId();
    initETicket();

    if(isIE()){
        $("#isIE").css("display", "");
    }
}

function isIE(){
    var a1 = navigator.userAgent;
    var yesIE = a1.search(/Trident/i); 
    if(yesIE > 0){
        return true;
    }
    else{
        return false;
    }

}  

function transferTicketId(){
    var str = ticket.id.substring(0,12);
    ticketIdTransferd = 0;
    var i = 0;
    for(i=0; i<str.length; i++){
        ticketIdTransferd = ticketIdTransferd * 10 + str[i].charCodeAt() % 10;
    }
    ticketIdTransferd = ticket.time.substring(0,4) + ticketIdTransferd;
}

function initETicket(){
    setValue();
    if(ticket.needseat > 0){
        $("#ticket_seat").css("display", "");
    }
    //如果是新清演出票的话
    if(ticket.needseat == 2 && ticket.status == 2 && !ticket.isPaid){
        alertInfo("请关注紫荆之声票务信息，及时换票");
        $("#ticketPayInfo").css("display", "");
    }

    //仅在综体区有座位引导
    if(ticket.needseat == 1 && ticket.status > 1){
        $("#eTicket").css("width", "50%");
        $("#mapGuide").css("display", "");
        $("#blockNotify").css("display", "");
    }


    $("#qrcodeWrap").width(width*0.65)
    $('#qrcode').qrcode({
        width: width*0.65,
        height: width*0.65,
        text: ticket.id
    });

    if(ticket.status == 1){
        waitSeatSelection();
    }
    else{
        $("#ticket_ddl").remove();
        $("#noteMessage").remove();
        $("#seatEntrance").css("display", "none");
        $("#needButton").css("display", "none");
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
            $("#block_" + w).children("[id^=area]").css("background-color", "#f0ee2d");
        }
    }

    var statusList = ["", "等待选座", "等待检票", "已检票"];
    var status = ticket.status;
    if(status > 3 || status < 1)
        status = 0;
    
    if(ticket.needseat == 2 && ticket.status == 2 && !ticket.isPaid){
        $("#ticket_status").html("等待支付");
    }
    else if(ticket.needseat == 2 && ticket.status >= 2 && ticket.isPaid){
        $("#ticket_status").html("已支付");
    }
    else{
        $("#ticket_status").html(statusList[status]);
    }

    $("#ticket_time").html("日期："+ticket.time);
    $("#ticket_title").html(ticket.title);
    $("#ticket_ddl").html("选座截止时间： "+ticket.seatddl);
    $("#ticket_seat").html("座位："+seat);
    $("#ticket_place").html("场馆："+ticket.place);
    
    $("#ticket_cancel").html("退票方式：回复 '退票 "+ ticket.name + "'");
    $("#ticket_order").html("票号："+ ticketIdTransferd);
    if(ticket.needseat == 2 && ticket.status == 2){
        $("#ticketPrice").html("票价："+ticket.price+"元");
        $("#bookHall").html("请到活动指定地点领票");
    }
}

function waitSeatSelection(){
    $("#qrcode").attr("class", "blur");
    $("#qrcode").css("opacity", "0.5");
    $("#noteMessage").css("display", "");

    $(".noteText").css('margin-top', ($('#noteMessage').height()-$('.noteText').height())/2+'px');
  
    var widthCurrent = 0.4*width;
    $("#seatEntrance").css("display", "");
    $("#needButton").css("display", "");
    $("#ticket_ddl").css("display", "");
    

    if (netWorkType == "network_type:wifi" && ticket.needseat == 1){
        $(".seatButton").attr("href", "/choosearea?ticketid="+ticket.id);
    }
    else if(ticket.needseat == 1){
        $(".seatButton").attr("href", "/choosearea?simple=1&ticketid="+ticket.id);
    }

    if(ticket.needseat == 2)
        $(".seatButton").attr("href", "/chooseseat?ticketid="+ticket.id);
}

$("#eTicket").click(function(){
    $("#mapGuide").attr("class", "");
    $("#eTicket").attr("class", "active");
    $("#guideMap-zt").css("display", "none");
    $("#guideMap-xq").css("display", "none");

    if(status > 3 || status < 1)
        status = 0;
    if(status < 2){
        $("#seatEntrance").css("display", "");
    }
    
    $(".cz_order").css("display", "");
});

$("#mapGuide").click(function(){
    var w = ticket.seat.substring(0,1);
    if((w > 'E' || w < 'A') && ticket.status == 2){
        alertInfo("系统24小时内为您分配座位。");    
    }

    if(ticket.needseat == 1){
        $("#guideMap-zt").css("display", "");
    }
    else if(ticket.needseat == 2){
        $("#guideMap-xq").css("display", "");
    }
    else{
        return;
    }
    $("#eTicket").attr("class", "");
    $("#mapGuide").attr("class", "active");
    $("#seatEntrance").css("display", "none");
    $(".cz_order").css("display", "none");

    initMapZt();
});

//author: 林聪
//function: 设置图片的长宽比，可适
function initMapZt(){

    a = $('#front');
    a.height(0.2*a.width());
    leftPos = 0.5 * (document.body.clientWidth - a.width());
    a.css("left", leftPos);

    b = $('#front div');
    b.css("font-size", 0.05*document.body.clientWidth);
    topPos = 0.4 * (a.height() - b.height());
    b.css("margin-top", topPos);

    a = $('#Zongti');
    a.height(a.width());

    a = $('[id^=block]');
    a.css("border-width", 0.01*document.body.clientWidth);

    a = $('#block_A');
    a.width(a.height()/0.83);
    left = 0.485*a.parent().width() - 0.5*a.width();
    a.css("left", left);

    a = $('#area_A1');
    left = 0.5*a.parent().width() - 0.5*a.width();
    a.css("left", left);

    a = $('#area_A4');
    left = 0.5*a.parent().width() - 0.5*a.width();
    a.css("left", left);
    topTemp = 1.2*$('#area_A1').height();
    a.css("top", topTemp);

    a = $('#block_B');
    a.width(0.23*a.height());

    a = $('#block_C');
    a.width(0.23*a.height());


    a = $('#Friend_block');
    a.css("font-size", 0.035*document.body.clientWidth);
    a.width(4.45*a.height());
    left = 0.5*a.parent().width() - 0.5*a.width();
    topTemp = 1*$('#block_A').height()+0.7*a.height();
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
    topTemp = $('#block_A').height() + 2.77 * $('#Friend_block').height() + $('#block_D').height();
    a.css("left", left);
    a.css("top", topTemp);


    $("[id^=block] a").css("font-size", 0.04*document.body.clientWidth);
    $("#info_Area").css("font-size", 0.03*document.body.clientWidth);
}


function alertInfo(info){
    $("#alertInfo").html(info);
    $("#alertFrame").css("display", "inherit");
    $("#alertFrame").animate({
        top: '50%',
        opacity: '.9',
    }, 1000, function(){
        setTimeout(function(){
            $("#alertFrame").animate({
                top: '20%',
                opacity: '0',
            }, 600, function(){
                $("#alertFrame").css("display", "none");
            })
        }, 1000);
    });
}