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

    //
    var seat = ticket.seat;
    if(seat == ""){
        seat = "无"
    }

    //赋值
    $("#ticket_time").html("日期："+ticket.time);
	$("#ticket_title").html(ticket.title);
    $("#ticket_seat").html("座位："+seat);
    $("#ticket_place").html("场馆："+ticket.place);
    $("#ticket_status").html(statusList[status]);

	//调整二维码大小
    if(status>=2){
        $("#seatEntrance").css("display", "none");
        $("#qrcodeWrap").css("display", "");
        $("#qrcodeWrap").width(width*0.65)


        var trs = $('#qrcode').qrcode({
                width: width*0.65,
                height: width*0.65,
                render: "table",
                text: ticket.id,
                background: "#ffffff", //背景颜色
                foreground: "red" //前景颜色
            })
            .find('tr'),
            trLen = Math.floor(trs.size() / 2),
            tdLen = Math.floor(trs.eq(0)
                .find('td')
                .size() / 2),
            tds, bgColor;
        var colors = qrcode_color>0.66?[['#ab6533', '#7b3503'], ['#7b3503', '#ab6533']]:
                    (qrcode_color>0.36?[['#3365ab', '#03357b'], ['#03357b', '#3365ab']]
                                      :[['#666', '#222'], ['#222', '#666']]);
        trs.each(function(j) {
            tds = $(this)
                .find('td');
            tds.each(function(i) {
                bgColor = this.style.backgroundColor;
                if (bgColor == 'red') {
                    this.style.backgroundColor = colors[j < trLen ? 0 : 1][i < tdLen ? 0 : 1];
                }
            });
        });
    }
    else{
        var widthCurrent = 0.4*width;
        $("#qrcodeWrap").css("display", "none");
        $("#seatEntrance").css("display", "");
        $("#fakeQrcode").width(widthCurrent);
        $("#fakeQrcode").height(widthCurrent);
        $("#seatButton").width(widthCurrent);
        $("#noteImage").width(widthCurrent*0.8);
        $("#noteImage").height(widthCurrent*0.8);
        $("#seatButton").attr("href", "/chooseseat?ticketid="+ticket.id);
    }
});
