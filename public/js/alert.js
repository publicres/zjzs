a = $("#alertFrame");
a.height(0.42*a.width());
$("#errorInfo").css("font-size", (15/255)*a.width())
var topPos = 0.5*($("#alertFrame").height()-$("#errorInfo").height());
$("#errorInfo").css("margin-top", topPos);


a = $('#buttom');
b = $('#buttom_frame');
c = $('#buttom_frame a');
left = a.width()/2 - b.width()/2;
topTemp = 1.2*(a.height()/2 - b.height()/2);
b.css("left", left);
b.css("top", topTemp);
topTemp = (b.height()/2 - c.height()/2);
c.css("top", topTemp);