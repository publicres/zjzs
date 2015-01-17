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




var blurSize = 0;
a = $("#helpTicketPart, #helpOtherPart");
b = $("#thanksInfo");
var startBlur;
var cancelBlur;
var blurFlag = 0;
$("#finger").click(function(){
	if (blurFlag == 0){
		a.animate({opacity: 0}, 500, null);
		setTimeout(function(){
			b.animate({opacity:1}, 1000, null);
			blurFlag = 1;
		},500);
		/*a.animate({opacity: 1}, 1000, null)*/
	}
	else{
		b.animate({opacity:0}, 500, null);
		setTimeout(function(){
			a.animate({opacity: 1}, 1000, null);
			blurFlag = 0;
		},500);
	}
})
/*
$("#finger").click(function(){
	clearInterval(cancelBlur);
	startBlur = setInterval(function(){
		blurSize += 0.3;
		a.css("-webkit-filter", "blur("+blurSize+"px)");
		if (blurSize > 10)
			b.css("opacity", (blurSize-10)/25);
		setTimeout(function(){
			clearInterval(startBlur);
			cancelBlur = setInterval(function(){
				blurSize -= 0.1;
				a.css("-webkit-filter", "blur("+blurSize+"px)");
				b.css("opacity", (blurSize-10)/25);
				if (blurSize <= 0){
					clearInterval(cancelBlur);
				}
			}, 1000)
		}, 1000)
/*		if (blurSize >= 25){
			clearInterval(startBlur);
			cancelBlur = setInterval(function(){
				blurSize -= 0.1;
				a.css("-webkit-filter", "blur("+blurSize+"px)");
				b.css("opacity", (blurSize-10)/25);
				if (blurSize <= 0){
					clearInterval(cancelBlur);
				}
			}, 10)
		}*/
/*	}, 10)
})*/

/*$("#finger").mouseup(function(){
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
*/