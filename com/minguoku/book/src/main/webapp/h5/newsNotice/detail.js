let news = {}
$(function () {
  // 去首页
  $('.toStart').on('click', function () {
    location.href = '../index/index.html';
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
//   console.log(JSON.parse(decodeURI(GLOBAL.GETQUERYSTRING('news'))));
  news = JSON.parse(localStorage.getItem('newsNotice'));
  news.rTime = (news.releaseTime && formatTime(news.releaseTime, 'yyyy-MM-dd')) || '--';
  $('#newsDetail').tmpl(news).appendTo('.detailContent');
});

window.onscroll = function () {
  if (document.body.scrollTop >= 100) {
    $('.backtop').fadeIn(1000);
  } else {
    $('.backtop').fadeOut(1000);
  }
};
