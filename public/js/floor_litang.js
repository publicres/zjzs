var width, height;
var seat_width;
var mouse_x;

$(document).ready(function() {
	document.onmousemove = function(e) {
		e = e ? e : window.event;
		mouse_x = e.screenX - 0.1*document.body.clientWidth;

	}
	//addSeat();
	setSize();

	$('#loading').css('display', 'none');

	//设置信息
	$('#book_time').html(book_time);

	var space = "ABCDEFGH";

	var i, j;
	for (i = 0; i < space.length; i++)
	{
		for (j = 0; j < ticketLeft[i].length; j++)
		{
			s = ticketLeft[i][j];
			if (s < 10) {
				$("#"+space[i]+" .0"+s).attr("class", "seat_Stu 0"+s);
				$("#"+space[i]+"_show"+" .0"+s).attr("class", "seat_Stu 0"+s);
			}
			else {
				$("#"+space[i]+" ."+s).attr("class", "seat_Stu "+s);
				$("#"+space[i]+"_show"+" ."+s).attr("class", "seat_Stu "+s);
			}
		}
		// for (k = 0; k < normal_ticketLeft[i].length; k++)
		// {
		// 	t = normal_ticketLeft[i][k];
		// 	if (t < 10)
		// 		$("#"+space[i]+" .0"+t).attr("class", "seat_Normal 0"+t);
		// 	else
		// 		$("#"+space[i]+" ."+t).attr("class", "seat_Normal "+t);
		// }
	}

	show_action();
	action();

	message_and_submit();
});


function addSeat() {
	for (var i = 0; i < 3; i++) {
		first3addTable(i);
	}

	for (var i = 3; i < 8; i++) {
		last5addTable(i);
	}

	for (var i = 8; i < 11; i++) {
		middle3addTable(i-8);
	}

	for (var i = 11; i < 16; i++) {
		last5addTable(i);
	}
}

function first3addTable(i) {
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

function middle3addTable(i) {
	for (var j = i; j < 3; j++) {
		$($('tr')[i+8]).append('<td class = "seat_Null"></td>');
	}
	for (var j = 1; j < 6+i; j++) {
		$($('tr')[i+8]).append('<td class = "seat_Cannot 0'+j+'"></td>');
	}
	$($('tr')[i+8]).append('<td class = "seat_Null"></td>');
	for (var j = 6+i; j < 28+i; j++) {
		if (j < 10)
			$($('tr')[i+8]).append('<td class = "seat_Cannot 0'+j+'"></td>');
		else
			$($('tr')[i+8]).append('<td class = "seat_Cannot '+j+'"></td>');
	}
	$($('tr')[i+8]).append('<td class = "seat_Null"></td>');
	for (var j = 28+i; j < 33+i*2; j++) {
		$($('tr')[i+8]).append('<td class = "seat_Cannot '+j+'"></td>');
	}
	for (var j = i; j < 3; j++) {
		$($('tr')[i+8]).append('<td class = "seat_Null"></td>');
	}
}

function last5addTable(i) {
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


function setSize() {
	front = $('#front');
	front.height(0.25*front.width());

	$('#seat_Intro').css("font-size", 0.04*document.body.clientWidth);

	table_show = $("#table_show").width();
	table_seat = $("#table [class^=seat]");
	table_seat.width(table_show/41);
	table_seat.height(table_seat.width());
	seat_w = table_seat.width();
	seat_h = table_seat.height();
	$('#table td').height(seat_h);
	seat_width = seat_w;

	$('#sq').width($("#table_show").width());

	tb_Seat = $("#tb_Container").width();
	seat = $("#floor1 [class^=seat]");
	seat.width(tb_Seat/15);
	seat.height(seat.width());
	 $("#tb_Seat").width(seat.width()*50);
	 $('#floor1 td').height(seat.width());
	// seat_w = seat.width();
	// seat_h = seat.height();
	// seat.css("margin", 0.15*seat.width());

	$('#square').width(seat_w*14+3);
	$('#square').height(seat_h*8+14);
	$('#sq').height($('#square').height());

	if (document.body.clientWidth < document.body.clientHeight) {
		$('#tb_Container').height($('#tb_Seat').height());
	}
	else {
		$('#tb_Container').height(0.3*$('#tb_Container').width());
	}
	width = document.body.clientWidth;
	height = document.body.clientHeight;

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


function show_action() {
	var sq = document.getElementById('sq');
	var floor1 = document.getElementById('floor1');
	var square = document.getElementById('square');
	var dx, dx1, dx2, scale = 3;
	var begin, end;
	// var time_square = 0, time_sq = 0;

	touch.on(square, 'touchstart', function(ev){
	    ev.preventDefault();
	});

	touch.on(square, 'drag', function(ev){
	    dx = dx || 0;
		// dy = dy || 0;
		var offx = dx + ev.x + "px";
		// var offy = dy + ev.y + "px";
	});

	touch.on(square, 'dragend', function(ev){
		// clearTimeout(time_square);
		// $('#square').fadeIn();
		dx += ev.x;

		dx = dx > 0 ? dx : 0;
		dx = dx < ($('#sq').width()*2) ? dx : ($('#sq').width()*2);
		// dy += ev.y;

		dx1 = dx / scale;
		dx2 = 0 - dx;

		square.style.webkitTransform = "translate3d(" + dx1 + "px, " + 0 + "px, 0)";
	    floor1.style.webkitTransform = "translate3d(" + dx2 + "px, " + 0 + "px, 0)";

		// square.style.webkitTransition = "all 0.4s ease 0s";
		// square.style.webkitTransform = "translate3d(" + dx1 + "px, " + 0 + "px, 0)";
		// setTimeout("square.style.webkitTransition = ''",400);
		// floor1.style.webkitTransition = "all 0.4s ease 0s";
	 //    floor1.style.webkitTransform = "translate3d(" + dx2 + "px, " + 0 + "px, 0)";
	 //    setTimeout("floor1.style.webkitTransition = ''",400);
	});

	touch.on(sq, 'tap', function(ev) {
		// clearTimeout(time_sq);
		// $('#square').fadeIn();
		begin = mouse_x - $('#square').width() / 2;
		end = mouse_x + $('#square').width() / 2;

		dx = begin < 0 ? 0 : (end < ($('#sq').width()*2) ? end : ($('#sq').width()*2));
		dx1 = dx / scale;
		dx2 = 0 - dx;

		square.style.webkitTransform = "translate3d(" + dx1 + "px, " + 0 + "px, 0)";
	    floor1.style.webkitTransform = "translate3d(" + dx2 + "px, " + 0 + "px, 0)";

		// square.style.webkitTransition = "all 0.4s ease 0s";
		// square.style.webkitTransform = "translate3d(" + dx1 + "px, " + 0 + "px, 0)";
		// setTimeout("square.style.webkitTransition = ''",400);
		// floor1.style.webkitTransition = "all 0.4s ease 0s";
	 //    floor1.style.webkitTransform = "translate3d(" + dx2 + "px, " + 0 + "px, 0)";
	 //    setTimeout("floor1.style.webkitTransition = ''",400);
	});

	// touch.on(sq, 'touchend', function(ev) {
	// 	time_sq = setTimeout(function() {
	// 		$('#square').fadeOut(2000);
	// 	}, 3000);
	// });

	// touch.on(square, 'touchend', function(ev) {
	// 	time_square = setTimeout(function() {
	// 		$('#square').fadeOut(2000);
	// 	}, 3000);
	// });
}

function action() {
	var floor1 = document.getElementById('floor1');
	var square = document.getElementById('square');
	var dx, dy;
	// var time = 0;

	touch.on(floor1, 'touchstart', function(ev){
	    ev.preventDefault();
	});

	touch.on(floor1, 'drag', function(ev){
	    dx = dx || 0;
		// dy = dy || 0;
		var offx = dx + ev.x + "px";
		// var offy = dy + ev.y + "px";
	});

	touch.on(floor1, 'dragend', function(ev){
		// clearTimeout(time);
		// $('#square').fadeIn();
		// time = 3000;

		dx += ev.x;

		dx = dx > 0 ? 0 : dx;
		dx = dx < (0-$('#tb_Container').width()*2) ? (0-$('#tb_Container').width()*2) : dx;
		// dy += ev.y;

		scale = 3.05;
		dx1 = (0 - dx) / scale;

		square.style.webkitTransform = "translate3d(" + dx1 + "px, " + 0 + "px, 0)";
	    floor1.style.webkitTransform = "translate3d(" + dx + "px, " + 0 + "px, 0)";

		// square.style.webkitTransition = "all 0.4s ease 0s";
		// square.style.webkitTransform = "translate3d(" + dx1 + "px, " + 0 + "px, 0)";
		// setTimeout("square.style.webkitTransition = ''",400);
		// floor1.style.webkitTransition = "all 0.4s ease 0s";
	 //    floor1.style.webkitTransform = "translate3d(" + dx + "px, " + 0 + "px, 0)";
	 //    setTimeout("floor1.style.webkitTransition = ''",400);
	});


	var seatTap = function(evt) {
		if (this.parentElement.id.indexOf("_show") != -1)
			return;
		if (this.className.indexOf("seat_Null") != -1 || this.className.indexOf("seat_Cannot") != -1)
			return;
		if (this.className.indexOf("seat_Stu") == 0) {
			seat_Selected = $('.seat_Selected');
			for (var i = 0; i < seat_Selected.length; i++) {
				$(seat_Selected[i]).attr("class", "seat_Stu" + " " + $(seat_Selected[i]).attr("class").split(' ')[1]);
			}

			var seat_num = $(this).attr("class").split(' ')[1];
			$(this).attr("class", "seat_Selected"+" "+seat_num);
			var id = $(this.parentNode).attr('id');
			$("#"+id+"_show"+" ."+seat_num).attr("class", "seat_Selected"+" "+seat_num);

			var pos, type;
			if (this.className.indexOf("Stu") != -1)
				type = "学生特惠票";
			else type = "普通票";
			pos = this.className.indexOf(" ")+1;
			$("#seat_info").html(type + " " + this.parentElement.id + "排" + this.className.substring(pos) + "座");
		}
		else {
			var seat_num = $(this).attr("class").split(' ')[1];
			$(this).attr("class", "seat_Stu"+" "+seat_num);
			var id = $(this.parentNode).attr('id');
			$("#"+id+"_show"+" ."+seat_num).attr("class", "seat_Stu"+" "+seat_num);
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

	// touch.on(floor1, 'touchend', function(ev) {
	// 	time = setTimeout(function() {
	// 		$('#square').fadeOut(2000);
	// 	}, 3000);
	// });
}

function message_and_submit() {
	//按照时间调整座位大小
	setInterval(function() {
		if (document.body.clientWidth != width || document.body.clientHeight != height) {
			setSize();
		}
	}, 100);

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
}
