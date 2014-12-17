$(document).ready(function() {
    var t = $('#A');
    var parts = t.children();
    //parts[4].className = "seat_Normal";
    //parts[4].className = "seat_Stu";
    //parts[4].className = "seat_Cannot";
    //parts[4].className = "seat_Null";
    parts[4].innerHTML = '<span class = "seat_Selected" style="width:' + seat_w + 'px; height:' + seat_h + 'px;"><span>';
});


tb_Seat = $("#floor1").width();
seat = $("[class^=seat]");
seat.width(tb_Seat/41);
seat.height(seat.width());
seat_w = seat.width();
seat_h = seat.height();

$('td').height(seat_h);

$('#tb_Container').height(0.4*$('#tb_Container').width());

tb_Container = $('#tb_Container').width();
sign = $("[class^=sign]");
sign.width(tb_Container/20);
sign.height(0.8*tb_Container/20);

var seatTap = function(evt) {
	// $("[class^=seat]").click(function(){
	if (this.className.indexOf("seat_Null") != -1 || this.className.indexOf("seat_Cannot") != -1)
		return;
	if (this.childElementCount == 0){
		$("[class^=seat] span").remove();
		$("#seat_info").html("暂未选座");

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
	// })
}
