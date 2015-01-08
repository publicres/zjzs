
//CSS格式调整
a = $('#front');
a.height(0.25*a.width());

//修改小图图示样式
a = $("#sign");
topPos = 1.4*$('#front').height();
a.css("top", topPos);
a.css("font-size", 0.03*document.body.clientWidth);
a.css("left", 0.63*document.body.clientWidth-0.5*a.width());
a = $(".signIcon");
a.width(0.05*document.body.clientWidth);
a.height(0.05*document.body.clientWidth);

//修改分区图示样式--整体、A、B、C、D、E、校友就座区
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

//修改提交按钮样式
a = $('#buttom');
b = $('#buttom_frame');
c = $('#buttom_frame a');
left = a.width()/2 - b.width()/2;
topTemp = 1.2*(a.height()/2 - b.height()/2);
b.css("left", left);
b.css("top", topTemp);
topTemp = (b.height()/2 - c.height()/2);
c.css("top", topTemp);
$("[id^=block] a").css("font-size", 0.04*document.body.clientWidth);

//修改文字信息样式
$("#info_Area").css("font-size", 0.03*document.body.clientWidth);
//CSS格式调整结束