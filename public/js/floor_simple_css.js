/*******CSS调整*******/
//舞台样式
a = $('#front');
a.height(0.2*a.width());
leftPos = 0.5 * (document.body.clientWidth - a.width());
a.css("left", leftPos);
b = $('#front div');
b.css("font-size", 0.05*document.body.clientWidth);
topPos = 0.4 * (a.height() - b.height());
b.css("margin-top", topPos);

//标识样式
a = $("#sign");
topPos = 1.75*$('#front').height();
a.css("top", topPos);
a.css("font-size", 0.03*document.body.clientWidth);
a.css("left", 0.63*document.body.clientWidth-0.5*a.width());
a = $(".signIcon");
a.width(0.05*document.body.clientWidth);
a.height(0.05*document.body.clientWidth);

//选区样式----整体、A、B、C、D、E、校友就座区
a = $('#Zongti');
a.height(a.width());

a = $('[id^=block]');
a.css("border-width", 0.01*document.body.clientWidth);

a = $('#block_A');
a.width(a.height()/0.83);
left = 0.485*a.parent().width() - 0.5*a.width();
a.css("left", left);

a = $('#area_A1');
left = 0.5*a.parent().width() - 0.5*a.width();
a.css("left", left);

a = $('#area_A4');
left = 0.5*a.parent().width() - 0.5*a.width();
a.css("left", left);
topTemp = 1.2*$('#area_A1').height();
a.css("top", topTemp);

a = $('#block_B');
a.width(0.23*a.height());

a = $('#block_C');
a.width(0.23*a.height());


a = $('#Friend_block');
a.css("font-size", 0.035*document.body.clientWidth);
a.width(4.45*a.height());
left = 0.5*a.parent().width() - 0.5*a.width();
topTemp = 1*$('#block_A').height()+0.7*a.height();
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
topTemp = $('#block_A').height() + 2.77 * $('#Friend_block').height() + $('#block_D').height();
a.css("left", left);
a.css("top", topTemp);

$("[id^=block] a").css("font-size", 0.04*document.body.clientWidth);

//按钮样式
a = $('#buttom');
b = $('#buttom_frame');
c = $('#buttom_frame a');
left = a.width()/2 - b.width()/2;
topTemp = 1.2*(a.height()/2 - b.height()/2);
b.css("left", left);
b.css("top", topTemp);
topTemp = (b.height()/2 - c.height()/2);
c.css("top", topTemp);



//文字区域样式
$("#info_Area").css("font-size", 0.03*document.body.clientWidth);

/****CSS格式调整结束*****/