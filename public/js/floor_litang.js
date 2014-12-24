$(document).ready(function() {
	addSeat();
	setSize();

	//设置信息
	$('#book_time').html(book_time);

	var space = "ABCDEFGH";

	var i, j;
	for (i = 0; i < space.length; i++)
	{
		for (j = 0; j < stu_ticketLeft[i].length; j++)
		{
			s = stu_ticketLeft[i][j];
			if (s < 10)
				$("#"+space[i]+" .0"+s).attr("class", "seat_Stu 0"+s);
			else
				$("#"+space[i]+" ."+s).attr("class", "seat_Stu "+s);
		}
		for (k = 0; k < normal_ticketLeft[i].length; k++)
		{
			t = normal_ticketLeft[i][k];
			if (t < 10)
				$("#"+space[i]+" .0"+t).attr("class", "seat_Normal 0"+t);
			else
				$("#"+space[i]+" ."+t).attr("class", "seat_Normal "+t);
		}
	}

	action();
});


function addSeat() {
	for (var i = 0; i < 3; i++) {
		for (var j = i; j < 3; j++) {
			$($('tr')[i]).append('<td class = "seat_Null"></td>');
		}
		for (var j = 1; j < 6+i; j++) {
			$($('tr')[i]).append('<td class = "seat_Cannot 0'+j+'"></td>');
		}
		$($('tr')[i]).append('<td class = "seat_Null"></td>');
		for (var j = 6+i; j < 28+i; j++) {
			if (j < 10)
				$($('tr')[i]).append('<td class = "seat_Cannot 0'+j+'"></td>');
			else
				$($('tr')[i]).append('<td class = "seat_Cannot '+j+'"></td>');
		}
		$($('tr')[i]).append('<td class = "seat_Null"></td>');
		for (var j = 28+i; j < 33+i*2; j++) {
			$($('tr')[i]).append('<td class = "seat_Cannot '+j+'"></td>');
		}
		for (var j = i; j < 3; j++) {
			$($('tr')[i]).append('<td class = "seat_Null"></td>');
		}
	}

	for (var i = 3; i < 8; i++) {
		for (var j = 1; j < 39; j++) {
			if (j < 10)
				$($('tr')[i]).append('<td class = "seat_Cannot 0'+j+'"></td>');
			else
				$($('tr')[i]).append('<td class = "seat_Cannot '+j+'"></td>');
			if (j == 8 || j == 30) {
				$($('tr')[i]).append('<td class = "seat_Null"></td>');
			}
		}
	}
}


function setSize() {
	front = $('#front');
	front.height(0.25*front.width());

	$('#seat_Intro').css("font-size", 0.04*document.body.clientWidth);

	tb_Seat = $("#floor1").width();
	seat = $("[class^=seat]");
	seat.width(tb_Seat/48);
	seat.height(seat.width());
	seat_w = seat.width();
	seat_h = seat.height();
	seat.css("margin", 0.1*seat.width());

	$('td').height(seat_h);

	$('#tb_Container').height(0.6*$('#tb_Container').width());

	tb_Container = $('#tb_Container').width();
	sign = $("[class^=sign]");
	sign.width(0.035*document.body.clientWidth);
	sign.height(0.035*document.body.clientWidth);

	a = $('#buttom');
	a.height(a.width()*0.2)
	b = $('#buttom_frame');
	c = $('#buttom_frame a');
	left = a.width()/2 - b.width()/2;
	topTemp = 1.2*(a.height()/2 - b.height()/2);
	b.css("left", left);
	b.css("top", topTemp);
	topTemp = (b.height()/2 - c.height()/2);
	c.css("top", topTemp);

	$("#instruction").css("font-size", 0.035*document.body.clientWidth);
	$("#info_Area").css("font-size", 0.035*document.body.clientWidth);

	a = $('#buttom');
	b = $('#buttom_frame');
	c = $('#buttom_frame a');
	left = a.width()/2 - b.width()/2;
	topTemp = 1.2*(a.height()/2 - b.height()/2);
	b.css("left", left);
	b.css("top", topTemp);
	topTemp = (b.height()/2 - c.height()/2);
	c.css("top", topTemp);
}


function action() {
	var floor1 = document.getElementById('floor1');
	var dx, dy;

	touch.on(floor1, 'touchstart', function(ev){
	    ev.preventDefault();
	});

	touch.on(floor1, 'drag', function(ev){
	    dx = dx || 0;
	    dy = dy || 0;
	    var offx, offy;
	    if (dx + ev.x < (1-initialScale)*$('#tb_Seat').width()/4) {
	        offx = dx + (ev.x * 0.3) + "px";
	    } else if (dx + ev.x > (initialScale-1) * $('#tb_Seat').width() / 4) {
	        offx = dx + (ev.x * 0.3) + "px";
	    } else {
	        offx = dx + ev.x + "px";
	    }
	    if (dy + ev.y < (1-initialScale)*$('#tb_Seat').height()/4) {
	        offy = dy + (ev.y * 0.3) + "px";
	    } else if (dy + ev.y > (initialScale-1)*$('#tb_Seat').height()/4) {
	        offy = dy + (ev.y * 0.3) + "px";
	    } else {
	        offy = dy + ev.y + "px";
	    }
	    floor1.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
	});

	touch.on(floor1, 'dragend', function(ev){
	    if (dx + ev.x < (1-initialScale)*$('#tb_Seat').width()/2) {
	        dx = (1-initialScale)*$('#tb_Seat').width()/2;
	    } else if (dx + ev.x > (initialScale-1) * $('#tb_Seat').width() / 2) {
	        dx = (initialScale-1) * $('#tb_Seat').width()/2;
	    } else {
	        dx += ev.x
	    }
	    if (dy + ev.y < (1-initialScale)*$('#tb_Seat').height()/2) {
	        dy = (1-initialScale)*$('#tb_Seat').height()/2;
	    } else if (dy + ev.y > (initialScale-1)*$('#tb_Seat').height()/2) {
	        dy = (initialScale-1)*$('#tb_Seat').height()/2;
	    } else {
	        dy += ev.y;
	    }
	    floor1.style.webkitTransition = "all 0.4s ease 0s";
	    floor1.style.webkitTransform = "translate3d(" + dx + "px, " + dy + "px,0)";
	    setTimeout("floor1.style.webkitTransition = ''",400);
	});


	var table = document.getElementById('tb_Seat');

	touch.on(table, 'touchstart', function(ev){
	    ev.preventDefault();
	});

	var initialScale = 1;
	var currentScale;

	touch.on(table, 'pinch', function(ev){
	    currentScale = ev.scale - 1;
	    currentScale = initialScale + currentScale;
	    currentScale = currentScale > 10 ? 10 : currentScale;
	    currentScale = currentScale < 0.5 ? 0.5 : currentScale;
	    table.style.webkitTransform = 'scale(' + currentScale + ')';
	});

	touch.on(table, 'pinchend', function(ev){
	    initialScale = currentScale;
	});

	var seatTap = function(evt) {
		if (this.className.indexOf("seat_Null") != -1 || this.className.indexOf("seat_Cannot") != -1)
			return;
		if (this.childElementCount == 0){
			$("[class^=seat] span").remove();

			$(this).html('<span class = "seat_Selected"><an>');
			$("[class^=seat] span").width(seat_w);
			$("[class^=seat] span").height(seat_h);

			var pos, type;
			if (this.className.indexOf("Stu") != -1)
				type = "学生特惠票";
			else type = "普通票";
			pos = this.className.indexOf(" ")+1;
			$("#seat_info").html(type + " " + this.parentElement.id + "排" + this.className.substring(pos) + "座");
		}
		else {
			$("[class^=seat] span").remove();
			$("#seat_info").html("暂未选座");
		}
	}


	function bind_tap(){
	    var seat_list = $('[class^=seat]');
	    for (var i = 0; i < seat_list.length; i++) {
	        touch.on(seat_list[i], 'tap', seatTap);
	    }
	}

	bind_tap();
}

//消息框
switch (stateCode){
	case 1: $("#alertInfo").html("你选择的区域已满<br>请重新选座");
			break;
	default:
		$("#alertInfo").html("您可以用手势放大选座界面。");
}


setTimeout(function(){
	$("#alertFrame").animate({
		top: '30%',
		opacity: '.9',
	}, 600, function(){
		setTimeout(function(){
			$("#alertFrame").animate({
				top: '20%',
				opacity: '0',
			}, 600, function(){
				$("#alertFrame").css("display", "none");
			})
		}, 2000);
	})
}, 100);

//提交表单选项
$("#buttom_frame").click(function(){
	var url = window.location.href;
	if ($("#seat_info").html() != "暂未选座"){
		//submitString
		var s_info = $("#seat_info").html().split(' ')[1];
		var row = s_info.slice(0, 1);
		var num = s_info.slice(2, 4);

		//submit
		$("#submitArea").html('<form name=myForm><input type=hidden name=ticket_id><input type=hidden name=seat><input type=hidden name=stateCode></form>');
	    var myForm=document.forms['myForm'];
	    myForm.action=url;
	    myForm.method='POST';
	    myForm.ticket_id.value=ticket_id;
	    myForm.seat.value=row+num;
	    myForm.stateCode.value = stateCode;
	    myForm.submit();
	}
	else{
		$("#alertInfo").html("你还未选择任何座位");
		$("#alertFrame").css("display", "block");
		$("#alertFrame").animate({
			top: '30%',
			opacity: '.9',
		}, 600, function(){
			setTimeout(function(){
				$("#alertFrame").animate({
					top: '30%',
					opacity: '0',
				}, 600, function(){
					$("#alertFrame").css("display", "none");
				})
			}, 2000);
		})
	}
})
