var timer=new Date();
var rich_elem_name_in_db=
{
    title:          'title',
    description:    'description',
    url:            'url',
    picture:        'picture'
}
exports.rich_attr=rich_elem_name_in_db;

function getCurrentTime()
{
    return Math.floor(timer.getTime()/1000);
}

//(parsedxml)
function getGenericTemplate(oriMsg)
{
    var res=
        "<xml>"+
            "<ToUserName><![CDATA["+oriMsg.FromUserName[0]+"]]></ToUserName>"+
            "<FromUserName><![CDATA["+oriMsg.ToUserName[0]+"]]></FromUserName>"+
            "<CreateTime>"+getCurrentTime()+"</CreateTime>";
    return res;
}

//(parsedxml,string)
exports.getPlainTextTemplate=function(oriMsg, textContent)
{
    var res=getGenericTemplate(oriMsg);
    res+=
            "<MsgType><![CDATA[text]]></MsgType>"+
            "<Content><![CDATA["+textContent+"]]></Content>"+
        "</xml>";

    return res;
}

//(parsedxml,int,object[])
exports.getRichTextTemplate=function(oriMsg, itemArray)
{
    if (itemArray.length>10)
        itemArray.length=10;
    var res=getGenericTemplate(oriMsg);
    res+=
            "<MsgType><![CDATA[news]]></MsgType>"+
            "<ArticleCount>"+itemArray.length+"</ArticleCount>"+
            "<Articles>";
    for (var i=0;i<itemArray.length;i++)
    {
        res+=
                "<item>";
        if (itemArray[i][rich_elem_name_in_db.title] && itemArray[i][rich_elem_name_in_db.title]!="")
            res+=
                    "<Title><![CDATA["+itemArray[i][rich_elem_name_in_db.title]+"]]></Title>";
        if (itemArray[i][rich_elem_name_in_db.description] && itemArray[i][rich_elem_name_in_db.description]!="")
            res+=
                    "<Description><![CDATA["+itemArray[i][rich_elem_name_in_db.description]+"]]></Description>";
        if (itemArray[i][rich_elem_name_in_db.picture] && itemArray[i][rich_elem_name_in_db.picture]!="")
            res+=
                    "<PicUrl><![CDATA["+itemArray[i][rich_elem_name_in_db.picture]+"]]></PicUrl>";
        if (itemArray[i][rich_elem_name_in_db.url] && itemArray[i][rich_elem_name_in_db.url]!="")
            res+=
                    "<Url><![CDATA["+itemArray[i][rich_elem_name_in_db.url]+"]]></Url>";
        res+=
                "</item>";
    }
    res+=
            "</Articles>"+
        "</xml>";

    return res;
}

exports.getHyperLink=function(text,url)
{
    return "<a href=\""+url+"\">"+text+"</a>";
}
