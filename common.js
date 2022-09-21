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
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, fileName);
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
    let rABS = false; //是否将文件读取为二进制字符串

    let reader = new FileReader();
    FileReader.prototype.readAsBinaryString = function (f) {
      let binary = '';
      let rABS = false; //是否将文件读取为二进制字符串
      let wb; //读取完成的数据
      let outdata;
      let reader = new FileReader();
      reader.onload = function (e) {
        let bytes = new Uint8Array(reader.result);
        let length = bytes.byteLength;
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        function fixdata(data) {
          //文件流转BinaryString(不需要此功能可以删掉)

          var o = '',
            l = 0,
            w = 10240;

          for (; l < data.byteLength / w; ++l)
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));

          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));

          return o;
        }

        if (rABS) {
          wb = XLSX.read(btoa(fixdata(binary)), {
            // 手动转化
            type: 'base64',
          });
        } else {
          wb = XLSX.read(binary, {
            type: 'binary',
          });
        }
        //   outdata = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
        outdata = XLSX.utils.sheet_to_txt(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
        _this.checkExcelData(outdata);
      };
      reader.readAsArrayBuffer(f);
    };
    if (rABS) {
      reader.readAsArrayBuffer(f);
    } else {
      reader.readAsBinaryString(f);
    }
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
    let timeLength = time ? '' + time : '';
    let tf = function (d) {
      return d >= 10 ? d : '0' + d;
    };
    let dateObj;
    switch (timeLength.length) {
      case 17:
      case 16:
      case 15:
      case 14:
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
    return myDate.getFullYear() + month + strDate;
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
errMsg && tVue.$message({
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
