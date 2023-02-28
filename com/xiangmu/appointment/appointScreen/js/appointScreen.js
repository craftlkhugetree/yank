var title = '';
var resid = '';
var sectionTime = null;
var resgroup = [];
var isLocal =
  location.protocol === 'file:' ||
  location.host.indexOf('127.0.0.1') > -1 ||
  location.host.indexOf('localhost') > -1;
$(function () {
  //接口地址 最近签到人
  var listUrl = isLocal
    ? 'http://app.dev.angke.com.cn/appointment/rest/res/noReservation'
    : window.location.protocol +
      '//' +
      window.location.host +
      '/appointment/rest/res/noReservation';
  var IDSTGC = 'db5c5b4a6e5c4ac1a20ee479ae603a00';
  var big = {
    screenShow: function (data) {
      //获取大屏信息接口
      $.ajax({
        type: 'post',
        url: listUrl,
        data: data,
        // data: JSON.stringify(data),
        headers: {
          IDSTGC,
          Accept: 'application/json, text/plain, */*',
        },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        // contentType: 'application/json',
        crossDomain: true,
        beforeSend: function (xmlHttp) {
          xmlHttp.setRequestHeader('If-Modified-Since', '0');
          xmlHttp.setRequestHeader('Cache-Control', 'no-cache');
        },
        success: function (res) {
          if (res.success) {
            resgroup = res.data || [];
            sort();
            resgroup.forEach(r => {
              r.starttime && (r.starttime = r.starttime.substr(0, 2) + ':' + r.starttime.substr(2));
              r.endtime && (r.endtime = r.endtime.substr(0, 2) + ':' + r.endtime.substr(2));
            });
            sectionTime = hasSection(resgroup);
            genTime();
            var LeftText = doT.template($('#left_down_tpl').text());
            $('.today-reftime').html(LeftText(resgroup));
          } else {
            alert(res.message || res.msg);
          }
        },
      });
    },
  };

  var p = new URL(location.href).searchParams;
  resid = p.get('resid');
  title = p.get('name');
  $('.detail-info > .resname').text(title);
  var params = {
    id: resid,
    usedates: ymd(),
    // filter: {
    //   applystatus: '1,2',
    //   resid: resid,
    //   endtime: ymd(),
    //   starttime: ymd(),
    // },
    // page: 1,
    // limit: 10000,
  };
  //初始执行一次
  big.screenShow(params);

  setInterval(function () {
    // params.filter.starttime = ymd();
    // params.filter.endtime = ymd();
    params.usedates = ymd();
    big.screenShow(params);
  }, 10000);
  
  var isFull = false
      window.onresize = () => {
        // console.log(this.isFull, document.fullscreenElement, document.fullscreen);
        if (!document.fullscreen) {
          isFull = true;
          document.getElementsByClassName('full')[0].hidden = false;
        } else {
          document.getElementsByClassName('full')[0].hidden = true
        }
      };
});

// 计算当前时间与会议时间段
function judgeCurTime(h, m) {
  if (sectionTime) {
    var t = h + '' + m;
    for (var i = 0; i < resgroup.length; i++) {
      var obj = resgroup[i];
      var start = (obj.starttime && obj.starttime.replace(':', '')) || 0;
      var end = (obj.endtime && obj.endtime.replace(':', '')) || 0;
      if (t >= start && t <= end) {
        obj.curNow = true;
      } else if (t > end) {
        obj.ltNow = true;
      }
    }
  }
  var res = resgroup.find(r => r.curNow);
  resgroup = resgroup.filter(r => !(r.curNow || r.ltNow));
  return res;
}

// 判断是否有数据
function hasSection(arr) {
  return arr && arr.some(a => a.starttime && a.endtime);
}

// 获取当前时间
function genTime() {
  var today = new Date();
  var today_h = today.getHours();
  if (today_h < 10) {
    today_h = '0' + today_h;
  }
  var today_m = today.getMinutes();
  if (today_m < 10) {
    today_m = '0' + today_m;
  }
  var today_s = today.getSeconds();
  if (today_s < 10) {
    today_s = '0' + today_s;
  }
  var today_month = today.getMonth() + 1;
  if (today_month < 10) {
    today_month = '0' + today_month;
  }
  var today_day = today.getDate();
  if (today_day < 10) {
    today_day = '0' + today_day;
  }
  var today_xq = today.getDay();
  var year = today.getFullYear();
  //设置星期几的数组
  var xqArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  $('.detail-date > .dtime').text(today_h + ':' + today_m);
  $('.detail-date #detailToday').text(year + '-' + today_month + '-' + today_day + '日 ');
  $('.detail-date #detailWeek').text(xqArr[today_xq]);

  sectionTime = judgeCurTime(today_h, today_m);
  if (sectionTime) {
    $('#btn-use').removeClass('hide');
    $('#curEmpty').addClass('hide');
    $('.detail-info #restime').text(
      '会议时间：' + sectionTime.starttime + ' - ' + sectionTime.endtime
    );
  } else {
    $('#btn-use').addClass('hide');
    $('#curEmpty').removeClass('hide');
    $('.detail-info #restime').text(' ');
  }
}

// 时间格式化
function ymd(transDate) {
  var myDate = transDate || new Date();
  var month = myDate.getMonth() + 1;
  if (month >= 1 && month <= 9) {
    //月
    month = '0' + month;
  }
  var strDate = myDate.getDate();
  if (strDate >= 0 && strDate <= 9) {
    //日
    strDate = '0' + strDate;
  }
  var hour = myDate.getHours(); // 时

  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour;
  }
  var minutes = myDate.getMinutes(); // 分
  if (minutes >= 0 && minutes <= 9) {
    minutes = '0' + minutes;
  }
  return '' + myDate.getFullYear() + month + strDate;
}

function sort() {
  for (var i = 0; i < resgroup.length; i++) {
    for (var j = i + 1; j < resgroup.length; j++) {
      var flag =
        resgroup[i].starttime > resgroup[j].starttime ||
        (resgroup[i].starttime == resgroup[j].starttime &&
          resgroup[i].endtime > resgroup[j].endtime);
      if (flag) {
        var tmp = { ...resgroup[i] };
        resgroup[i] = { ...resgroup[j] };
        resgroup[j] = tmp;
      }
    }
  }
}

// js控制全屏，必须是主动触发，比如按按钮
function requestFullScreen() {
    let element = window.document.documentElement;
    let requestMethod =
      element.requestFullScreen || //W3C
      element.webkitRequestFullScreen || //Chrome
      element.mozRequestFullScreen || //FireFox
      element.msRequestFullScreen; //IE11
    if (requestMethod) {
      // console.log(element, element.webkitRequestFullScreen);
      requestMethod.call(element, { navigationUI: 'hide' });
      // element.requestMethod({ navigationUI: 'hide' });
    } else if (typeof window.ActiveXObject !== 'undefined') {
      //for Internet Explorer
      let wscript = new ActiveXObject('WScript.Shell');
      if (wscript !== null) {
        wscript.SendKeys('{F11}');
      }
    }
};