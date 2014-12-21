window.onload = function(){
	if(isIE()){
		$("#isIE").css("display", "");
	}
}

function isIE(){
    var a1 = navigator.userAgent;
	var yesIE = a1.search(/Trident/i); 
	if(yesIE > 0){
		return true;
	}
	else{
		return false;
	}
}  

$("#helpTicket").click(function(){
	$("#helpTicketPart").css("display", "");
	$("#helpOtherPart").css("display", "none");

	$("#helpTicket").attr("class", "active");
	$("#helpOther").attr("class", "");
});

$("#helpOther").click(function(){
	$("#helpOtherPart").css("display", "");
	$("#helpTicketPart").css("display", "none");

	$("#helpOther").attr("class", "active");
	$("#helpTicket").attr("class", "");
});

setInterval(function(){
	$("#fingerLight").animate({opacity: '0',}, 1000, function(){
		$("#fingerLight").animate({opacity: '0.5',}, 1000);
	});
}, 2000);



var blurSize = 0;
a = $("#helpTicketPart, #helpOtherPart");
b = $("#thanksInfo");
var startBlur;
var cancelBlur;
$("#finger, #fingerLight").mousedown(function(){
	clearInterval(cancelBlur);
	startBlur = setInterval(function(){
		blurSize += 0.3;
		a.css("-webkit-filter", "blur("+blurSize+"px)");
		if (blurSize > 10)
			b.css("opacity", (blurSize-10)/25);
		if (blurSize >= 25){
			clearInterval(startBlur);
		}
	}, 10)
})

$("#finger, #fingerLight").mouseup(function(){
	clearInterval(startBlur);
	cancelBlur = setInterval(function(){
		blurSize -= 0.1;
		a.css("-webkit-filter", "blur("+blurSize+"px)");
		b.css("opacity", (blurSize-10)/25);
		if (blurSize <= 0){
			clearInterval(cancelBlur);
		}
	}, 10)
})
