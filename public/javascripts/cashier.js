$(document).ready(function()
{
    $("#inputCon").keydown(function(e)
    {
        var keyp=e.keyCode || e.which;
        if (keyp==13)
        {
            forbidEnter();
            processContent();
        }
    });
    downHorizon=$("#inputCon")[0].bottom;
    toggleStuINFO(false);
    hideUploader();
});

function forbidEnter()
{
    $("#inputCon").attr("disabled","true");
}
function allowEnter()
{
    $("#inputCon").removeAttr("disabled");
}

function processContent()
{
    var con=$("#inputCon")[0].value;
    $("#inputCon")[0].value="";
    if (con.length==10)
    {
        toggleStuINFO(false);
        getTickets(con);
    }
    else if (con.length==32)
    {
        toggleStuINFO(false);
        getExactTicket(con);
        allowEnter();
    }
    else
    {
        alert("无效的输入，请扫描二维码得到32位票号或手动输入10位学号。");
        allowEnter();
    }
}

function getTickets(stuid)
{
    $("#tbody-tickets")[0].innerHTML="";
    $.get(window.location.href+"/listticket?stuid="+stuid,function(res)
    {
        var list;
        try
        {
            list=JSON.parse(res);
        }
        catch(e)
        {
            alert("登陆已失效，请重新登陆。");
            window.location.href="/login";
        }
        $("tbody-tickets").html("");
        $("#stuid").html(stuid+" 拥有的票")
        if (list.length==0)
        {
            $("#tbody-tickets")[0].innerHTML="<span style='color:#AAAAAA'>该学号并没有可维护支付信息的票</span>"
        }
        for (var i=0;i<list.length;i++)
        {
            $("#tbody-tickets")[0].innerHTML+="<tr class='ev_clickable' id='"+list[i].ticketid+"''>"
                                                    +"<td class='td-status'><span class='eq'>"
                                                        +list[i].ticketid
                                                    +"</span></td>"
                                                    +"<td class='td-name'>"
                                                        +list[i].actname
                                                    +"</td>"
                                                +"</tr>";
        }
        $(".ev_clickable").click(function(e)
        {
            getExactTicket(this.id);
        });
        toggleStuINFO(true);
        allowEnter();
    }).fail(function()
    {
        alert("数据获取失败，请检查网络连接。");
        allowEnter();
    });
}
function toggleStuINFO(status)
{
    if (status==true)
    {
        $("#stuInfo").css("opacity","1");
    }
    else
    {
        $("#stuInfo").css("opacity","0");
        $("#tbody-tickets")[0].innerHTML="";
    }
}

function getExactTicket(ticketid)
{
    $.get(window.location.href+"/getticket?tid="+ticketid,function(res)
    {
        var tinfo;
        try
        {
            tinfo=JSON.parse(res);
        }
        catch(e)
        {
            alert("登陆已失效，请重新登陆。");
            window.location.href="/login";
        }
        if (tinfo.err!=null)
        {
            alert(tinfo.err);
            return;
        }
        $("#_tikid").text(tinfo.id);
        $("#_act").text(tinfo.act_name);
        $("#_stuid").text(tinfo.stu_id);
        $("#_price").text("￥"+tinfo.price);
        $("#resetBtn").click(hideUploader);
        if (tinfo.status==1)
        {
            $("#_stat").text("未付款");
            $("#buyB").text("付款");
            $("#buyB").removeClass("btn-danger")
                      .addClass("btn-primary")
                      .unbind("click");
            $("#buyB").click(function(){buyTickets(tinfo.id,tinfo.price,hideUploader)});
        }
        else
        {
            $("#_stat").text("已付款");
            $("#buyB").text("退款");
            $("#buyB").removeClass("btn-primary")
                      .addClass("btn-danger")
                      .unbind("click")
                      .click(function(){refundTickets(tinfo.id,tinfo.price,hideUploader)})
        }
        showUploader();
    }).fail(function()
    {
        alert("数据获取失败，请检查网络连接。");
    });
}

function hideUploader()
{
    $("#globalCover").css("visibility","hidden");
    $("#alphaCover").css("opacity","0");
    $("#windowCover").css("top","-100px");
    $("#windowCover").css("opacity","0");
}

function showUploader()
{
    $("#globalCover").css("visibility","visible");
    $("#alphaCover").css("opacity","0.3");
    $("#windowCover").css("top","10%");
    $("#windowCover").css("opacity","1");
    $("#errCosntent").text("");
}

function buyTickets(tikid,val,callback)
{
    var res=confirm("票号:"+tikid+"\n该电子票的支付状态将改为：已支付。\n请确认收齐票价"+val+"元后单击“确认”按钮。");
    if (res!=true)
    {
        return;
    }
    $(".controlMode1").css("display","none");
    $("#waitingTag").css("display","inline");
    $.get(window.location.href+"/buy?tid="+tikid,function(res)
    {
        if (res=="success")
        {
            $(".controlMode1").css("display","inline");
            $("#waitingTag").css("display","none");
            alert("支付成功！");
            callback();
        }
        else
        {
            $(".controlMode1").css("display","inline");
            $("#waitingTag").css("display","none");
            alert("支付失败，错误信息:"+res);
        }
    }).fail(function()
    {
        alert("数据获取失败，请检查网络连接。");
        $(".controlMode1").css("display","inline");
        $("#waitingTag").css("display","none");
    });
}
function refundTickets(tikid,val,callback)
{
    var res=confirm("票号:"+tikid+"\n该电子票的支付状态将改为：未支付。\n请确认退还票价"+val+"元后单击“确认”按钮。");
    if (res!=true)
    {
        return;
    }
    $(".controlMode1").css("display","none");
    $("#waitingTag").css("display","inline");
    $.get(window.location.href+"/refund?tid="+tikid,function(res)
    {
        if (res=="success")
        {
            $(".controlMode1").css("display","inline");
            $("#waitingTag").css("display","none");
            alert("退款成功！");
            callback();
        }
        else
        {
            $(".controlMode1").css("display","inline");
            $("#waitingTag").css("display","none");
            alert("退款失败，错误信息:"+res);
        }
    }).fail(function()
    {
        alert("数据获取失败，请检查网络连接。");
        $(".controlMode1").css("display","inline");
        $("#waitingTag").css("display","none");
    });
}
