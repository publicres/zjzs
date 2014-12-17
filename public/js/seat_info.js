// $(document).ready(function() {
// 	$('#tb_Seat A').css()
// });

tb_Seat = $("#tb_Seat").width();
seat = $("[class^=seat]");
seat.width(tb_Seat/52);
seat.height(0.8 * seat.width());
seat_w = seat.width();
seat_h = seat.height();


// //更新信息
// $("[class^=seat]").click(function(){
// 	if (this.className.indexOf("seat_Null") != -1 || this.className.indexOf("seat_Cannot") != -1)
// 		return;
// 	if (this.childElementCount == 0){
// 		$("[class^=seat] span").remove();

// 		$(this).html('<span class = "seat_Selected"></span>');
// 		$("[class^=seat] span").width(seat_w);
// 		$("[class^=seat] span").height(seat_h);

// 		var pos, type;
// 		if (this.className.indexOf("Stu") != -1)
// 			type = "学生特惠票";
// 		else type = "普通票";
// 		pos = this.className.indexOf(" ")+1;
// 		$(parent.document.getElementById('seat_info')).html(type + " " + this.parentElement.id + "排" + this.className.substring(pos) + "座");
// 	}
// })