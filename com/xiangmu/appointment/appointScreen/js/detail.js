var title = '';
var resgroupid = '';
var isLocal =
  location.protocol === 'file:' ||
  location.host.indexOf('127.0.0.1') > -1 ||
  location.host.indexOf('localhost') > -1;
$(function () {
  //接口地址 最近签到人
  var listUrl = isLocal
    ? 'http://app.dev.angke.com.cn/appointment/rest/res/pageQuery'
    : window.location.protocol + '//' + window.location.host + '/appointment/rest/res/pageQuery';
  var IDSTGC = 'db5c5b4a6e5c4ac1a20ee479ae603a00';
  var resgroup = [];
  var big = {
    screenShow: function (data) {
      //获取大屏信息接口
      $.ajax({
        type: 'post',
        url: listUrl,
        data: JSON.stringify(data),
        headers: {
          IDSTGC,
          Accept: 'application/json, text/plain, */*',
        },
        contentType: 'application/json',
        crossDomain: true,
        beforeSend: function (xmlHttp) {
          xmlHttp.setRequestHeader('If-Modified-Since', '0');
          xmlHttp.setRequestHeader('Cache-Control', 'no-cache');
        },
        success: function (res) {
          if (res.success) {
            resgroup = res.data || [];
            var LeftText = doT.template($('#left_down_tpl').text());
            $('.left_down').html(LeftText(resgroup));
          } else {
            alert(res.message || res.msg);
          }
        },
      });
    },
  };

  var p = new URL(location.href).searchParams;
  resgroupid = p.get('resgroupid');
  title = p.get('name');
  $('.time').html(title);
  var params = {
    filter: {
      resgroupid: resgroupid,
    },
    page: 1,
    limit: 10000,
  };
  //初始执行一次
  big.screenShow(params);
});

function toDetail(val) {
  window.location.href = './appointScreen.html?' + 'resid=' + val.id + '&name=' + val.name;
  // : location.protocol +
  //   '//' +
  //   location.host +
  //   '/appointScreen.html?' +
  //   'resid=' +
  //   val.id +
  //   '&name=' +
  //   val.name;
}
