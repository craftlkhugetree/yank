import util from './util';
import global from './global';
import store from '../../store';
import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';

let BigDecimal = require('js-big-decimal');

export default {
  // 获取灌溉资源类型列表
  getResTypeList() {
    return new Promise((resolve, reject) => {
      util
        .postAjax({
          code: global.bmCode,
          url: '/irres/typeList?date=' + new Date().getTime(),
        })
        .then(res => {
          if (res.success == true) {
            if (res.items) {
              resolve(res.items);
            } else {
              reject(res);
            }
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  // 获取灌溉资源编号列表
  getResCodeList(irrestypeid, orgid) {
    return new Promise((resolve, reject) => {
      let params = {
        restypeid: irrestypeid,
      };
      if (orgid) {
        params.orgid = orgid;
      }
      util
        .postAjax({
          code: global.bmCode,
          url: '/irres/list?date=' + new Date().getTime(),
          data: {
            params: JSON.stringify(params),
          },
        })
        .then(res => {
          if (res.success == true) {
            if (res.items) {
              resolve(res.items);
            } else {
              reject(res);
            }
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  // 获取用户列表
  getUserList(keyword) {
    return new Promise((resolve, reject) => {
      util
        .postAjax({
          code: global.bmCode,
          url: '/user/userList',
          data: {
            key: keyword,
          },
        })
        .then(res => {
          if (res.success) {
            resolve(res.items);
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  //获取学院列表
  getOrgList(keyword) {
    return new Promise((resolve, reject) => {
      util
        .postAjax({
          code: global.bmCode,
          url: '/user/orgList',
          data: {
            key: keyword,
          },
        })
        .then(res => {
          if (res.success == true) {
            if (res.items) {
              resolve(res.items);
            } else {
              reject(res);
            }
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  // 获取项目名称列表
  getProjectNameList(keyword) {
    return new Promise((resolve, reject) => {
      util
        .postAjax({
          code: global.bmCode,
          url: '/user/projectList',
          data: {
            params: JSON.stringify({
              page: 1,
              limit: 20,
              projectname: keyword,
            }),
          },
        })
        .then(res => {
          if (res.success) {
            resolve(res.items);
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  // 获取科教资源类型列表
  getEduResTypeList() {
    return new Promise((resolve, reject) => {
      util
        .postAjax({
          code: global.bmCode,
          url: '/sprestype/list?date=' + new Date().getTime(),
        })
        .then(res => {
          if (res.success == true) {
            if (res.items) {
              resolve(res.items);
            } else {
              reject(res);
            }
          } else {
            reject(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 下载文件
   * @param {*} fileid
   */
  downloadFile(fileid) {
    window.location.href = store.state.downUrl + fileid;
  },

  // 下载申请表
  downloadApplyForm(id) {
    let url = window.g.bm + '/prapply/applyForm?id=' + id + '&type=1';
    window.location.href = url;
  },

  /**
   * 获取文件预览地址
   * @param {*} fileid
   */
  getPreviewUrl(fileid) {
    return new Promise((resolve, reject) => {
      util
        .postAjax({
          code: global.fileCode,
          url: 'rest/FileOut/getPreviewUrl2',
          isRep: true,
          data: {
            PHYAPPID: 'unknow',
            ID: fileid,
          },
        })
        .then(res => {
          if (res.success) {
            resolve(res.data.previewUrl);
          } else {
            reject(res.data);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // 日历默认日期
  defaultDate(date, isRange) {
    if (isRange) {
      let start = date ? new Date(Date.parse(date.split('-')[0])) : new Date();
      let end = date
        ? new Date(Date.parse(date.split('-')[1]))
        : new Date(start.setDate(start.getDate() + 1));
      return [start, end];
    } else {
      return date ? new Date(Date.parse(date)) : new Date();
    }
  },
  // 表格内默认转化
  defaultFormatter(row, column, cellValue) {
    return cellValue ? cellValue : '--';
  },
  // 优化util时间格式转化
  formatTime(time, format) {
    return time ? util.formatTime(time, format) : '--';
  },
  // 表格内日期格式转化
  dateFormatter(row, column, cellValue) {
    return cellValue ? util.formatTime(cellValue, 'YYYY.MM.DD') : '--';
  },
  // 表格内时间格式转化
  timeFormatter(row, column, cellValue) {
    return cellValue ? util.formatTime(cellValue, 'YYYY.MM.DD hh:mm:ss') : '--';
  },
  //表格内水资源状态格式转化
  statusFormatter(row, column, cellValue) {
    switch (cellValue) {
      case '0':
        return '草稿';
        break;
      case '1':
        return '审批中';
        break;
      case '2':
        return '未接收';
        break;
      case '3':
        return '已完成';
        break;
      case '8':
        return '已驳回';
        break;
      case '9':
        return '已撤回';
        break;
    }
  },
  //表格内本科实习状态格式转化
  processFormatter(row, column, cellValue) {
    switch (cellValue) {
      case '0':
        return '草稿';
        break;
      case '1':
        return '单位领导审批中';
        break;
      case '2':
        return '基地审批中';
        break;
      case '3':
        return '已完成';
        break;
      case '7':
        return '超时,系统退回';
        break;
      case '8':
        return '已驳回';
        break;
      case '9':
        return '已撤回';
        break;
    }
  },
  //表格内入驻状态格式转化
  useStateFormatter(row, column, cellValue) {
    switch (cellValue + '') {
      case '0':
        return '空闲';
        break;
      case '2':
        return '未入驻';
        break;
      case '3':
        return '已入驻';
        break;
      case '4':
        return '已退出';
        break;
      case '5':
        return '申请中';
        break;
    }
  },
  //入驻是否开启格式转化
  resStateFormatter(row, column, cellValue) {
    switch (cellValue) {
      case '1':
        return '开启';
        break;
      case '2':
        return '关闭';
        break;
    }
  },
  //缴费状态格式转化
  payFormatter(row, column, cellValue) {
    switch (cellValue) {
      case '0':
        return '未支付';
        break;
      case '1':
        return '已支付';
        break;
    }
  },
  // 计费周期
  chargecycleFormatter(value, object) {
    if (!object) {
      let newValue = '';
      switch (value) {
        case '1':
          newValue = '天';
          break;
        case '2':
          newValue = '月';
          break;
        case '3':
          newValue = '年';
          break;
        default:
          newValue = '--';
      }
      return newValue;
    } else {
      switch (value) {
        case '3':
          object.chargecycle = '年';
          break;
        case '1':
          object.chargecycle = '天';
          break;
        case '2':
          object.chargecycle = '月';
          break;
      }
      return;
    }
  },
  chargetypeFormatter2(type, object, ct2 = 'chargetype', ct1) {
    switch (type) {
      case '1':
        object[ct2] = 'm²';
        ct1 ? (object[ct1] = '面积') : null;
        break;
      case '2':
        object[ct2] = '间';
        ct1 ? (object[ct1] = '房间') : null;
        break;
    }
  },
  // 计费方式  type : name名称 / unit单位
  chargetypeFormatter(value, type) {
    let newValue = '';
    switch (value) {
      case '1':
        newValue = type === 'name' ? '面积' : 'm²';
        break;
      case '2':
        newValue = type === 'name' ? '房间' : '间';
        break;
      default:
        newValue = '--';
    }
    return newValue;
  },
  //资源申请类型
  resApplyTypeFormatter(row, column, cellValue) {
    switch (cellValue) {
      case '1':
        return '入驻';
        break;
      case '2':
        return '续租';
        break;
      case '3':
        return '退出';
        break;
    }
  },
  //资源申请单入驻状态
  applyLiveStatusFormatter(row, column, cellValue) {
    switch (cellValue) {
      case '0':
        switch (row.usetype) {
          case '1':
          case '2':
            return '未入驻';
            break;
          case '3':
            return '未退出';
            break;
        }
        break;
      case '1':
        switch (row.usetype) {
          case '1':
          case '2':
            return '已入驻';
            break;
          case '3':
            return '已退出';
            break;
        }
        break;
    }
  },
  //维修状态转化
  repairStateFormatter(row, column, cellValue) {
    switch (cellValue) {
      case '1':
        return '待维修';
        break;
      case '2':
        return '已维修';
        break;
    }
  },

  //指定日期加上多少天，加多少月，加多少年的日期
  /*
   *   参数:interval,字符串表达式，表示要添加的时间间隔.
   *   参数:number,数值表达式，表示要添加的时间间隔的个数.
   *   参数:date,时间对象.
   *   返回:新的时间对象.
   *   var   now   =   new   Date();
   *   var   newDate   =   DateAdd( "d ",5,now);
   *---------------   DateAdd(interval,number,date)   -----------------
   */
  DateAdd(interval, number, date) {
    let n = parseInt(number);
    switch (interval) {
      case '年':
        date.setFullYear(date.getFullYear() + n);
        break;

      case '月':
        date.setMonth(date.getMonth() + n);
        break;

      case '天':
        date.setDate(date.getDate() + n);
        break;
    }
    return new Date(date);
  },

  /**
   * 两数相加
   * @param {*} p1
   * @param {*} p2
   * @param {*} precision 精度
   */
  add(p1, p2, precision) {
    let a = p1 || 0;
    let b = p2 || 0;
    let p = precision || 2;
    return BigDecimal.round(BigDecimal.add(a.toString(), b.toString()), p);
  },
  /**
   * 两数相减
   * @param {*} p1
   * @param {*} p2
   * @param {*} precision 精度
   */
  subtract(p1, p2, precision) {
    let a = p1 || 0;
    let b = p2 || 0;
    let p = precision || 2;
    return BigDecimal.round(BigDecimal.subtract(a.toString(), b.toString()), p);
  },

  /**
   * 两数相乘
   * @param {*} p1
   * @param {*} p2
   * @param {*} precision 精度
   */
  multiply(p1, p2, precision) {
    let a = p1 || 0;
    let b = p2 || 0;
    let p = precision || 2;
    return BigDecimal.round(BigDecimal.multiply(a.toString(), b.toString()), p);
  },

  /**
   * 两数相除
   * @param {*} p1
   * @param {*} p2
   * @param {*} precision 精度
   */
  divide(p1, p2, precision) {
    let p = precision || 2;
    let a = p1 || 0;
    let b = p2 || 1;
    return BigDecimal.divide(a.toString(), b.toString(), p);
  },

  /**
   * 表格金额保留两位小数
   * @param {*} value
   */
  moneyFormatter(row, column, value) {
    if (value !== null && value !== undefined && value !== '') {
      return BigDecimal.round(value, 2);
    } else {
      return '--';
    }
  },

  /**
   * 金额保留两位小数
   * @param {*} value
   */
  money(value, precision) {
    let p = precision || 2;
    if (value) {
      return BigDecimal.round(value, p);
    } else {
      return '0';
    }
  },

  //泵水资源状态样式变化
  statusColor(row, column, cellValue) {
    switch (cellValue) {
      case '0':
        return 'status-purple';
        break;
      case '1':
        return 'status-orange';
        break;
      case '2':
        return 'status-grey';
        break;
      case '3':
        return 'status-green';
        break;
      case '7':
        return 'status-black';
        break;
      case '8':
        return 'status-red';
        break;
      case '9':
        return 'status-blue';
        break;
    }
  },
  // 处理pdf
  transToPdf(title, domID, _this) {
    let element = document.getElementById(domID); // 这个dom元素是要导出pdf的div容器
    html2Canvas(element).then(function(canvas) {
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
        pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight);
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
      _this.isDomShow = false;
      _this[domID] = false;
      _this.$toast.clear();
    });
  },

  outPutPdfFn(that, domID, itemClass, title, useClass) {
    let vm = that;
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
      this.transToPdf(title, domID, that);
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
  // 科教资源逗号分隔value
  comma(obj, str) {
    return (obj && obj[str] && obj[str].split(',')) || [];
  },

  // 量词月而不是月份
  cycleUnit(obj) {
    return obj.useCycle || obj.useCycle === 0
      ? obj.useCycle + (obj.chargecycle === '月' ? '个月' : obj.chargecycle)
      : '--';
  },

  //资源申请类型
  useTypeFormatter(row, column, cellValue) {
    switch (cellValue + '') {
      case '1':
        return '入驻';
        break;
      case '2':
        return '续租';
        break;
      case '3':
        return '退出';
        break;
    }
  },

  // 科教资源表格内颜色和状态
  actionColor2(role, now, h, row) {
    if (row.status == 8) {
      return 'status-red';
    } else if (row.status == 9) {
      return 'status-blue';
    } else if (now && now.indexOf('LD') > -1) {
      return 'status-orange';
    } else if (now && now.indexOf('BM') > -1) {
      return 'status-orange';
    } else if (row.status == 2) {
      return 'status-green';
    }
  },
  processFormatter2(role, now, h, row) {
    if (row.status == 8) {
      return '已驳回';
    } else if (row.status == 9) {
      return '已撤回';
    } else if (now && now.indexOf('LD') > -1) {
      return '领导审批中';
    } else if (now && now.indexOf('BM') > -1) {
      return '基地审批中';
    } else if (row.status == 2) {
      return '已完成';
    }
  },
  resStateFormatterJump(row, column, cellValue) {
    switch (cellValue) {
      case 1:
        return '开启';
        break;
      case 0:
        return '关闭';
        break;
    }
  },
  processFormatterPractice(row, column, cellValue) {
    switch (cellValue) {
      case '0':
        return '草稿';
        break;
      case '1':
        return '单位领导审批中';
        break;
      case '2':
        return '基地审批中';
        break;
      case '3':
        return '后勤审批中';
        break;
      case '6':
        return '已完成';
        break;
      case '7':
        return '系统退回';
        break;
      case '8':
        return '已驳回';
        break;
      case '9':
        return '已撤回';
        break;
      default:
        return '无状态';
        break;
    }
  },
};
