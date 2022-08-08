var explorer = navigator.userAgent;
if (explorer.indexOf('Chrome') < 0) {
  //不是chrome

  $('.tipChrome').show();
}

$(function () {
  //banner轮播图

  var dao = {
    //专家评论调用接口
    expertComment: function (param) {
      return dkr.util.ajaxPost('expert.json', param);
    },
    //民国人物调用接口
    minguoPeople: function (param) {
      return dkr.util.ajaxPost('minguoPeople.json', param);
    },
    //最新上架调用接口
    newArrival: function (param) {
      return dkr.util.ajaxPost('newArrival.json', param);
    },
    // 新闻通知
    wxkNoticePageQuery: function (param) {
      let url = GLOBAL.URL;
      return dkr.util.ajaxPost(url + 'wxkNotice/pageQuery', param);
    },
  };

  //	    dao.expertComment({
  //	    	data:''
  //	    }).done(function(res){
  //	    	console.log(res);
  ////	    	$('#commentTemp').tmpl(res.slice(0, 4)).appendTo('#commentContent');
  //	    });
  //	    dao.minguoPeople({
  //	    	data:''
  //	    }).done(function(res){
  ////	    	$('#commentTemp').tmpl(res.slice(0, 4)).appendTo('#mgMaster');
  //	    });

  //	    dao.newArrival({
  //	    	data:''
  //	    }).done(function(res){
  ////	    	$('#newArrivalTemp').tmpl(res).appendTo('#marquee1 > ul');
  ////	    	$("#marquee1").kxbdMarquee({direction:"right"});
  ////
  ////	    	$('#marquee1 ul li a,#marquee1 ul li p a').on('click',detailLook);
  //
  //	    });

  // 首页展示数量
  const san = 3;
  // 查询新闻通知
  const wxkNoticePageQuery = function (obj) {
    let params = {
      limit: san, // (integer, optional),
      page: 1, // (integer, optional),
      isPayLoadStringify: true,
    };
    if (obj) {
      params = { ...params, ...obj };
    }
    return dao.wxkNoticePageQuery(params);
  };
  // 调用新闻查询接口
  wxkNoticePageQuery().done(res => {
    if (res && res.success === true) {
      const list = res.data || [];
      let len = list.length;
      $('#noticeWrapper').html('');
      if (len) {
        const tmp = len > san ? list.slice(0, san) : list;
        tmp.forEach(t => {
          let month = (t.releaseTime && formatTime(t.releaseTime, 'MM')) || '--';
          let day = (t.releaseTime && formatTime(t.releaseTime, 'dd')) || '--';
          t.month = month;
          t.day = day;
        });
        // let tmpLen = tmp.length;
        // if (tmpLen < san) {
        //   let diff = san - tmpLen;
        //   for (let i = 1; i <= diff; i++) {
        //     tmp.push({});
        //   }
        //   let timer = setInterval(() => {
        //     if ($('#noticeWrapper').children().length) {
        //       $(`#noticeWrapper > div`).slice(-diff).css({ visibility: 'hidden' });
        //       clearInterval(timer);
        //     }
        //   }, 100);
        // }
        $('#newsNotice').tmpl(tmp).appendTo('#noticeWrapper');
        $('.word8').on('click', jumpToNews);
        $('#noticeWrapper').delegate('.noticeBox', 'click', function () {
          let item = $.tmplItem(this);
          jumpToNewsDetail('../newsNotice/detail.html', item.data);
        });
      } else {
        $('#noticeWrapper').text('暂无数据');
        $('#noticeWrapper').css({
          height: '200px',
          lineHeight: '200px',
          textAlign: 'center',
          fontSize: '17px',
          color: '#999999',
        });
        $('.word8').css({ display: 'none' });
      }
    }
  });
  // 查询新闻弹窗
  wxkNoticePageQuery({ filter: { isDialog: '1' } }).done(res => {
    if (res && res.success === true) {
      const list = res.data || [];
      let tmp = list.filter(t => t.dialogEndTime && isEndTimeLater(t.dialogEndTime));
      if (tmp && tmp.length) {
        openLayer(tmp[0]);
      }
    }
  });
  // 查验时间是否在此刻之后
  function isEndTimeLater(time) {
    const date = formatTime(time, 'yyyy-MM-dd hh:mm:ss');
    return new Date().getTime() < new Date(date).getTime();
  }
  // 打开layer层
  function openLayer(obj) {
    obj.rTime = (obj.releaseTime && formatTime(obj.releaseTime, 'yyyy-MM-dd')) || '--';
    let timer = setInterval(() => {
      if ($('#diagWrapper') && $('#diagWrapper').length) {
        $('#diagNews').tmpl(obj).appendTo('#diagWrapper');
        clearInterval(timer);
      }
    }, 100);
    layer.open({
      type: 1,
      skin: 'dialog-class',
      fix: true,
      maxmin: false,
      shadeClose: false,
      closeBtn: 1,
      shade: 0.8, //默认0.3  遮罩层不显示  也可以shade: [0.8, '#393D49']；
      area: ['1100px', '600px'],
      offset: '100px',
      title: [' ', 'background: #FFFCF1'],
      //   title: false,
      content: `
	<div class="diagWrapper" id="diagWrapper"></div>
	  `,
      //   content: $('#diagWrapper'),
      cancel: function () {
        //右上角关闭回调
        $('#diagWrapper').hide();
        //return false 开启该代码可禁止点击该按钮关闭
      },
    });
  }

  //点击按钮触发事件
  $('.search .seniorindexsearchbutton').on('click', seniorsearch);
  $('.search .classfiysearchbutton').on('click', classifysearch);

  //滚动滑动
  $('#marquee1').kxbdMarquee({ direction: 'right', loop: '0', isEqual: false });
  $('#marquee1 ul li p a').css({
    width: '102px',
    display: 'inline-block',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    'white-space': 'nowrap',
  });

  $('#marquee1 ul li a,#marquee1 ul li p a').on('click', function () {
    //	    	  console.log($(this)[0].attributes.value.value);
    //	    	  console.log($(this)[0].attributes.name.value);
    window.open(
      '../detail/index.html?DIR=' +
        encryData($(this)[0].attributes.value.value) +
        '&ZTTYPE=' +
        encryData($(this)[0].attributes.name.value) +
        '&LABEL=5'
    );
  });

  //下载
  $('.tipChrome .downChrome').on('click', function () {
    window.open('http://202.195.246.77/file/Chrome.zip');
  });
  //取消
  $('.tipChrome .cancelChrome').on('click', function () {
    $('.tipChrome').hide();
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

  // 搜索按钮事件
  $('.toSearch').on('click', function () {
    location.href = '../search/index.html?KEYWORDS=' + encodeURI($.trim($('#inputkeyword').val()));
  });
});
