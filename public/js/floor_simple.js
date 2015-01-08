$(document).ready(function() {
	//渲染界面数据和图片
	$('#book_time').html(book_time);
	
	//显示票数
	$("#block_A a").html("A区(" + ticketLeft.A + ")");
	$("#block_B a").html("B区(" + ticketLeft.B + ")");
	$("#block_C a").html("C区(" + ticketLeft.C + ")");
	$("#block_D a").html("D区(" + ticketLeft.D + ")");
	$("#block_E a").html("E区(" + ticketLeft.E + ")");

	//区域票数
	ticketNum = new Array();
	ticketNum = [ticketLeft.A,  ticketLeft.B, ticketLeft.C, ticketLeft.D, ticketLeft.E]
	//区域标识
	blockSign = new Array();
	blockSign = ["A", "B", "C", "D", "E"]
	//无票的选区
	for (i = 0; i < 5; i++){
		$("#block_" + blockSign[i]).children("[id^=area]").css("background-color", "#6fd9d9");
		if (ticketNum[i] == 0) {
			$("#block_" + blockSign[i]).css("border-color", "#F22121");
			$("#block_" + blockSign[i]).css("background", "#930202");
			$("#block_" + blockSign[i]).children("[id^=area]").css("background", "#F22121");	
		}
		a = $("#block_" + blockSign[i] + " a");
		left = 0.5*(a.parent().width() - a.width());
		a.css("left", left);
	}
	switch (stateCode){
		case 1: alertInfo("你选择的区域已满<br>请重新选座");
				break;
		case 2: alertInfo("选座超时<br>请重新选座");
				break;
		default: alertInfo("未连入wifi,网页已切入极速版<br>请点击图示区域进行选座");
				break;
	}
	//渲染结束
});


var selected = 0;//记录当前用户选择的区域

//区域的点击事件
$("[id^=block]").click(function(){
	if ($(this).children("a").html()[3] == "0"){
		alertInfo("所选区域已满<br>请选择其他区域");
		return;
	}
	if (selected != 0){
		$('#' + selected + " [id^=area]").css("background", "#6fd9d9");
	}
	selected = $(this).attr("id");
	$(this).children("[id^=area]").css("background", "#f0ee2d");

	//更新文字信息
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



//提交按钮的点击事件
$("#buttom_frame").click(function(){
	var url = window.location.href;
	if (selected != 0){
		$("#submitArea").html('<form name=myForm><input type=hidden name=ticket_id><input type=hidden name=seat><input type=hidden name=stateCode></form>');
	    var myForm=document.forms['myForm'];
	    myForm.action=url;
	    myForm.method='POST';
	    myForm.ticket_id.value=ticket_id;
	    myForm.seat.value=$("#seat_info").html();
	    myForm.stateCode.value = stateCode;
	    myForm.submit();
	}
	else
		alertInfo("你还未选择任何座位");
})


//提示框
function alertInfo(info){
	$("#alertInfo").html(info);
	$("#alertFrame").css("display", "inherit");
	$("#alertFrame").animate({
		top: '40%',
		opacity: '.9',
	}, 1000, function(){
		setTimeout(function(){
			$("#alertFrame").animate({
				top: '25%',
				opacity: '0',
			}, 600, function(){
				$("#alertFrame").css("display", "none");
			})
		}, 1500);
	});
}
