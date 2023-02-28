<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <!-- <meta name="viewport" content="width=device-width,initial-scale=1.0"> -->
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
    <!-- <link rel="stylesheet" href="./src/pages/activity/css/activity.css"> -->
    <title id="title">签到</title>
    <style>
      .qd_content{
        width: 100%;
        height: 100%;
        background: #fff;
        position: fixed;
        top: 0;
        left: 0;
      }
      .qd_success,.qd_fail{
        width: 100px;
        height: 100px;
        margin: 70px auto 20px;
        display: none;
      }
      .qd_success{
        background: url(./static/img/signsucc.png) no-repeat center center;
        background-size: cover;
      }
      .qd_fail{
        background: url(./static/img/signfail.png) no-repeat center center;
        background-size: cover;
      }
      .qd_p{
        text-align: center;
      }
      .qd_backhome{
        width: 122px;
        height: 32px;
        border-radius: 16px;
        text-align: center;
        line-height: 32px;
        color: #000;
        margin: 70px auto 0;
        border: 1px solid #086CFF;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <!-- <div id="app"></div> -->
    <div class="content qd_content">
        <div class="qd_success"></div>
        <div class="qd_fail"></div>
        <p class="qd_p">签到成功</p>
        <div class="qd_backhome">返回首页</div>
    </div>
    <!-- built files will be auto injected -->
    <script src="./static/config.js"></script>
    <script src="./static/jquery.js"></script>
    <script>
      var id = getQueryString('activityId');
      var signurl = window.base.activityURL+'activityAppointment/toSign';
      function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) return unescape(r[2]);
        return null;
      }
      function qrsign(activityId){
        $.ajax({
            url: signurl+'?activityId='+id,
            type: "GET",
            success: function (res) {
              $('.qd_p').text(res.message)
              if(res.success){
                $('.qd_success').show();
                $('.qd_fail').hide()
              }else{
                $('.qd_success').hide();
                $('.qd_fail').show()
              }
            }
        });
      }
      qrsign(id);
      //点击返回首页按钮的事件
      $('.qd_backhome').click(function(){
        window.location.href = window.location.protocol+"//"+window.location.host+"/lres_nh/mobile/index.jsp?authType=lresnh"
      });
    </script>
  </body>
</html>
