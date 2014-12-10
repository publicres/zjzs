$(document).ready(function()
{
    $('#fileUploader').submit(function() {
        var options = {
            dataType: 'json',
            success: successRes,
            error: errorRes
        };
        $(this).ajaxSubmit(options);
        return false;
    });
    hideUploader();
    $("#alphaCover").click(hideUploader);
    $("#input-uploadPic").click(showUploader);
});

function hideUploader()
{
    $("#globalCover").css("visibility","hidden");
    $("#alphaCover").css("opacity","0");
    $("#windowCover").css("top","-100px");
}

function showUploader()
{
    $("#globalCover").css("visibility","visible");
    $("#alphaCover").css("opacity","0.3");
    $("#windowCover").css("top","10%");
    $("#errCosntent").text("");
}

function errorRes(data)
{
    if (data && data.status==200)
    {
        successRes(data);
        return;
    }
    $("#windowCover").removeClass("shadowBlue").addClass("shadowRed");
    setTimeout(function()
    {
        $("#windowCover").removeClass("shadowRed").addClass("shadowBlue");
    },1000);
    if (data instanceof String)
    {
        $("#errCosntent").text(data);
    }
    else
    {
        $("#errCosntent").text("上传失败，请重试。");
    }
}

function successRes(data)
{
    if (data.responseText=="Nothing")
    {
        errorRes();
        return;
    }
    $("#input-pic_url")[0].value=data.responseText;
    hideUploader();
}
