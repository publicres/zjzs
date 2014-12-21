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
            $("#block_"+w).css("background-image", "url(img/seat/block_"+w+"_selected.png)");
        }
    }

    var statusList = ["", "等待选座", "等待检票", "已检票"];
    var status = ticket.status;
    if(status > 3 || status < 1)
        status = 0;

    $("#ticket_time").html("日期："+ticket.time);
    $("#ticket_title").html(ticket.title);
    $("#ticket_ddl").html("选座截止时间： "+ticket.seatddl);
    $("#ticket_seat").html("座位："+seat);
    $("#ticket_place").html("场馆："+ticket.place);
    $("#ticket_status").html(statusList[status]);
    $("#ticket_cancel").html("退票方式：回复 '退票 "+ ticket.name + "'");
    $("#ticket_order").html("票号："+ ticketIdTransferd);
}

function waitSeatSelection(){
    $("#qrcode").css("-webkit-filter", "blur(1px)");
    $("#qrcode").css("opacity", "0.5");
    $("#noteMessage").css("display", "");

    var widthCurrent = 0.4*width;
    $("#seatEntrance").css("display", "");
    $("#needButton").css("display", "");
    $("#ticket_ddl").css("display", "");
    

    if (netWorkType == "network_type:wifi" && ticket.needseat == 1){
        $("#seatButton").attr("href", "/choosearea?ticketid="+ticket.id);
    }
    else if(ticket.needseat == 1){
        $("#seatButton").attr("href", "/choosearea?ticketid="+ticket.id);
    }

    if(ticket.needseat == 2)
        $("#seatButton").attr("href", "/chooseseat?ticketid="+ticket.id);
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
