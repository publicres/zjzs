(function( $ ){
	$.fn.qrcode = function(options) {
		// if options is string,
		if( typeof options === 'string' ){
			options	= { text: options };
		}

		// set default values
		// typeNumber < 1 for automatic calculation
		options	= $.extend( {}, {
			render		: "canvas",
			width		: 256,
			height		: 256,
			typeNumber	: -1,
			correctLevel	: QRErrorCorrectLevel.H,
                        background      : "#ffffff",
                        foreground      : "#000000"
		}, options);

		var createCanvas	= function(){
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();

			// create canvas element
			var canvas	= document.createElement('canvas');
			canvas.width	= options.width;
			canvas.height	= options.height;
			var ctx		= canvas.getContext('2d');

			// compute tileW/tileH based on options.width/options.height
			var tileW	= options.width  / qrcode.getModuleCount();
			var tileH	= options.height / qrcode.getModuleCount();

			// draw in the canvas
			var myGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
			//var randomColor = 'rgb('+Math.floor(Math.random()*150)+','+Math.floor(Math.random()*150)+','+Math.floor(Math.random()*150)+')';
			var r11=30+Math.floor(Math.random()*40), r21=r11+30, r31=r21+30, r01=r11-30;
			var r12=30+Math.floor(Math.random()*40), r22=r12+30, r32=r22+30, r02=r12-30;
			var r13=30+Math.floor(Math.random()*40), r23=r13+30, r33=r23+30, r03=r13-30;
			var color1 = 'rgb('+r11+','+r12+','+r13+')';
			var color2 = 'rgb('+r21+','+r22+','+r23+')';
			var color3 = 'rgb('+r31+','+r32+','+r33+')';
			var color0 = 'rgb('+r01+','+r02+','+r03+')';
			myGradient.addColorStop(0, color3);
			myGradient.addColorStop(0.249, color3);
			myGradient.addColorStop(0.251, color2);
			myGradient.addColorStop(0.499, color2);
			myGradient.addColorStop(0.501, color1);
			myGradient.addColorStop(0.749, color1);
			myGradient.addColorStop(0.751, color0);
			myGradient.addColorStop(1, color0);

		//	var darkcolor;
			for( var row = 0; row < qrcode.getModuleCount(); row++ ){
				for( var col = 0; col < qrcode.getModuleCount(); col++ ){
					ctx.fillStyle = qrcode.isDark(row, col) ? myGradient : options.background;
					var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
					var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
					ctx.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h);
				}
			}

			var image = new Image();
			image.onload = function() {
				ctx.drawImage(image, canvas.width*0.4, canvas.height*0.4, canvas.width*0.2,canvas.height*0.2);
			}
			image.src = "img/tuan.png";

			// return just built canvas
			return canvas;
		}

		// from Jon-Carlos Rivera (https://github.com/imbcmdth)
		var createTable	= function(){
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();

			// create table element
			var $table	= $('<table></table>')
				.css("width", options.width+"px")
				.css("height", options.height+"px")
				.css("border", "0px")
				.css("border-collapse", "collapse")
				.css('background-color', options.background);

			// compute tileS percentage
			var tileW	= options.width / qrcode.getModuleCount();
			var tileH	= options.height / qrcode.getModuleCount();

			// draw in the table
			for(var row = 0; row < qrcode.getModuleCount(); row++ ){
				var $row = $('<tr></tr>').css('height', tileH+"px").appendTo($table);

				for(var col = 0; col < qrcode.getModuleCount(); col++ ){
					$('<td></td>')
						.css('width', tileW+"px")
						.css('background-color', qrcode.isDark(row, col) ? options.foreground : options.background)
						.appendTo($row);
				}
			}
			// return just built canvas
			return $table;
		}


		return this.each(function(){
			var element	= options.render == "canvas" ? createCanvas() : createTable();
			$(element).appendTo(this);
		});
	};
})( jQuery );
