import moment from 'moment';
import { mvType, auditType } from '@/assets/js/options';
export default {
  /**
   * 表格中字段为空时的默认转换
   * @param {*} row
   * @param {*} column
   * @param {*} value
   */
  defaultFormat(row, column, value) {
    if (value) {
      return value;
    } else {
      return '--';
    }
  },

  /**
   * 表格中时间的默认转换
   * @param {*} row
   * @param {*} column
   * @param {*} value
   * @param {*} index
   * @param {*} format
   */
  timeFormat(row, column, value, index, format) {
    if (value) {
      let f = format || 'YYYY-MM-DD HH:mm:ss';
      return moment(value, 'YYYYMMDDHHmmss').format(f);
    } else {
      return '--';
    }
  },

  /**
   * 时间的默认转换
   * @param {*} value
   * @param {*} format
   */
  defaultTimeFormat(value, format) {
    if (value) {
      let f = format || 'YYYY-MM-DD HH:mm:ss';
      return moment(value, 'YYYYMMDDHHmmss').format(f);
    } else {
      return '--';
    }
  },

  /**
   * 下载文件
   * @param {*} fileid
   */
  downloadFile(fileid) {
    window.location.href = window.g.downUrl + fileid;
  },

  /**
   * 多人预约签到签退
   * @param {*} obj
   */
  signEvents(obj) {
    if (obj.type == '2' || obj.type == '3') {
      obj.resultnote = '';
      obj.note = obj.type == '2' ? '签到' : '签退';
      obj.name = obj.type == '2' ? '签到' : '签退';
    }
  },

  // 确认小弹窗
  showPopup(obj) {
    const { _this, txt, tips, type, fun } = obj;
    _this
      .$confirm(txt, tips, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type,
      })
      .then(fun)
      .catch(() => {
        return;
      });
  },
  judgeTitle(title, str, condition = true) {
    return title.indexOf(str) > -1 && condition;
  },
  // 视频截图封面图
  getVideoCanvas(videoList, fun, that) {
    var videoCanList = []; // 因为后端返回的视频数组，这里先定义一个空数组
    videoList.forEach(item => {
      if (isVideo(item.fileType)) {
        // for循环获取到的视频数组
        // 因为是循环处理，这里定义一个promise函数
        var promise = new Promise(reslove => {
          // 在缓存中创建video标签
          var video = document.createElement('VIDEO');
          // 通过setAttribute给video dom元素添加自动播放的属性，因为视频播放才能获取封面图;
          video.setAttribute('autoplay', 'autoplay');
          // 再添加一个静音的属性，否则自动播放会有声音
          video.setAttribute('muted', 'muted');
          video.currentTime = 1;
          video.setAttribute('src', item.viewUrl);
          video.setAttribute('crossOrigin', 'anonymous'); //设置跨域 否则toDataURL导出图片失败
          // 上面我们只是创建了video标签，视频播放需要内部的source的标签，scr为播放源;
          // video.innerHTML = '<source src=' + item.viewUrl + ' crossorigin="anonymous">';
          // 再创建canvas画布标签
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          // video注册canplay自动播放事件
          video.addEventListener(
            'canplay',
            function() {
              // 创建画布的宽高属性节点，就是图片的大小，单位PX
              var anw = document.createAttribute('width');
              let w = video.videoWidth;
              let h = video.videoHeight;
              // anw.nodeValue = 160;
              anw.nodeValue = w;
              var anh = document.createAttribute('height');
              // anh.nodeValue = 90;
              anh.nodeValue = h;
              // console.log(video.videoWidth, video.videoHeight);
              canvas.setAttributeNode(anw);
              canvas.setAttributeNode(anh);
              // 画布渲染
              ctx.drawImage(video, 0, 0, anw.nodeValue, anh.nodeValue);
              // 生成图片
              var base64 = canvas.toDataURL('image/png'); // 这就是封面图片的base64编码
              // 视频结束播放的事件
              video.pause();
              let reg = /^[0-9.]+$/;
              let duration = reg.test(video.duration)
                ? moment.utc(video.duration * 1000).format('HH:mm:ss')
                : '';
              that &&
                that.$nextTick(() => {
                  that.$set(item, 'cover', base64);
                  that.$set(item, 'duration', duration);
                });
              item.w = w;
              item.h = h;
              reslove(base64); // promise函数成功的回调
            },
            false
          );
        });
        videoCanList.push(promise); // 这里将每一次promise函数成功回调的结果push进一开始定义的空数组
      } else if (isAudit(item.fileType)) {
        item.noCover = true;
        item.cover = require('@/assets/img/noCover.png');
      } else {
        item.cover = item.viewUrl;
      }
    });
    // 通过Promise.all方法等待上面的循环结束这里再执行业务逻辑
    Promise.all(videoCanList).then(() => {
      videoList = [...videoList];
      fun && fun();
      // console.log(res); // 这里就是每一张视频的封面图
    });
  },
  addClass(className) {
    document.body.classList.add(className);
  },
  removeClass(className) {
    document.body.classList.remove(className);
  },
  requestFullScreen() {
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
  },
};

function isVideo(type) {
  return mvType.indexOf(type) > -1;
}
function isAudit(type) {
  return auditType.indexOf(type) > -1;
}
