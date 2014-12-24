//获取当前网络状态
var netWorkType;//当前网络状态
function onBridgeReady(){
 WeixinJSBridge.invoke('getNetworkType',{},
 		function(e){
 	    	netWorkType = e.err_msg;
            if (netWorkType == "network_type:wifi" && ticket.needseat == 1)
            {
                $(".seatButton").attr("href", "/choosearea?ticketid="+ticket.id);
            }
 	    });
}

if (typeof WeixinJSBridge == "undefined"){
    if( document.addEventListener ){
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    }else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
}else{
    onBridgeReady();
}


if (netWorkType == "network_type:wifi"){
	//当前网络状态为WIFI
	//跳转到相应的网页
}
/****网络情况有****/
/*network_type:wifi wifi网络
network_type:edge 非wifi,包含3G/2G
network_type:fail 网络断开连接
network_type:wwan（2g或者3g）*/
