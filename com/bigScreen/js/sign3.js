$(function () {
  //接口地址 最近签到人
  var listUrl =
    window.location.protocol + '//' + window.location.host + '/seat_v2/rest/order/signTop10';
  // var listUrl = 'https://seat.dev.angke.cn/seat_v2/rest/order/signTop10';

  var big = {
    screenShow: function (ROOMAREAID) {
      //获取大屏信息接口
      $.ajax({
        type: 'post',
        url: listUrl,
        beforeSend: function (xmlHttp) {
          xmlHttp.setRequestHeader('If-Modified-Since', '0');
          xmlHttp.setRequestHeader('Cache-Control', 'no-cache');
        },
        success: function (res) {
          if (res.success) {
            var datas = res.data;
            for (var i = 0; i < datas.length; i++) {
              datas[i].username = formatName(datas[i].username);
            }
            //左边签到中的显示
            var LeftText = doT.template($('#left_down_tpl').text());

            $('.left_down').html(LeftText(datas));
            //右边
            var RightText = doT.template($('#right_middle_tpl').text());
            $('.right_middle').html(RightText(res));
          } else {
            alert(res.message);
          }
        },
      });
    },
  };

  //页面每一秒钟刷新一次setInterval 显示北京时间
  setInterval(function () {
    //设置最外层的box跟body的一样宽高
    var bodyW = $('body').width();
    var bodyH = $('body').height();
    //	获取外层的box
    var box = $('.box')[0];
    $(box).width(bodyW);
    $(box).height(bodyH);
    //获取当前时间
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
    //  $('.time').text(today_h + ':' + today_m + ':' + today_s)
    var today_month = today.getMonth() + 1;
    if (today_month < 10) {
      today_month = '0' + today_month;
    }
    var today_day = today.getDate();
    if (today_day < 10) {
      today_day = '0' + today_day;
    }
    var today_xq = today.getDay();
    //设置星期几的数组
    var xqArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    $('.right_top>h3').text(today_h + ':' + today_m + ':' + today_s);
    $('.right_top>h1').text(today_month + '月' + today_day + '日' + xqArr[today_xq]);
  }, 500);

  //生成二维码
  function createQrcode() {
    $('#qrcode').html('');
    $('#qrcode_left').html('');
    //时间戳+参数
    var timestamp = new Date().getTime();
    var data = { timestamp: timestamp, signType: 'seatV2' };
    console.log('data', JSON.stringify(data));
    data = $.base64.encode(JSON.stringify(data));
    let url = `${window.location.protocol}//${window.location.host}/seat_v2/mobile/#/sign?signData=${data}`;
    // let url = `${window.location.protocol}//${window.location.host}/mseat/#/sign?signData=${data}`;
    console.log('url66', url);
    let content = {
      appid: null, // 这个学工统一提供
      clickType: 'URL', // 跳转类型，固定值为URL。
      clickContent: url, //跳转内容，我们的访问链接，见sign.html。
    };
    $('#qrcode').qrcode({
      width: 128,
      height: 128,
      //   text: url,
      text: JSON.stringify(content),
    });
    $('#qrcode_left').qrcode({
      width: 128,
      height: 128,
      // text: url,
      text: JSON.stringify(content),
    });
  }

  //格式化姓名 张***
  function formatName(name) {
    return name.charAt(0) + Array(name.length).join('*');
  }

  //3分钟 180000创建一次二维码
  setInterval(function () {
    createQrcode();
  }, 180000);

  //初始执行一次
  createQrcode();

  // 时间格式化
  let formatTime = function (time, format) {
    let timeLength = '' + time;
    let tf = function (d) {
      return d >= 10 ? d : '0' + d;
    };
    let dateObj;
    switch (timeLength.length) {
      case 14 || 17:
        dateObj = new Date(
          parseInt(timeLength.substring(0, 4)),
          parseInt(timeLength.substring(4, 6)) - 1,
          parseInt(timeLength.substring(6, 8)),
          parseInt(timeLength.substring(8, 10)),
          parseInt(timeLength.substring(10, 12)),
          parseInt(timeLength.substring(12, 14))
        );
        break;
      case 13:
        dateObj = new Date(time);
        break;
      case 8:
        dateObj = new Date(
          parseInt(timeLength.substring(0, 4)),
          parseInt(timeLength.substring(4, 6)) - 1,
          parseInt(timeLength.substring(6, 8))
        );
        break;
      default:
        throw 'Ow<这是一条来自common的提示：format参数输入错误';
    }
    let timeString = format
      .replace(/YYYY/gi, dateObj.getFullYear() + '')
      .replace(/MM/g, tf(dateObj.getMonth() + 1))
      .replace(/DD/gi, tf(dateObj.getDate()))
      .replace(/hh/gi, tf(dateObj.getHours()))
      .replace(/mm/g, tf(dateObj.getMinutes()))
      .replace(/ss/gi, tf(dateObj.getSeconds()));
    return timeString;
  };

  // 返回当前时间的年月日,根据格式，如果有符号，就返回符号的，没有就是YYYYMMDD
  var ymd = function (type) {
    var myDate = new Date();
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
    if (type) {
      return myDate.getFullYear() + type + month + type + strDate;
    } else {
      return '' + myDate.getFullYear() + month + strDate;
    }
  };

  // 座位示意图
  const options = ['', 'seat', 'pass', 'pillar', 'wall', 'door', 'window', 'interval-seat'];

  // 座位素材
  const seatOptions = [
    { type: 'wall', value: '4', text: '墙' },
    { type: 'window', value: '6', text: '窗' },
    { type: 'door', value: '5', text: '门' },
    { type: 'pillar', value: '3', text: '书架' },
    { type: 'pass', value: '2', text: '过道' },
  ];
  const seatOptions1 = [
    { type: 'seat', value: '1', text: '空闲座位' },
    { type: 'half', value: '8', text: '使用中' },
    { type: 'interval-seat', value: '7', text: '疫情座位' },
  ];

  let SECTIONID = '';
  let name = '';
  let IDSTGC = '';
  // 根据url获取参数
  function getParams() {
    let p = new URL(location.href).searchParams;
    SECTIONID = p.get('SECTIONID') || '9c45fae4350b47dfb285bab7df6ba221';
    IDSTGC = p.get('IDSTGC') || '9ca8e7eb52684269a732a5681281cadf';
    name = p.get('name');
    if (name) {
      document.getElementsByClassName('time')[0].innerHTML = name;
    }
  }
  getParams();

  // 封装ajax
  function post({ url, data, callback, isGet, notSetHeader, isForm }) {
    $.ajax({
      beforeSend: function (reqObj, settings) {
        // if (isSetHeader) {
        //   reqObj.setRequestHeader(
        //     'IDSTGC',
        //     getCookie('IDSTGC') || '6cdd5880593e49ebaafb5ffdd9da5035'
        //   );
        // }
      },
      headers: {
        IDSTGC: notSetHeader ? undefined : IDSTGC,
        Accept: 'application/json, text/plain, */*',
      },
      contentType: isForm ? 'application/x-www-form-urlencoded;charset=UTF-8' : 'application/json',
      type: isGet ? 'GET' : 'POST',
      crossDomain: true,
      data: isForm ? data : JSON.stringify(data),
      url,
      dataType: 'json',
      error: function (resObj, textStatus, errorThrown) {
        data.code = -1;
        callback(data, resObj.responseText);
      },
      success: function (data, textStatus, resObj) {
        callback(data, resObj.responseText);
      },
    });
  }

  const apiUrl = {
    seat: 'seat_v2/rest/',
  };
  // 开发环境
  const _uri_api = function (url) {
    const hostUrl = location.protocol + '//' + location.host + '/' + apiUrl.seat;
    // const hostUrl = 'http://app.dev.angke.com.cn/' + apiUrl.seat;
    return hostUrl + url;
  };
  const api = {
    // 根据id查询
    getSeats: function (data, func) {
      post({ url: _uri_api('section/querySectionSeats'), data, callback: func });
    },
    // 时间段
    getTimes: function (data, func) {
      post({ url: _uri_api('section/queryOpentime'), data, callback: func });
    },
  };

  // 为字符串插入字符 其中soure为原字符串,start为将要插入字符的位置，newStr为要插入的字符
  function insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start);
  }

  let times = [];
  let seatData = [];
  let seatList = [];
  let timeRange = [];
  // 获取当日时间段
  function fetchTimes(data, text) {
    if (data && data.success === true) {
      timeRange = data;
      times = data.data;
      let time = new Date().getTime();
      let now = formatTime(ymd(), 'yyyy-MM-dd');
      let range =
        times.find(t => {
          return (
            new Date(now + ' ' + insertStr(t.starttime, 2, ':')).getTime() <= time &&
            new Date(now + ' ' + insertStr(t.endtime, 2, ':')).getTime() >= time
          );
        }) || {};
      api.getSeats(
        {
          times: [
            {
              starttime: range.starttime,
              endtime: range.endtime,
            },
          ],
          ...genParams(),
        },
        getSectionDetail
      );
    }
  }
  // 获取座位状态
  function getSectionDetail(data, text) {
    if (data && data.success === true) {
      seatData = data.data;
      this.isselected = false;
      var newseats = [];
      seatData.forEach(m => {
        if (m.type == 1) {
          m.selected = false;
          if (this.seatname && m.name == this.seatname) {
            if (m.isopen == 0) {
              m.selected = false;
            } else {
              m.selected = true;
              this.isselected = true;
              this.selectseat = {
                name: this.seatname,
                id: this.seatid,
              };
            }
          }
        }

        if (typeof newseats[m.rowno - 1] == 'undefined') {
          newseats[m.rowno - 1] = [];
        }
        newseats[m.rowno - 1][m.colno - 1] = m;
      });
      seatList = newseats;

      let logo = document.getElementsByClassName('logo1')[0];
      let time = document.getElementsByClassName('time')[0];
      let left = document.getElementsByClassName('left-main')[0];
      // console.log(
      //   time.clientHeight,
      //   logo.clientHeight,
      //   logo.getBoundingClientRect(),
      //   window.innerHeight
      // );
      let main = document.getElementsByClassName('main')[0];
      let mainH = window.innerHeight - Math.max(logo.clientHeight, time.clientHeight) - 20;
      let tableH = mainH - 2;

      const table = document.getElementById('seatTable');
      //   let flag = tableH / 40 < seatList.length;
      let flag = 600 / 38 < seatList.length;
      if (flag) {
        main.style.height = mainH + 'px';
        left.style.height = tableH + 51 + 'px';
        table.style.height = tableH + 'px';
      }
      table.innerHTML = null;
      //   console.log(flag, tableH, seatList.length);

      seatList.forEach((items, sid) => {
        let tr = document.createElement('tr');
        items.forEach((seat, zid) => {
          let td = document.createElement('td');
          if (seat.selected) {
            td.classList.add('half');
          } else if (seat.nowstatus == 3 || seat.nowstatus == 2) {
            td.classList.add('half');
          } else if (seat.isopen == 0) {
            td.classList.add('epidemic');
          } else {
            td.classList.add(options[seat.type]);
          }
          if (flag) {
            td.style.height = tableH / seatList.length - 10 + 'px';
            td.style.width = tableH / seatList.length - 10 + 'px';
          }
          td.setAttribute('id', seat.seatId);
          let span = document.createElement('span');
          span.innerHTML = seat.name;
          let spanClass = seat.type == 1 ? 'seat-num' : 'no-num';
          span.classList.add(spanClass);
          td.appendChild(span);
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
      if (flag) {
        table.style['margin-top'] = '50px';
      } else {
        table.style.margin = 'auto 0';
      }
    }
  }

  // 产生接口参数
  function genParams() {
    return {
      enddate: formatTime(ymd(), 'yyyyMMdd'),
      sectionid: SECTIONID,
      startdate: formatTime(ymd(), 'yyyyMMdd'),
    };
  }

  // 左侧图示
  function genOptions() {
    let ul = document.getElementById('icons-list');
    seatOptions.forEach(s => {
      let li = document.createElement('li');
      li.classList.add('icon-items');
      let i = document.createElement('i');
      i.classList.add('img', s.type);
      let span = document.createElement('span');
      span.classList.add('icon-name');
      span.innerHTML = s.text;
      li.appendChild(i);
      li.appendChild(span);

      ul.appendChild(li);
    });

    let ul1 = document.getElementById('icons-list2');
    seatOptions1.forEach(s => {
      let li = document.createElement('li');
      li.classList.add('icon-items2');
      let i = document.createElement('i');
      i.classList.add('img', s.type);
      let span = document.createElement('span');
      span.classList.add('icon-name', 'icon-name-left');
      span.innerHTML = s.text;
      li.appendChild(i);
      li.appendChild(span);

      ul1.appendChild(li);
    });
  }
  genOptions();

  api.getTimes(
    {
      type: 2,
      ...genParams(),
    },
    fetchTimes
  );

  $(window).resize(function () {
    fetchTimes(timeRange);
  });
  setInterval(function () {
    // 调取接口
    // big.screenShow();
    fetchTimes(timeRange);
  }, 10000);
});
