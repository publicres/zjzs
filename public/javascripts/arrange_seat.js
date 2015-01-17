var column = 40;
var line = 8;
var default_seat_map = [[0, 0, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
                        [0, 0, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 0, 0],
                        [0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1]];

function InitSeatRender() {

    var i = 0, j = 0;

    var table = document.getElementById("tb_Seat");
    if (table != null) {
        for (i = 0; i < table.rows.length; i ++) {
            for (j = 0; j < table.rows[i].cells.length; j ++) {
                table.rows[i].cells[j].onclick = function () {
                    HandleClick(this);
                };
            }
        }
    }
}
InitSeatRender();

function GetNeighbourChar(str, offset) {
	var asc = str.charCodeAt(0);
	asc = asc + offset;
	return String.fromCharCode(asc);
}

function HandleClick(table_cell) {
    if (activity.seat_map) {
        var class_name = table_cell.className;
        var section = class_name.split(" ");
        var l = parseInt(section[1]);
        var c = parseInt(section[2]);
        if (activity.seat_map[l][c] == 1) {
            activity.seat_map[l][c] = 2;
        }
        else if (activity.seat_map[l][c] == 2) {
            activity.seat_map[l][c] = 1;
        }
        RenderMap();
    }
}

function RenderMap() {
    

    if (activity.seat_map) {
        var i = 0;
        var j = 0;
        for (i = 0; i < line; i ++) {
            var tmp_id = GetNeighbourChar('A', i);
            var tmp_dom = $('#' + tmp_id);
            var tmp_parts = tmp_dom.children();
            for (j = 0; j < column; j ++) {
                if (activity.seat_map[i][j] == 1) {
                    tmp_parts[j].className = "seat_Cannot " + i + " " + j;
                }
                else if (activity.seat_map[i][j] == 2) {
                    tmp_parts[j].className = "seat_Normal " + i + " " + j;
                }
                else {
                    tmp_parts[j].className = "seat_Null " + i + " " + j;
                }
            }
        }
    }
	
}

$(document).ready(function() {
    //var t = $('#A');
    //var parts = t.children();
    //console.log(parts[4].className);
    //parts[4].className = "seat_Normal";
    //parts[4].className = "seat_Stu";
    //parts[4].className = "seat_Cannot";
    //parts[4].className = "seat_Null";
    //parts[4].innerHTML = '<span class = "seat_Selected" style="width:' + seat_w + 'px; height:' + seat_h + 'px;"><span>';

    //RenderMap();

    
    tb_Seat = $("#input-seat_arrange").width();
    seat = $("[class^=seat]");
    seat.width(tb_Seat/41);
    seat.height(seat.width());
    seat_w = seat.width();
    seat_h = seat.height();
    $('td').height(seat_h);
});


tb_Seat = $("#input-seat_arrange").width();
seat = $("[class^=seat]");
seat.width(tb_Seat/41);
seat.height(seat.width());
seat_w = seat.width();
seat_h = seat.height();

$('td').height(seat_h);

