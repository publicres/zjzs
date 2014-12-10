$(document).ready(function(){
	var tickets_show = $(".cz_order");
    var width=$(".cz_order").width();
    var max_width=$(window).height();
    var qrcode_color=Math.random();

    if(width > max_width)
        width = max_width;

    //对座位状态的意外情况进行处理
	var statusList = ["", "等待选座", "等待检票", "已检票"];
	var status = ticket.status;
	if(status > 3 || status < 1)
		status = 0;


    var seat = ticket.seat;
    if(seat == ""){
        seat = "无"
    }
    else{
        var w = seat.substring(0,1);
        if(w <= 'E' && w >= 'A'){
            $("#block_"+w).css("background-image", "url(img/seat/block_"+w+"_selected.png)");
        }
    }

    //赋值
    var id = ticket.id;
    $("#ticket_time").html("日期："+ticket.time);
    $("#ticket_title").html(ticket.title);
    $("#ticket_ddl").html("选座截止时间："+ticket.seatddl);
    $("#ticket_seat").html("座位："+seat);
    $("#ticket_place").html("场馆："+ticket.place);
    $("#ticket_status").html(statusList[status]);
    $("#ticket_cancel").html("退票方式：回复 '退票 "+ ticket.name + "'");
    $("#ticket_order").html("订单编号："+ id.substring(0,12));
    $("#guideMap-zt").css("display", "none");
    $("#guideMap-xq").css("display", "none");
	$("#guideMap-zt").css("opacity", "1");
	$("#guideMap-xq").css("opacity", "1");

	//调整二维码大小
    if(status>=2){
        $("#ticket_ddl").css("display", "none");
        $("#seatEntrance").css("display", "none");
        $("#qrcodeWrap").css("display", "");
        $("#qrcodeWrap").width(width*0.65)


        $('#qrcode').qrcode({
                width: width*0.65,
                height: width*0.65,
                text: ticket.id
        });

    }
    else{
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
});

$("#e-ticket").click(function(){
    $("#seat-guide").attr("class", "");
    $("#e-ticket").attr("class", "active");
    $("#guideMap-zt").css("display", "none");
    $("#guideMap-xq").css("display", "none");

    var status = ticket.status;
    if(status > 3 || status < 1)
        status = 0;
    if(status < 2){
        $("#seatEntrance").css("display", "");
    }

    $(".cz_order").css("display", "");

});

$("#seat-guide").click(function(){
	if (ticket.needseat<=0)
		return;
    $("#e-ticket").attr("class", "");
    $("#seat-guide").attr("class", "active");
    $("#seatEntrance").css("display", "none");
    $(".cz_order").css("display", "none");

    if(ticket.needseat == 1){
        $("#guideMap-zt").css("display", "");
    }
    else if(ticket.needseat == 2){
        $("#guideMap-xq").css("display", "");
    }
});

//author: 林聪
//function: 设置图片的长宽比，可适

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
