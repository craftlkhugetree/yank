import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import tVue from '@/main.js';
import Axios from 'axios';

export default {
  /********************************************1.导入导出Excel文件，二进制导出文件********************************************/
  // 二维数组导出Excel
  exportExcel(arr, fileName) {
    let ws = XLSX.utils.aoa_to_sheet(arr);
    var sheet = XLSX.utils.json_to_sheet(arr, {
      skipHeader: true,
    });

    //第一次使用的朋友可以添加一句输出看看sheet的数据结构
    //console.log(sheet)

    //遍历每个格子
    for (const key in sheet) {
      if (key === '!ref') continue;
      //给每个格子修改样式
      sheet[key].s = {
        border: {
          //添加边框
          bottom: {
            style: 'thin',
            color: '000000',
          },
          left: {
            style: 'thin',
            color: '000000',
          },
          right: {
            style: 'thin',
            color: '000000',
          },
          top: {
            style: 'thin',
            color: '000000',
          },
        },
        //字体水平居中、垂直居中、自动换行、缩进
        alignment: {
          horizontal: 'center', //水平居中
          vertical: 'center',
          wrapText: 1,
          indent: 0,
        },
        //字体类型、大小、是否加粗
        font: {
          //字体
          name: '等线',
          sz: 9,
          bold: false,
        },
      };
      //给特定格子（带'1'的，即首行 标题）添加样式，下面同理
      if (key.replace(/[^0-9]/gi, '') === '1') {
        sheet[key].s = {
          ...sheet[key].s,
          fill: {
            //背景色
            fgColor: { rgb: '9e9e9e' },
            // fgColor: { rgb: 'EBF1DE' },
          },
          font: {
            //覆盖字体
            name: '等线',
            sz: 11,
            bold: true,
          },
        };
      }
      // if (key === 'A1') {
      //   sheet[key].s = {
      //     ...sheet[key].s,
      //     fill: {
      //       //背景色
      //       fgColor: { rgb: 'E4DFEC' },
      //     },
      //   };
      // }
      // if (
      //   key === 'C1' ||
      //   key === 'D1' ||
      //   key === 'E1' ||
      //   key === 'F1' ||
      //   key === 'G1' ||
      //   key === 'H1'
      // ) {
      //   sheet[key].s = {
      //     ...sheet[key].s,
      //     fill: {
      //       //背景色
      //       fgColor: { rgb: 'FDE9D9' },
      //     },
      //   };
      // }
    }
    //列宽
    let colsP = [
      {
        wch: 18.11, //A
      },
      {
        wch: 12.67, //B
      },
      {
        wch: 8.11, //C
      },
      {
        wch: 8.11, //D
      },
      {
        wch: 8.11, //E
      },
      {
        wch: 6.78, //F
      },
      {
        wch: 8.11, //G
      },
      {
        wch: 8.11, //H
      },
    ];
    sheet['!cols'] = colsP;

    console.log(sheet, ws);
    let wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws);
    XLSX.utils.book_append_sheet(wb, sheet);
    XLSX.writeFile(wb, fileName);
  },
  // 导入方法sheet_to_json, title为excel第一行表头，key对应的属性字段，callback为保存接口。
  checkExcelData(data, obj) {
    const { _this, key, title, regCheck, callback, commonParams } = obj;
    if (!Array.isArray(data)) {
      throw '需要数组';
    }
    if (!data.length) {
      _this.$message({
        showClose: true,
        type: 'warning',
        message: '导入文件没有数据',
      });
      throw '没有数据';
    }
    const head = Object.keys(data[0]) || [];
    const arr = head.filter((t, index, A) => A.indexOf(t) === index) || [];
    let flag = 0;
    if (!arr.length) {
      ++flag;
    }
    arr.forEach(item => {
      if (!title.includes(item)) {
        ++flag;
      }
    });
    if (flag) {
      _this.$message({
        showClose: true,
        type: 'warning',
        message: '表头有误，请按模板导入。',
      });
      throw '表头有误';
    }
    let arrT = [];
    data.forEach(obj => {
      let msg = regCheck({ obj });
      if (msg) {
        flag++;
        _this.$message({
          duration: 3000,
          showClose: true,
          type: 'warning',
          message: msg,
        });
        throw msg;
      }
      let arrEle = { ...commonParams };
      title.forEach((item, index) => {
        arrEle[key[index]] = obj[item];
      });
      arrT.push(arrEle);
    });
    if (!flag) {
      callback(arrT);
    }
  },
  checkExcelData_txt(arr) {
    let flag = 0;
    if (arr && arr.length && arr.length > 1) {
      // XLSX.utils.sheet_to_txt()
      arr.forEach((item, index) => {
        if (index === 0) {
          item.forEach((i, id) => {
            // 导入文件的表头与模板表头不同
            if (i !== this.title[0][id] && item.length !== this.title.length) {
              flag++;
              this.$message({
                showClose: true,
                type: 'warning',
                message: '表头有误，请按模板导入。',
              });
              throw '表头有误';
            }
          });
        } else {
          item.forEach((i, n) => {
            // 校验每格数据
            let msg = this.regCheck({ index: n, name: i });
            if (msg) {
              flag++;
              throw msg;
            }
          });
        }
      });
      if (!flag) {
        let rest = arr.slice(1);
        let arrT = [];
        rest.forEach(r => {
          let arrEle = { relationship: this.rs };
          r.forEach((item, index) => {
            arrEle[this.name[index]] = item;
          });
          arrT.push(arrEle);
        });
        // 主键相同的行如何操作
        // this.getSamePrimaryKey(arrT);
        // 调用接口保存导入的数据
        personSaveBatch(arrT).then(res => {
          if (res && res.code === '000000') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '导入成功！',
            });
            this.refGet();
          }
        });
      }
    }
  },
  // 导入Excel
  getFile(event) {
    let _this = this;
    let f = event.target.files[0];
    this.$refs.uploadDom.value = '';
    if (!this.judgeIfExcel(f)) {
      this.$message({
        showClose: true,
        type: 'warning',
        message: this.onlyExcel,
      });
      return;
    }
    if (f.size > 10 * 1000 * 1000) {
      this.$message({
        showClose: true,
        type: 'warning',
        message: '文件大小不能超过10M',
      });
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = ev => {
      const workbook = XLSX.read(ev.target.result, {
        type: 'binary',
      });
      const wsname = workbook.SheetNames[0];
      const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
      console.log('ws:', ws); // 转换成json的数据
    };
    fileReader.readAsBinaryString(f);
    // let rABS = false; //是否将文件读取为二进制字符串

    // let reader = new FileReader();
    // FileReader.prototype.readAsBinaryString = function (f) {
    //   let binary = '';
    //   let rABS = false; //是否将文件读取为二进制字符串
    //   let wb; //读取完成的数据
    //   let outdata;
    //   let reader = new FileReader();
    //   reader.onload = function (e) {
    //     let bytes = new Uint8Array(reader.result);
    //     let length = bytes.byteLength;
    //     for (let i = 0; i < length; i++) {
    //       binary += String.fromCharCode(bytes[i]);
    //     }
    //     function fixdata(data) {
    //       //文件流转BinaryString(不需要此功能可以删掉)

    //       var o = '',
    //         l = 0,
    //         w = 10240;

    //       for (; l < data.byteLength / w; ++l)
    //         o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));

    //       o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));

    //       return o;
    //     }

    //     if (rABS) {
    //       wb = XLSX.read(btoa(fixdata(binary)), {
    //         // 手动转化
    //         type: 'base64',
    //       });
    //     } else {
    //       wb = XLSX.read(binary, {
    //         type: 'binary',
    //       });
    //     }
    //     //   outdata = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
    //     outdata = XLSX.utils.sheet_to_txt(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
    //     _this.checkExcelData(outdata);
    //   };
    //   reader.readAsArrayBuffer(f);
    // };
    // if (rABS) {
    //   reader.readAsArrayBuffer(f);
    // } else {
    //   reader.readAsBinaryString(f);
    // }
  },
  // Function: 导出文件
  exportFile(url, isGet, params, fileName, fileType) {
    const loading = tVue.$loading({
      lock: true,
      text: '导出中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    Axios({
      url: window.g.ApiUrl2 + url,
      method: isGet ? 'GET' : 'POST',
      responseType: 'blob',
      headers: { IDSTGC: getCookie('IDSTGC') || '7d237f2b3db14c6eb4994258fd83aa8a' },
      data: params,
    })
      .then(res => {
        let url = window.URL.createObjectURL(res.data);
        let link = document.createElement('a');
        link.href = url;
        link.style.display = 'none';
        link.setAttribute('download', fileName + '.' + fileType);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        loading.close();
      })
      .catch(e => {
        loading.close();
      });
  },
  // 二进制读取文件
  readFile(url) {
    var res;
    $.ajax({
      url: url, // 文件位置
      type: 'GET', // 请求方式为get
      async: false,
      dataType: 'xml', // 返回数据格式为xml
      success: function (data) {
        res = data;
      },
    });
    return res;
  },
  // 原生 js 下载二进制流
  binaryDown(type) {
    let xmlResquest = new XMLHttpRequest();
    let url =
      location.protocol + '//' + location.host + urls + `dataAnalysis/${type}DataExcel?data=`;
    let param = JSON.stringify({ page: 1, start: 0 });
    url += encodeURIComponent(param);
    let fileName = type + '统计';
    xmlResquest.open('get', url, true);
    xmlResquest.responseType = 'blob';
    xmlResquest.timeout = 0; // 设置超时时间
    xmlResquest.onload = function (oEvent) {
      const content = xmlResquest.response;
      // 因为可能后端可能会传递 json 格式的报错信息，所以在接收信息的时候需要判断一下是否是 json 文件。如果是 json 文件，则为报错信息。不是 json 文件就是正常文本信息
      let fileReader = new FileReader();
      fileReader.onload = function () {
        try {
          let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
          if (jsonData.code) {
          }
        } catch (error) {
          // 解析出错，可以下载，说明不是 json 对象
          // const elink = document.createElement('a');
          // elink.download = fileName;
          // elink.style.display = 'none';
          // const blob = new Blob([content]);
          // elink.href = URL.createObjectURL(blob);
          // document.body.appendChild(elink);
          // elink.click();
          // document.body.removeChild(elink);
          let url = window.URL.createObjectURL(content);
          let link = document.createElement('a');
          link.href = url;
          link.style.display = 'none';
          link.setAttribute('download', fileName + '.xlsx');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      };
      fileReader.readAsText(content);
    };
    xmlResquest.send();
  },

  /********************************************2.日期********************************************/
  // Function : 时间函数封装
  formatTime(time, format, empty = '--') {
    let timeStr = time ? '' + time : '';
    let tf = function (d) {
      return d >= 10 ? d : '0' + d;
    };
    let dateObj;
    switch (timeStr.length) {
      case 17:
      case 16:
      case 15:
      case 14:
        dateObj = new Date(
          parseInt(timeStr.substring(0, 4)),
          parseInt(timeStr.substring(4, 6)) - 1,
          parseInt(timeStr.substring(6, 8)),
          parseInt(timeStr.substring(8, 10)),
          parseInt(timeStr.substring(10, 12)),
          parseInt(timeStr.substring(12, 14))
        );
        break;
      case 13:
        dateObj = new Date(time);
        break;
      case 8:
        dateObj = new Date(
          parseInt(timeStr.substring(0, 4)),
          parseInt(timeStr.substring(4, 6)) - 1,
          parseInt(timeStr.substring(6, 8))
        );
        break;
      default:
        dateObj = '';
        // throw "Ow<这是一条来自common的提示：format参数输入错误";
        console.log('format参数输入错误');
    }
    let timeString = '';
    if (dateObj) {
      timeString = format
        .replace(/YYYY/gi, dateObj.getFullYear() + '')
        .replace(/MM/g, tf(dateObj.getMonth() + 1))
        .replace(/DD/gi, tf(dateObj.getDate()))
        .replace(/hh/gi, tf(dateObj.getHours()))
        .replace(/mm/g, tf(dateObj.getMinutes()))
        .replace(/ss/gi, tf(dateObj.getSeconds()));
    } else {
      timeString = empty;
    }
    return timeString;
  },

  // 返回无分隔符年月日
  ymd(dateObj) {
    var myDate = dateObj || new Date();
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
  },

  /********************************************3.导出pdf文件********************************************/
  // dom导出为pdf
  transToPdf(title, domID) {
    const loading = tVue.$loading({
      lock: true,
      text: '下载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
    });

    let element = document.getElementById(domID); // 这个dom元素是要导出pdf的div容器
    html2Canvas(element).then(function (canvas) {
      var contentWidth = canvas.width;
      var contentHeight = canvas.height;

      //一页pdf显示html页面生成的canvas高度;
      var pageHeight = (contentWidth / 592.28) * 841.89;
      //未生成pdf的html页面高度
      var leftHeight = contentHeight;
      //页面偏移
      let position = 0;
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      var imgWidth = 555.28;
      var imgHeight = (592.28 / contentWidth) * contentHeight;

      var pageData = canvas.toDataURL('image/jpeg', 1.0);

      // 分页
      var pdf = new JsPDF('', 'pt', 'a4');
      // var pdf = new JsPDF('', 'pt', [contentWidth, contentHeight]); //不分页
      // pdf.addImage(pageData, 'JPEG', 0, 0, contentWidth, contentHeight);

      //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      //当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          //避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      pdf.save(title + '.pdf');
      loading.close();
      tVue[domID] = false;
    });
  },
  //避免分页被截断
  outPutPdfFn(domID, itemClass, title, useClass) {
    let vm = tVue;
    const A4_WIDTH = 592.28;
    const A4_HEIGHT = 841.89;
    // $myLoading 自定义等待动画组件，实现导出事件的异步等待交互
    vm.$nextTick(() => {
      // dom的id。
      let target = document.getElementById(domID);
      let tTop = target.getBoundingClientRect().top;
      let pageHeight = (target.scrollWidth / A4_WIDTH) * A4_HEIGHT;
      // let pageHeight = A4_HEIGHT;
      // 获取分割dom，此处为class类名为item的dom
      // let lableListID = target.getElementsByClassName(itemClass);
      let arr = useClass
        ? Array.from(target.getElementsByClassName(itemClass))
        : Array.from(target.children);
      let lableListID = arr.filter(t => t && t.getBoundingClientRect);
      console.log(target, arr, lableListID);
      // 进行分割操作，当dom内容已超出a4的高度，则将该dom前插入一个空dom，把他挤下去，分割
      for (let i = 0; i < lableListID.length; i++) {
        let lTop = lableListID[i].getBoundingClientRect().top;
        // let diff = lableListID[i].offsetTop + lableListID[i].offsetHeight;
        let diff = lTop - tTop;
        console.log(lTop, tTop, diff, pageHeight);
        let multiple = Math.ceil(
          // (lableListID[i].offsetTop + lableListID[i].offsetHeight) / pageHeight
          diff / pageHeight
        );
        if (this.isSplit(lableListID, i, pageHeight, tTop)) {
          let divParent = lableListID[i].parentNode; // 获取该div的父节点
          let newNode = document.createElement('div');
          newNode.className = 'emptyDiv';
          newNode.style.background = '#fff';
          // let _H = multiple * pageHeight - diff;
          // let _H = pageHeight - diff;
          let _H = lableListID[i].clientHeight;
          newNode.style.height = _H + 30 + 'px';
          newNode.style.width = '100%';
          divParent.insertBefore(newNode, lableListID[i]);
          console.log(_H, lableListID[i]);
          let next = lableListID[i].nextSibling; // 获取div的下一个同一层级节点
          // 判断兄弟节点是否存在
          if (next) {
            // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
            // divParent.insertBefore(newNode, next);
          } else {
            // 不存在则直接添加到最后,appendChild默认添加到divParent的最后
            // divParent.appendChild(newNode);
          }
          tTop = newNode.getBoundingClientRect().top;
        }
      }
      this.transToPdf(title, domID);
    });
  },
  // 判断是否需要添加空白div
  isSplit(nodes, index, pageHeight, tTop) {
    // 计算当前这块dom是否跨越了a4大小，以此分割
    if (
      // nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight &&
      nodes[index].getBoundingClientRect().top - tTop < pageHeight &&
      nodes[index].getBoundingClientRect().top + nodes[index].clientHeight - tTop > pageHeight &&
      nodes[index].clientHeight < pageHeight / 3
      // nodes[index + 1] &&
      // nodes[index + 1].getBoundingClientRect().top - tTop > pageHeight
      // nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight
    ) {
      return true;
    }
    return false;
  },
};

// 移动端 封装loading，由接口处决定是否提供loadingText
if (options.loadingText || options.loadingText === '') {
  tVue.$toast.loading({
    message: options.loadingText,
    forbidClick: true,
    overlay: true,
    duration: 0,
  });
}
let errMsg = res.message || res.msg || orgindata.msg || orgindata.message;
errMsg && tVue.$toast.fail(errMsg);
tVue.$toast.clear();

// pc端
loading = tVue.$loading({
  lock: true,
  text: options.loadingText,
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0.7)',
});
loading.close();
errMsg &&
  tVue.$message({
    showClose: true,
    type: 'error',
    message: errMsg,
  });

// 复制到剪切板的两种方法
if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Async: Copying to clipboard was successful!');
    },
    function (err) {
      console.error('Async: Could not copy text: ', err);
    }
  );
} else {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.setAttribute('value', text);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    console.log('复制成功');
  }
  document.body.removeChild(input);
}

// video结束标记
var md = document.getElementsByTagName('video')[0];
md.loop = false;
md.addEventListener('ended', () => {
  console.log('结束');
});

// 检测是否函数
function isFunction(v) {
  return [
    '[object Function]',
    '[object GeneratorFunction]',
    '[object AsyncFunction]',
    '[object Promise]',
  ].includes(Object.prototype.toString.call(v));
}
// 音频时长
{
        let timer = setInterval(() => {
          var musicDom = document.getElementById(t); //获取audio对象
          if (musicDom) {
            musicDom.load();
            musicDom.onloadedmetadata = function () {
              let duration = parseInt(musicDom.duration);
            };
            clearInterval(timer);
          }
        }, 500);
      }
// 视频截图封面图
function getVideoCanvas(videoList, fun, that) {
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
          function () {
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
}
function forbidTouch() {
  // body样式，隐藏滚动条和禁止上滑刷新
  //   &::-webkit-scrollbar {
  //   width: 0;
  // }

  // overscroll-behavior-y: contain;

  // 禁用右键，移动端长按
  window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });
  // 禁用双指放大
  document.documentElement.addEventListener(
    'touchstart',
    function (event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    {
      passive: false,
    }
  );

  // 禁用双击放大
  var lastTouchEnd = 0;
  document.documentElement.addEventListener(
    'touchend',
    function (event) {
      var now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    {
      passive: false,
    }
  );
}

// 中文字符排序
this.tableData = tmp.sort((a, b) => {
  return (
    typeof a.name === 'string' &&
    typeof b.name === 'string' &&
    a.name.localeCompare(b.name, 'zh-Hans-CN')
  );
});

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
// 一旦窗口变化就检查是否全屏
    window.onresize = () => {
      // console.log(this.isFull, document.fullscreenElement, document.fullscreen);
        if (!document.fullscreen) {
          isFull = true;
          document.getElementsByClassName('full')[0].hidden = false;
        } else {
          document.getElementsByClassName('full')[0].hidden = true;
        }
    };


const Vue = {
  /**
   js部分
   */
  mounted() {
    //初始化自适应  ----在刚显示的时候就开始适配一次
    handleScreenAuto();
    //绑定自适应函数   ---防止浏览器栏变化后不再适配
    window.onresize = () => handleScreenAuto();
  },
  deleted() {
    window.onresize = null;
  },
  methods: {
    //数据大屏自适应函数
    handleScreenAuto() {
      const designDraftWidth = 1920;//设计稿的宽度
      const designDraftHeight = 960;//设计稿的高度
      //根据屏幕的变化适配的比例
      const scale = document.documentElement.clientWidth / document.documentElement.clientHeight < designDraftWidth / designDraftHeight ?
        (document.documentElement.clientWidth / designDraftWidth) :
        (document.documentElement.clientHeight / designDraftHeight);
      //缩放比例
      (document.querySelector('#screen')).style.transform = `scale(${scale}) translate(-50%)`;
    }
  }
}
    /*
      CSS部分  --除了设计稿的宽高是根据您自己的设计稿决定以外，其他复制粘贴就完事
    */  
/***
 <style>
  .screen-root {
    height: 100%;
    width: 100%;
    .screen {
        display: inline-block;
        width: 1920px;  //设计稿的宽度
        height: 960px;  //设计稿的高度
        transform-origin: 0 0;
        position: absolute;
        left: 50%;
        }
    }
   <style>
 */