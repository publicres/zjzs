/**
 * Created with PyCharm.
 * User: Epsirom
 * Date: 13-11-30
 * Time: 上午11:43
 */
/*
var datetimepicker_option = {
    format: "yyyy年mm月dd日 - hh:ii",
    autoclose: true,
    pickerPosition: "bottom-left",
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    language: 'zh-CN'
};

$(".form_datetime").datetimepicker(datetimepicker_option);

function enableDatetimePicker(dom) {
    dom.datetimepicker(datetimepicker_option);
    dom.children('.input-group-addon').css('cursor', 'pointer').children().css('cursor', 'pointer');
}

function disableDatetimePicker(dom) {
    dom.datetimepicker('remove');
    dom.children('.input-group-addon').css('cursor', 'no-drop').children().css('cursor', 'no-drop');
}
*/


var dateInterfaceMap = {
    'year': 'getFullYear',
    'month': 'getMonth',
    'day': 'getDate',
    'hour': 'getHours',
    'minute': 'getMinutes'
}, actionMap = {
    'value': function(dom, value) {
        dom.val(value);
    },
    'text': function(dom, value) {
        dom.text(value);
    },
    'time': function(dom, value) {
        if (value instanceof Object) {
            var parts = dom.children(), i, len, part;
            for (i = 0, len = parts.length; i < len; ++i) {
                part = $(parts[i]).children();
                if (part.attr('date-part')) {
                    part.val(value[part.attr('date-part')]);
                }
            }
        }
    },
    'arrange_area': function(dom, value) {
        if (value instanceof Object) {
            var parts = dom.children(), i, len, part;
            for (i = 0, len = parts.length; i < len; i++) {
                part = $(parts[i]).children();
                if (part.attr('area-part')) {
                    part.val(value[part.attr('area-part')]);
                }
            }
        }
    },
    'button': function(dom, value) {
        ;
    },
    'arrange_seat': function(dom, value) {
        RenderMap();
    }
}, keyMap = {
    'name': 'value',
    'key': 'value',
    'description': 'value',
    'start_time': 'time',
    'end_time': 'time',
    'place': 'value',
    'book_start': 'time',
    'book_end': 'time',
    'pic_url': 'value',
    'total_tickets': 'value',
    'need_seat': 'value',
    'area_arrange': 'arrange_area',
    'uploadPic': 'button',
    'seat_arrange': 'arrange_seat',
    'price': 'value'
}, lockMap = {
    'value': function(dom, lock) {
        dom.prop('disabled', lock);
    },
    'text': function(dom, lock) {
        dom.prop('disabled', lock);
    },
    'time': function(dom, lock) {
        var parts = dom.children(), i, len, part;
        for (i = 0, len = parts.length; i < len; ++i) {
            part = $(parts[i]).children();
            if (part.attr('date-part')) {
                part.prop('disabled', lock);
            }
        }
        dom.prop('disabled', lock);
    },
    'arrange_area': function(dom, lock) {
        var parts = dom.children(), i, len, part;
        for (i = 0, len = parts.length; i < len; i++) {
            part = $(parts[i]).children();
            if (part.attr('area-part')) {
                part.prop('disabled', lock);
            }
        }
        dom.prop('disabled', lock);
    },
    'button': function(dom, lock) {
        dom.prop('disabled', lock);
    },
    'arrange_seat': function(dom, lock) {
        if (lock == true) {
            var table = document.getElementById("tb_Seat");
            var i, j;
            if (table != null) {
                for (i = 0; i < table.rows.length; i ++) {
                    for (j = 0; j < table.rows[i].cells.length; j ++) {
                        table.rows[i].cells[j].onclick = null;
                    }
                }
            }
        }

        //dom.prop('disabled', lock);

        // var table = $('#tb_Seat');
        // var parts = table.children(), i, len, part;
        // for (i = 0, len = parts.length; i < len; i++) {
        //     part = $(parts[i]).children();
        //     part.prop('disabled', lock);
        // }
        // dom.prop('disabled', lock);
    }
};

var curstatus = 0;

function updateActivity(nact) {
    var key, key2, tdate;
    for (key in nact) {
        if (keyMap[key] == 'time') {
            activity[key] = {};
            tdate = new Date(nact[key])
            for (key2 in dateInterfaceMap) {
                activity[key][key2] = tdate[dateInterfaceMap[key2]]() + ((key2 == 'month') ? 1 : 0);
            }
        } else {
            activity[key] = nact[key];
        }
    }
}

function initializeForm(activity) {
    var key;
    if (!(activity.id && activity.need_seat == 2)) {
        activity.seat_map = default_seat_map;
    }
    for (key in keyMap) {
        actionMap[keyMap[key]]($('#input-' + key), activity[key]);
    }
    if (activity.id){
        document.getElementById("input-need_seat").selectedIndex = activity.need_seat;
        if (activity.need_seat == 1) {
            $('#div-area_arrange').show();
            $('#div-total_tickets').hide();
            $('#div-seat_arrange').hide();
            $('#div-price').hide();
        }
        else if (activity.need_seat == 0) {
            $('#div-area_arrange').hide();
            $('#div-total_tickets').show();
            $('#div-seat_arrange').hide();
            $('#div-price').hide();
        }
        else if (activity.need_seat == 2) {
            $('#div-area_arrange').hide();
            $('#div-total_tickets').hide();
            $('#div-seat_arrange').show();
            $('#div-price').show();
            tb_Seat = $("#input-seat_arrange").width();
            seat = $("[class^=seat]");
            seat.width(tb_Seat/41);
            seat.height(seat.width());
            seat_w = seat.width();
            seat_h = seat.height();
            
            $('td').height(seat_h);
        }
        else {
            $('#div-area_arrange').hide();
            $('#div-total_tickets').hide();
            $('#div-seat_arrange').hide();
            $('#div-price').hide();
        }
    }
    if (!activity.id) {
        $('#input-name').val('');
        //新增活动，自动生成年份
        var curyear = new Date().getFullYear();
        var curmonth = new Date().getMonth() + 1;
        $('#input-start-year').val(curyear);
        $('#input-end-year').val(curyear);
        $('#input-book-start-year').val(curyear);
        $('#input-book-end-year').val(curyear);
        $('#input-start-month').val(curmonth);
        $('#input-end-month').val(curmonth);
        $('#input-book-start-month').val(curmonth);
        $('#input-book-end-month').val(curmonth);
        $('#input-start-minute').val(0);
        $('#input-end-minute').val(0);
        $('#input-book-start-minute').val(0);
        $('#input-book-end-minute').val(0);
        $('#input-seat_status').val(0);
    }
    if (typeof activity.checked_tickets !== 'undefined') {
        initialProgress(activity.checked_tickets, activity.ordered_tickets, activity.total_tickets);
    }
    curstatus = activity.status;
    lockByStatus(curstatus, activity.book_start, activity.start_time, activity.end_time);
}

function check_percent(p) {
    if (p > 100.0) {
        return 100.0;
    } else {
        return p;
    }
}

function checktime(){
    var actstart = new Date($('#input-start-year').val(), $('#input-start-month').val()-1, $('#input-start-day').val(), $('#input-start-hour').val(), $('#input-start-minute').val());
    var actend = new Date($('#input-end-year').val(), $('#input-end-month').val()-1, $('#input-end-day').val(), $('#input-end-hour').val(), $('#input-end-minute').val());
    var bookstart = new Date($('#input-book-start-year').val(), $('#input-book-start-month').val()-1, $('#input-book-start-day').val(), $('#input-book-start-hour').val(), $('#input-book-start-minute').val());
    var bookend = new Date($('#input-book-end-year').val(), $('#input-book-end-month').val()-1, $('#input-book-end-day').val(), $('#input-book-end-hour').val(), $('#input-book-end-minute').val());
    var now = new Date();
    var bookend1 = new Date($('#input-book-end-year').val(), $('#input-book-end-month').val()-1, $('#input-book-end-day').val());
    var actstart1 = new Date($('#input-start-year').val(), $('#input-start-month').val()-1, $('#input-start-day').val());
    var be = bookend1.getTime()/(1000*60*60);
    var as = actstart1.getTime()/(1000*60*60);
    if(curstatus == 0){
        if(bookstart < now){
            $('#input-book-start-year').popover({
                    html: true,
                    placement: 'top',
                    title:'',
                    content: '<span style="color:red;">“订票开始时间”应晚于“当前时间”</span>',
                    trigger: 'focus',
                    container: 'body'
            });
            $('#input-book-start-year').focus();
            return false;
        }

        if(bookend < bookstart){
            $('#input-book-end-year').popover({
                html: true,
                placement: 'top',
                title:'',
                content: '<span style="color:red;">“订票结束时间”应晚于“订票开始时间”</span>',
                trigger: 'focus',
                container: 'body'
            });
            $('#input-book-end-year').focus();
            return false;
        }
    }
    if (as - be < 24) {
        $('#input-start-year').popover({
                html: true,
                placement: 'top',
                title:'',
                content: '<span style="color:red;">“活动开始时间”应晚于“订票结束时间至少一天”</span>',
                trigger: 'focus',
                container: 'body'
        });
         $('#input-start-year').focus();
        return false;
    }
    if(actstart < bookend){
        $('#input-start-year').popover({
                html: true,
                placement: 'top',
                title:'',
                content: '<span style="color:red;">“活动开始时间”应晚于“订票结束时间”</span>',
                trigger: 'focus',
                container: 'body'
        });
         $('#input-start-year').focus();
        return false;
    }
    if(actend < actstart){
        $('#input-end-year').popover({
            html: true,
            placement: 'top',
            title:'',
            content: '<span style="color:red;">“活动结束时间”应晚于“活动开始时间”</span>',
            trigger: 'focus',
            container: 'body'
        });
         $('#input-end-year').focus();
        return false;
    }
    return true;
}

function initialProgress(checked, ordered, total) {
    $('#tickets-checked').css('width', check_percent(100.0 * checked / total) + '%')
        .tooltip('destroy').tooltip({'title': '已检入：' + checked + '/' + ordered + '=' + (100.0 * checked / ordered).toFixed(2) + '%'});
    $('#tickets-ordered').css('width', check_percent(100.0 * (ordered - checked) / total) + '%')
        .tooltip('destroy').tooltip({'title': '订票总数：' + ordered + '/' + total + '=' + (100.0 * ordered / total).toFixed(2) + '%' + '，其中未检票：' + (ordered - checked) + '/' + ordered + '=' + (100.0 * (ordered - checked) / ordered).toFixed(2) + '%'});
    $('#tickets-remain').css('width', check_percent(100.0 * (total - ordered) / total) + '%')
        .tooltip('destroy').tooltip({'title': '余票：' + (total - ordered) + '/' + total + '=' + (100.0 * (total - ordered) / total).toFixed(2) + '%'});
}

function changeView(id) {
    var opt = ['noscript', 'form', 'processing', 'result'], len = opt.length, i;
    for (i = 0; i < len; ++i) {
        $('#detail-' + opt[i]).hide();
    }
    $('#detail-' + id).show();
}

function showForm() {
    changeView('form');
}

function showProcessing() {
    changeView('processing');
}

function showResult() {
    changeView('result');
}

function setResult(str) {
    $('#resultHolder').text(str);
}

function appendResult(str) {
    var dom = $('#resultHolder');
    dom.text(dom.text() + str + '\r\n');
}

function lockForm() {
    var key;
    for (key in keyMap) {
        lockMap[keyMap[key]]($('#input-' + key), true);
    }
    $('#publishBtn').hide();
    $('#saveBtn').hide();
    $('#resetBtn').hide();
}

function lockByStatus(status, book_start, start_time, end_time) {
    // true means lock, that is true means disabled
    var statusLockMap = {
        // saved but not published
        '0': {
        },
        // published but not determined
        '1': {
            'name': function() {
                return (new Date() >= getDateByObj(start_time));
            },
            'key': true,
            'place': function() {
                return (new Date() >= getDateByObj(start_time));
            },
            'book_start': function() {
                return (new Date() >= getDateByObj(book_start));
            },
            'book_end': function() {
                return (new Date() >= getDateByObj(start_time));
            },
            'total_tickets': function() {
                return (new Date() >= getDateByObj(book_start));
            },
            'area_arrange': function() {
                return (new Date() >= getDateByObj(book_start));
            },
            'start_time': function() {
                return (new Date() >= getDateByObj(start_time));
            },
            'end_time': function() {
                return (new Date() >= getDateByObj(start_time));
            },
            'need_seat': function() {
                return (new Date() >= getDateByObj(book_start));
            },
            'description': function() {
            	return (new Date() >= getDateByObj(start_time));
            },
            'pic_url': function() {
            	return (new Date() >= getDateByObj(start_time));
            },
            'uploadPic': function() {
                return (new Date() >= getDateByObj(start_time));
            },
            'seat_arrange': function() {
                return (new Date() >= getDateByObj(book_start));
            },
            'price': function() {
                return (new Date() >= getDateByObj(book_start));
            }
        },
        '99': {
            'name': true,
            'key': true,
            'place': true,
            'book_start': true,
            'book_end': true,
            'total_tickets': true,
            'area_arrange': true,
            'start_time': true,
            'end_time': true,
            'need_seat': true,
            'description': true,
            'pic_url': true,
            'uploadPic': true,
            'seat_arrange': true,
            'price': true
        }
    }, key;
    for (key in keyMap) {
        var flag = !!statusLockMap[status][key];
        if (typeof statusLockMap[status][key] == 'function') {
            flag = statusLockMap[status][key]();
        }
        lockMap[keyMap[key]]($('#input-' + key), flag);
    }
    showProgressByStatus(status, book_start);
    if (status >= 1) {
        $('#saveBtn').hide();
    } else {
        $('#saveBtn').show();
    }
    showPublishByStatus(status, start_time);
    showPubTipsByStatus(status);
}

function showProgressByStatus(status, book_start) {
    if ((status >= 1) && (new Date() >= getDateByObj(book_start))) {
        $('#progress-tickets').show();
    } else {
        $('#progress-tickets').hide();
    }
}

function showPublishByStatus(status, linetime) {
    if ((status >= 1) && (new Date() >= getDateByObj(linetime))) {
        $('#publishBtn').hide();
        $('#resetBtn').hide();
    } else {
        $('#resetBtn').show();
        $('#publishBtn').show();
    }
}

function showPubTipsByStatus(status){
    if(status < 1){
        $('#publishBtn').tooltip({'title': '发布后不能修改“活动名称”、“活动代称”'});
        $('#saveBtn').tooltip({'title': '暂存后可以“继续修改”'});
    }
}

function getDateString(tmpDate) {
    var d = new Date(tmpDate.year, tmpDate.month-1, tmpDate.day, tmpDate.hour, tmpDate.minute, 0);
    return d.getTime().toString();
}

function getDateByObj(obj) {
    return new Date(obj.year, obj.month - 1, obj.day, obj.hour, obj.minute);
}

function wrapDateString(dom, formData, name) {
    var parts = dom.children(), i, len, tmpDate = {}, part;
    for (i = 0, len = parts.length; i < len; ++i) {
        part = $(parts[i]).children();
        if (part.attr('date-part')) {
            if (part.val().length == 0) {
                return false;
            } else {
                tmpDate[part.attr('date-part')] = parseInt(part.val());
            }
        }
    }
    formData.push({
        name: name,
        required: false,
        type: 'string',
        value: getDateString(tmpDate)
    });
    return true;
}

function wrapAreaArrange(dom, formData) {
    var parts = dom.children();
    var i, len, part;
    var tmp = {};
    for (i = 0, len = parts.length; i < len; i++) {
        part = $(parts[i]).children();
        if (part.attr('area-part')) {
            if (part.val().length == 0) {
                return false;
            }
            else {
                tmp[part.attr('area-part')] = parseInt(part.val());
            }
        }
    }
    formData.push({
        name: 'A_area',
        required: false,
        type: 'number',
        value: tmp.a
    });
    formData.push({
        name: 'B_area',
        required: false,
        type: 'number',
        value: tmp.b
    });
    formData.push({
        name: 'C_area',
        required: false,
        type: 'number',
        value: tmp.c
    });
    formData.push({
        name: 'D_area',
        required: false,
        type: 'number',
        value: tmp.d
    });
    formData.push({
        name: 'E_area',
        required: false,
        type: 'number',
        value: tmp.e
    });
    //formData['total_tickets'] = tmp.a + tmp.b + tmp.c + tmp.d + tmp.e;
    for (i = 0; i < formData.length; i++) {
        if (formData[i].name == 'total_tickets') {
            formData[i].value = tmp.a + tmp.b + tmp.c + tmp.d + tmp.e;
        }
    }
    return true;
}

function beforeSubmit(formData, jqForm, options) {
    var i, len, nameMap = {
        'name': '活动名称',
        'key': '活动代码',
        'place': '活动地点',
        'description': '活动简介',
        'start_time': '活动开始时间',
        'end_time': '活动结束时间',
        'total_tickets': '活动总票数',
        'pic_url': '活动配图',
        'book_start': '订票开始时间',
        'book_end': '订票结束时间',
        'need_seat': '座位分配设置',
        'area_arrange': '分区座位分配',
        'price': '票价'
    }, lackArray = [], dateArray = [
        'start_time', 'end_time', 'book_start', 'book_end'
    ];
    var d=document.getElementById("input-need_seat").value;
    for (i = 0, len = formData.length; i < len; ++i) {
        if (!formData[i].value && formData[i].name != 'total_tickets' && formData[i].name != 'price') {
            lackArray.push(nameMap[formData[i].name]);
        }
        else if (!formData[i].value && formData[i].name == 'total_tickets') {
            if (d == 0) {
                lackArray.push(nameMap[formData[i].name]);
            }
        }
        else if (!formData[i].value && formData[i].name == 'price') {
            if (d == 2) {
                lackArray.push(nameMap[formData[i].name]);
            }
        }
    }
    for (i = 0, len = dateArray.length; i < len; ++i) {
        if (!$('#input-' + dateArray[i]).prop('disabled')) {
            if (!wrapDateString($('#input-' + dateArray[i]), formData, dateArray[i])) {
                lackArray.push(nameMap[dateArray[i]]);
            }
        }
    }
    //arange area
    if (d == 1) {
        if (! $('#input-area_arrange').prop('disabled')) {
            if (! wrapAreaArrange($('#input-area_arrange'), formData)) {
                lackArray.push(nameMap['area_arrange']);
            }
        }
    }
    //arrange seat
    if (d == 2) {
        if (! $('#input-need_seat').prop('disabled')) {
            formData.push({
                name: 'seat_map',
                required: false,
                value: JSON.stringify(activity.seat_map)
            });
            var x, y;
            var sum = 0;
            for (x = 0; x < line; x ++) {
                for (y = 0; y < column; y ++) {
                    if (activity.seat_map[x][y] == 2) {
                        sum ++;
                    }
                }
            }
            for (x = 0; x < formData.length; x++) {
                if (formData[x].name == 'total_tickets') {
                    formData[x].value = sum;
                }
                console.log(formData[x].name);
            }
        }
        
    }
    if (lackArray.length > 0) {
        var d = $('#resultHolder');
        if (d.hasClass("resultError")) {
            d.removeClass("resultError");
        }
        if (d.hasClass("resultSuccess")) {
            d.removeClass("resultSuccess");
        }
        d.addClass("resultError");
        setResult('以下字段是必须的，请补充完整后再提交：\r\n' + lackArray.join('、'));
        $('#continueBtn').click(function() {
            showForm();
        });
        showResult();
        return false;
    }
    if (activity.id) {
        formData.push({
            name: 'id',
            required: false,
            //type: 'number',
            value: activity.id
        });
    }
    return true;
}

function beforePublish(formData, jqForm, options) {
    if (beforeSubmit(formData, jqForm, options)) {
        showProcessing();
        formData.push({
            name: 'publish',
            required: false,
            type: 'number',
            value: '1'
        });
        return true;
    } else {
        return false;
    }
}

function submitResponse(data) {
    if (!data.error) {
        updateActivity(data.activity);
        initializeForm(activity);
        appendResult('成功');
    } else {
        appendResult('错误：' + data.error);
    }
    if (data.warning) {
        appendResult('警告：' + data.warning);
    }
    if (data.updateUrl) {
        $('#continueBtn').click(function() {
            window.location.href = data.updateUrl;
        });
    } else {
        $('#continueBtn').click(function() {
            showForm();
        });
    }

}

function submitError(xhr) {
    var d = $('#resultHolder');
    if (d.hasClass("resultError")) {
        d.removeClass("resultError");
    }
    if (d.hasClass("resultSuccess")) {
        d.removeClass("resultSuccess");
    }
    var str = xhr.responseText;
    if (!str) {
        str = "<null>";
        d.addClass("resultError");
    }
    else {
        var arr = str.split("#");
        if (arr[0] == "200") {
            d.addClass("resultSuccess");
            str = arr[1];
        }
        else {
            d.addClass("resultError");
            str = arr[1];
        }
    }
    //setResult(xhr.responseText || '<null>');
    setResult(str);
    $('#continueBtn').click(function() {
        showForm();
    });
}

function submitComplete(xhr) {
    showResult();
}


function publishActivity() {
    if(!$('#activity-form')[0].checkValidity || $('#activity-form')[0].checkValidity()){
        if(!checktime())
            return false;
        showProcessing();
        setResult('');
        var options = {
            dataType: 'json',
            beforeSubmit: beforePublish,
            success: submitResponse,
            error: submitError,
            complete: submitComplete
        };
        $('#activity-form').ajaxSubmit(options);
        return false;
    } else {
        $('#saveBtn').click();
    }
    return false;
}

initializeForm(activity);
showForm();

$('#activity-form').submit(function() {
    showProcessing();
    setResult('');
    var options = {
        dataType: 'json',
        beforeSubmit: beforeSubmit,
        success: submitResponse,
        error: submitError,
        complete: submitComplete
    };
    $(this).ajaxSubmit(options);
    return false;
}).on('reset', function() {
    initializeForm(activity);
    return false;
});

$('.form-control').on('focus', function() {var me = $(this); setTimeout(function(){me.select();}, 100)});


function inputNeedSeatChange(){
    var d=document.getElementById("input-need_seat").value;
    if (d == 1) {
        $('#div-area_arrange').show();
        $('#div-total_tickets').hide();
        $('#div-seat_arrange').hide();
        $('#div-price').hide();
    }
    else if (d == 0) {
        $('#div-area_arrange').hide();
        $('#div-total_tickets').show();
        $('#div-seat_arrange').hide();
        $('#div-price').hide();
    }
    else if (d == 2) {
        $('#div-area_arrange').hide();
        $('#div-total_tickets').hide();
        $('#div-seat_arrange').show();
        $('#div-price').show();
        tb_Seat = $("#input-seat_arrange").width();
        seat = $("[class^=seat]");
        seat.width(tb_Seat/41);
        seat.height(seat.width());
        seat_w = seat.width();
        seat_h = seat.height();
        
        $('td').height(seat_h);
    }
    else {
        $('#div-area_arrange').hide();
        $('#div-total_tickets').hide();
        $('#div-seat_arrange').hide();
        $('#div-price').hide();
    }
}
