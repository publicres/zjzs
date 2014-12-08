$(document).ready(function() {
	$('#book_time').html(book_time);
});

//CSS格式调整
a = $('#front');
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

a = $('#buttom');
b = $('#buttom_frame');
c = $('#buttom_frame a');
left = a.width()/2 - b.width()/2;
topTemp = 1.2*(a.height()/2 - b.height()/2);
b.css("left", left);
b.css("top", topTemp);
topTemp = 0.8*(b.height()/2 - c.height()/2);
c.css("top", topTemp);
//CSS格式调整结束

$("#block_A a").html("A区(" + ticketLeft.A + ")");
$("#block_B a").html("B区(" + ticketLeft.B + ")");
$("#block_C a").html("C区(" + ticketLeft.C + ")");
$("#block_D a").html("D区(" + ticketLeft.D + ")");
$("#block_E a").html("E区(" + ticketLeft.E + ")");

var selected = 0;

$("[id^=f1],[id^=f2]").click(function(){
	if (selected != 0)
		$('#' + selected).css("background-image", "url(/staticcccccccc/img/seat/"+selected+".png)");
	selected = $(this).attr("id");
	$(this).css("background-image", "url(img/seat/"+selected+"_selected.png)");
	if (selected[1] == '1')
		$("#seat_info").html("一层"+selected[3]+"区");
	else $("#seat_info").html("二层"+selected[3]+"区");
})

$("[id^=block]").click(function(){
	if (selected != 0)
		$('#' + selected).css("background-image", "url(img/seat/"+selected+".png)");
	selected = $(this).attr("id");
	$(this).css("background-image", "url(img/seat/"+selected+"_selected.png)");
	$("#seat_info").html(selected[6]+"区");
	var avaiNumber;
	switch(selected[6]){
		case 'A': avaiNumber = ticketLeft.A; break;
		case 'B': avaiNumber = ticketLeft.B; break;
		case 'C': avaiNumber = ticketLeft.C; break;
		case 'D': avaiNumber = ticketLeft.D; break;
		case 'E': avaiNumber = ticketLeft.E; break;
	}
	$("#avaiNumber").html(avaiNumber);
})

$("#save").mousedown(function(){
	$("#bottom").css("background-image", "url(img/seat/bottom_save.png)");
})

$("#save").mouseup(function(){
	setTimeout(function(){
		$("#bottom").css("background-image", "url(img/seat/bottom.png)");
		if (selected != 0)
			alert("成功保存预选座位信息。");
		else
			alert("你还未选择任何座位。");

	}, 100);
})

$("#submit").mousedown(function(){
	$("#bottom").css("background-image", "url(img/seat/bottom_submit.png)");
})

$("#submit").mouseup(function(){
	setTimeout(function(){
		$("#bottom").css("background-image", "url(img/seat/bottom.png)");


	}, 100);
})


$("#buttom_frame").click(function(){
	var url = window.location.href;
	if (selected != 0){
		$("body").append($("<div style='display:none' id='huahua'>"));

		$("#huahua").html('<form name=myForm><input type=hidden name=ticket_id><input type=hidden name=seat></form>');
	    var myForm=document.forms['myForm'];
	    myForm.action=url;
	    myForm.method='POST';
	    myForm.ticket_id.value=ticket_id;
	    myForm.seat.value=$("#seat_info").html();
	    myForm.submit();
	}
	else
		alert("你还未选择任何座位。");
})
