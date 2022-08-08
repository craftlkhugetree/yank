const dao = {
  // 新闻通知
  wxkNoticePageQuery: function (param) {
    let url = GLOBAL.URL;
    if (location.protocol === 'file:') {
      url = 'http://172.20.1.251:8080/book/rest';
    }
    return dkr.util.ajaxPost(url + '/wxkNotice/pageQuery', param);
  },
};
// 首页展示数量
var totalSize = 0;
var pageIndex = 1; //初始页索引
const pageSize = 3; //每页数据条数
// 查询新闻通知
const wxkNoticePageQuery = function (obj) {
  let params = {
    limit: pageSize, // (integer, optional),
    page: pageIndex, // (integer, optional),
    isPayLoadStringify: true,
  };
  if (obj) {
    params = { ...params, ...obj };
  }
  return dao.wxkNoticePageQuery(params);
};
function PageCallback(index) {
  console.log('index:' + index.getCurrent());
  pageComm(PageCallback, index.getCurrent());
  $('.nnList').empty();
  InitTable(index.getCurrent());
}
//查询关键字分页
function InitTable(pageInd) {
  layer.load(1, {
    shade: [0.01, '#fff'], //0.1透明度的白色背景
    offset: ['400px', ''],
  });
  wxkNoticePageQuery({ page: pageInd }).done(function (res) {
    layer.closeAll();
    if (res && res.success === true) {
      // $('#bookTemp').tmpl(res).appendTo('.showbookcontent');
      totalSize = res.total;
      const list = res.data || [];
      let len = list.length;
      if (len) {
        const tmp = list;
        tmp.forEach(t => {
          let month = (t.releaseTime && formatTime(t.releaseTime, 'MM')) || '--';
          let day = (t.releaseTime && formatTime(t.releaseTime, 'dd')) || '--';
          t.month = month;
          t.day = day;
        });
        $('#newsTableList').tmpl(tmp).appendTo('.nnList');
        $('.nnList').delegate('.noticeBox', 'click', function () {
          let item = $.tmplItem(this);
          jumpToNewsDetail('./detail.html', item.data);
        });
      } else {
        $('.nnList').text('暂无数据');
        $('.nnList').css({
          height: '200px',
          lineHeight: '200px',
          textAlign: 'center',
          fontSize: '17px',
          color: '#999999',
        });
      }
    }
  });
}
$(function () {
  initloadPage();
  // 去首页
  $('.toStart').on('click', function () {
    location.href = '../index/index.html';
  });

  $('.labelname').on('click', function () {
    if ($(this).text() == '高级检索') {
      location.href = '../seniorSearch/index.html';
    } else if ($(this).text() == '首页') {
      location.href = '../index/index.html';
    } else if ($(this).text() == '检索') {
      location.href = '../search/index.html';
    } else if ($(this).text() == '分类检索') {
      location.href = '../classifyBrowse/index.html';
    }
  });

  $('.backtop').on('click', function () {
    $('body').animate({ scrollTop: 0 }, 'fast');
  });

  //屏蔽键盘事件
  document.onkeydown = function () {
    var e = window.event || arguments[0];
    //F12
    if (e.keyCode == 123) {
      return false;
      //Ctrl+Shift+I
    }
  };

  //屏蔽鼠标右键
  document.oncontextmenu = function () {
    return true;
  };
});

window.onscroll = function () {
  if (document.body.scrollTop >= 100) {
    $('.backtop').fadeIn(1000);
  } else {
    $('.backtop').fadeOut(1000);
  }
};

// 公共的分页
function pageComm(callback, current) {
  $('#div_pager,#div_pager2').pagination({
    callback: callback,
    totalData: totalSize,
    showData: pageSize,
    current: current,
    prevCls: 'prev',
    nextCls: 'next',
    activeCls: 'active',
    count: 3,
    coping: true,
    homePage: '首页',
    endPage: '末页',
    prevContent: '上页',
    nextContent: '下页',
    showGoInput: true,
    showGoButton: true,
    jump: true,
  });
}

//初始化加载页面
function initloadPage() {
  layer.load(1, {
    shade: [0.01, '#fff'], //0.1透明度的白色背景
    offset: ['400px', ''],
  });
  wxkNoticePageQuery().done(function (res) {
    layer.closeAll();
    totalSize = res.total;
    $('#bookTemp').tmpl(res).appendTo('.showbookcontent');
    //点击分页
    if (res.hasOwnProperty('total')) {
      console.log('开始分页');
      pageComm(PageCallback, 1);
    }
    InitTable(1);
  });
}

function uniqueArray(params) {
  //关键词去重
  var res = [];
  var json = {};
  for (var i = 0; i < params.length; i++) {
    if (!json[params[i]]) {
      res.push(params[i]);
      json[params[i]] = 1;
    }
  }
  return res;
}

//引用
$('body').on('click', '.quto-dow', function (ev) {
  $('#showPoint').css('display', 'block');
  $('#showPoint').css('left', ev.clientX - 20);
  $('#showPoint').css('top', $(this)[0].offsetTop + 430);
  var dir = $(this).data('dir');
  var zttype = $(this).data('ztype');
  qu.id = $(this).data('id');
  qu.url =
    window.location.protocol +
    '//' +
    window.location.hostname +
    '/book/h5/readPage/index.html?DIR=' +
    dir +
    '&ZTTYPE=' +
    zttype;
});
