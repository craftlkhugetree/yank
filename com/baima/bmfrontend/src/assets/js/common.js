import options from "./options";
import util from "./util";
import global from "./global";
import store from "../../store";
import { Message, Loading } from "element-ui"
import BigDecimal from "js-big-decimal"
// import el from "element-ui/src/locale/lang/el";
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
export default {

  /**
   * 单独下载文件
   * @param {*} id
   */
  downloadFile(id) {
    let url = store.state.downUrl + id;
    window.open(url, "_blank");
  },

  /**
   * 批量下载附件
   * @param {String} ids
   * @param {String} names
   */
  downloadFj(ids, names) {
    // let c_this = this;
    let id_arr = ids.split(",");
    let name_arr = names.split(",");
    for (let i = 0; i < id_arr.length; i++) {
      let url = store.state.downUrl + id_arr[i];
      let name = name_arr[i];

      let a = document.createElement('a')
      a.href = url
      a.download = name
      a.target = "_blank"
      a.click()

    }
  },

  // 预览文件
  previewFile(id) {
    let loadingInstance = Loading.service({
      text: "正在生成预览文件..."
    });
    util.postAjax({
      code: global.fileCode,
      url: "rest/FileOut/getPreviewUrl2",
      isRep: true,
      data: {
        PHYAPPID: "unknow",
        ID: id
      }
    }).then(res => {
      loadingInstance.close();
      if (res.success == true) {
        let url = res.data.previewUrl;
        window.open(url, "_blank")
      } else {
        Message({
          showClose: true,
          type: "error",
          message: "该文件暂不支持预览，请下载后查看！"
        })
      }
    }).catch(err => {
      loadingInstance.close();
      Message({
        showClose: true,
        type: "error",
        message: "该文件暂不支持预览，请下载后查看！"
      })

    })
  },

  /**
   * 表格默认值
   * @param  row
   * @param  column
   * @param  cellValue
   * @param  index
   */
  formatDefault(row, column, cellValue, index) {
    if (!cellValue) {
      return "无";
    } else {
      return cellValue;
    }
  },
  /**
   * 表格任职状态默认值
   * @param  row
   * @param  column
   * @param  cellValue
   * @param  index
   */
  formatRZZT(row, column, cellValue, index) {
    if (row.ID) {
      if (!cellValue) {
        return "无";
      } else {
        return cellValue;
      }
    } else {
      return "待加入"
    }
  },
  /**
   * 表格默认值
   * @param  cellValue
   * @param  format 格式
   */
  formatTime(cellValue, format) {
    if (!cellValue) {
      return "--";
    } else {
      return util.formatTime(cellValue, format);
    }
  },
  /**
   * 将data里空值赋值为“无”
   * @param data 对象类型数据
   */
  setData(data) {
    for (let i in data) {
      if ((data[i] === "" || data[i] === "null" || data[i] == null) && i !== "ID") {
        data[i] = "无";
      }
    }
  },

  /**
   * 将data里值“无”赋值为“”
   * @param data 对象类型数据
   */
  clearData(data) {
    for (let i in data) {
      if (data[i] === "无") {
        data[i] = "";
      }
    }
  },

  /**
   * 表格金额保留两位小数
   * @param {*} value
   */
  moneyFormatter(row,column,value,isZ) {
    if(value) {
      return BigDecimal.round(value , 2);
    } else {
      return 0;
    }
  },

  /**
   * 改变下拉框的值时,改变相应代码
   * @param value 选择的下拉框的值
   * @param type  options里下拉框的名称
   * @param form  表单
   * @param prop  表单项的prop
   */
  changeSelect(value, type, form, prop) {
    let label = prop ? prop : type;
    if (value) {
      form[label + "DM"] = options[type].filter(
        i => i.name === value
      )[0].id;
      // 如果options里下拉框的值里有oid的属性
      if (options[type][0].hasOwnProperty("oid")) {
        form[label + "ID"] = options[type].filter(i => i.name === value)[0].oid;
      }
    } else {
      form[label + "DM"] = "";
      if (options[type][0].hasOwnProperty("oid")) {
        form[label + "ID"] = "";
      }
    }
  },

  // 改变级联下拉框的值时，技术职称、职业分类
  // changeCascader(value, type, form) {
  //   form[type + 'LB'] = value[0];
  //   form[type] = value[1];
  //   form[type + 'DM'] = options[type].filter(i => i.value === value[0])[0].children.filter(j => j.value === value[1])[0].id;
  // },

  /** 获取下拉框数据
   * @param name 下拉框名称大写字母
   * @param code 子级下拉框代码
   * @param pid  父级下拉框代码
   */

  //获取领导列表
  getLeaderList(leaderList){
    util.postAjax({
      code: global.code,
      url: "/user/userLeaderList",
      // data:{
      //   key:this.form.classleader
      // }
    }).then(res => {
      if (res.success == true) {
        leaderList = res.items;
      }
    })
  },


  /** 获取下拉框数据
   * @param projectname 项目名称
   * @param page 页数
   * @param limit  每页显示
   */
  //获取项目名称
  getProjectList(projectname,page,limit){
    return new Promise((resolve,reject) => {
      util.postAjax({
        code:global.code,
        url:"/user/projectList",
        data:{
          params: JSON.stringify(
            {
              projectname:projectname ? projectname : null,
              page:page,
              limit:limit
            }
          )
        }
      }).then(res => {
        if(res.success == true){
          resolve (res) ;
        }else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      });
    })
  },

  //获取温网室资源类型详情
  getResTypeDetail(id,object){
    /*console.log(id);
    console.log(object);*/
    util.postAjax({
      code:global.code,
      url:"/sprestype/findById",
      data:{
        id:id
      }
    }).then(res => {
      if(res.success == true){
        object=res.item;
        sessionStorage.setItem("resTypeDetail",JSON.stringify(res.item))
      }
    });
  },

  //获取温网室资源类型详情
  getResTypeDetail2(id){
    // console.log(id);
    return new Promise((resolve,reject) => {
      util.postAjax({
        code:global.code,
        url:"/sprestype/findById",
        data:{
          id:id
        }
      }).then(res => {
        if(res.success == true){
          let resTypeDetail=res.item;
          this.chargecycleFormatter(resTypeDetail.chargecycle,resTypeDetail);
          this.chargetypeFormatter2(resTypeDetail.chargetype,resTypeDetail);
          resolve (resTypeDetail) ;
        }else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      });
    })

  },

  //单个规则配置
  findRule(code){
    return new Promise((resolve,reject) => {
      util.postAjax({
        code:global.code,
        url:"/rules/findByCode",
        data:{
          code:code
        }
      }).then(res => {
        if(res.success){
          resolve(res)
        }else{
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },



  //获取温网室资源类型列表
    resTypeList(){
    return new Promise((resolve,reject)=>{
      util.postAjax({
        code:global.code,
        url:"/sprestype/list",
      }).then(res => {
        if(res.success == true){
          options.resTypeList=res.items;
          resolve(res)
        }else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      });
    })

  },

  //泵水资源状态样式变化
  statusColor(row, column, cellValue){
    switch (cellValue) {
      case "0":
        return "status-purple";
        break;
      case "1":
        return "status-orange";
        break;
      case "2":
        return "status-grey";
        break;
      case "3":
        return "status-green";
        break;
      case "7":
        return "status-black";
        break;
      case "8":
        return "status-red";
        break;
      case "9":
        return "status-blue";
        break;
    }
  },


  //表格内状态格式转化
  statusFormatter(row, column, cellValue) {
    switch (cellValue) {
      case "0":
        return "草稿";
        break;
      case "1":
        return "审批中";
        break;
      case "2":
        return "未接收";
        break;
      case "3":
        return "已完成";
        break;
      case "8":
        return "已驳回";
        break;
      case "9":
        return "已撤回";
        break;
    }
  },

  //资源申请单入驻状态
  applyLiveStatusFormatter(row, column, cellValue) {
    switch (cellValue) {
      case "0":
        switch (row.usetype) {
          case "1":
          case "2":
            return "未入驻";
            break;
          case "3":
            return "未退出";
            break;
        }
        break;
      case "1":
        switch (row.usetype) {
          case "1":
          case "2":
            return "已入驻";
            break;
          case "3":
            return "已退出";
            break;
        }
        break;
    }
  },

  //温网室资源状态样式变化
  actionColor(row, column, cellValue){
    switch (cellValue) {
      case "0":
        switch (row.usetype) {
          case "1":
          case "2":
            return "status-grey";
            break;
          case "3":
            return "status-blue";
            break;
        }
        break;
      case "1":
        switch (row.usetype) {
          case "1":
          case "2":
            return "status-green";
            break;
          case "3":
            return "status-orange";
            break;
        }
        break;
    }
  },



  //表格内状态格式转化&资源申请单状态
  processFormatter(row, column, cellValue) {
    switch (cellValue) {
      case "0":
        return "草稿";
        break;
      case "1":
        return "单位领导审批中";
        break;
      case "2":
        return "白马办审批中";
        break;
      case "3":
        return "已完成";
        break;
      case "7":
        return "系统退回";
        break
      case "8":
        return "已驳回";
        break;
      case "9":
        return "已撤回";
        break;
    }
  },

  //入驻状态格式转化
  useStateFormatter(row, column, cellValue) {
    switch (cellValue) {
      case "1":
        return "空闲";
        break;
      case "2":
        return "未入驻";
        break;
      case "3":
        return "已入驻";
        break;
      case "4":
        return "已退出";
        break;
      case "5":
        return "申请中";
        break;
    }
  },

  //温网室资源状态样式变化
  useColor(row, column, cellValue){
    switch (cellValue) {
      case "1":
        return "status-purple";
        break;
      case "2":
        return "status-blue";
        break;
      case "3":
        return "status-green";
        break;
      case "4":
        return "status-orange";
        break;
      case "5":
        return "status-grey";
        break;
    }
  },

  //维修状态转化
  repairStateFormatter(row, column, cellValue) {
    switch (cellValue) {
      case "1":
        return "待维修";
        break;
      case "2":
        return "已维修";
        break;
    }
  },

  //维修状态样式转化
  repairColor(row, column, cellValue){
    switch (cellValue) {
      case "2":
        return "status-green";
        break;
      case "1":
        return "status-orange";
        break;
    }
  },


  //资源申请类型
  useTypeFormatter(row, column, cellValue) {
    switch (cellValue) {
      case "1":
        return "入驻";
        break;
      case "2":
        return "续租";
        break;
      case "3":
        return "退出";
        break;
    }
  },


  //缴费状态格式转化
  payFormatter(row, column, cellValue) {
    switch (cellValue) {
      case "1":
        return "未支付";
        break;
      case "2":
        return "已支付";
        break;
    }
  },


  //入驻是否开启格式转化
  resStateFormatter(row, column, cellValue) {
    switch (cellValue) {
      case "1":
        return "开启";
        break;
      case "2":
        return "关闭";
        break;
    }
  },

  //维修状态样式转化
  liveinColor(row, column, cellValue){
    switch (cellValue) {
      case "1":
        return "status-green";
        break;
      case "2":
        return "status-orange";
        break;
    }
  },

  //单价计算周期格式转换
  chargecycleFormatter(type,object){
 /*   console.log("type",type);
    console.log("object",object);*/
    switch (type) {
      case "3":
        object.chargecycle= "年";
        break;
      case "1":
        object.chargecycle= "天";
        break;
      case "2":
        object.chargecycle= "月";
        break;
    }
  },

  chargecycleFormatter2(arr){
    arr.forEach(v=>{
      switch (v.chargecycle){
        case "1":
          v.chargecyclename="天";
          break;
        case "2":
          v.chargecyclename= "月";
          break;
        case "3":
          v.chargecyclename= "年";
          break;
      }
    })
  },


  //单价计算l类型格式转换
  chargetypeFormatter(type,object){
    switch (type) {
      case "1":
        object.chargetype= "面积";
        break;
      case "2":
        object.chargetype= "房间";
        break;
    }
  },

  chargetypeFormatter2(type,object){
    switch (type) {
      case "1":
        object.chargetype= "m²";
        break;
      case "2":
        object.chargetype= "间";
        break;
    }
  },

  payTypeFormatter(row, column, cellValue){
    switch (cellValue) {
      case "1":
        return "水费";
        break;
      case "2":
        return "电费";
        break;
    }
  },

  //表格内时间格式转化
  timeFormatter(row, column, cellValue) {
    if (cellValue == null) {
      return "--"
    } else {
      return this.util.formatTime(cellValue, "yyyy.MM.dd hh:mm:ss")
    }
  },

  //每隔三位小数加逗号
  add_comma_toThousands(num) {
  var num = (num || 0).toString();
  var result = '';
  while (num.length > 2) {
    result = ':' + num.slice(-2) + result;
    num = num.slice(0, num.length - 2);
  }
  if (num) { result = num + result; }
  return result;
},


  //手机验证
  isPoneAvailable(phone) {
    var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!myreg.test(phone)) {
      return false;
    } else {
      return true;
    }
  },



  //获取资源类型列表
  getResTypeList() {
    util.postAjax({
      code: global.code,
      url: "/irres/typeList",
    }).then(res => {
      if (res.success == true) {
        // this.typeList = res.items;
        sessionStorage.setItem("typeList", JSON.stringify(res.items));
        // console.log("typeList22", res.items);
      }

    })
  },

  //获取资源编号列表
  getResCodeList() {
    util.postAjax({
      code: global.code,
      url: "/irres/list",
      data: {
        params: JSON.stringify({})
      }
    }).then(res => {
      if (res.success == true) {
        // this.codeList = res.items;
        sessionStorage.setItem("codeList", JSON.stringify(res.items));
      }
    })
  },


  //获取教职工列表
  getjzgList(key){
    return new Promise((resolve,reject) => {
      util.postAjax({
        code:global.code,
        url:"/user/userList",
        data:{
          key:key
        }
      }).then(res => {
        if(res.success == true){
          resolve (res) ;
        }else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      });
    })
  },



  //获取学院列表
  getGroupList() {
    util.postAjax({
      code: global.code,
      url: "/user/orgList",
    }).then(res => {
      if (res.success == true) {
        // this.codeList = res.items;
        sessionStorage.setItem("groupList", JSON.stringify(res.items));
      }
    })
  },

  getGroupList2(key){
    return new Promise((resolve,reject) => {
      util.postAjax({
        code: global.code,
        url: "/user/orgList",
        data:{
          key:key
        }
      }).then(res => {
        if(res.success == true){
          resolve (res) ;
        }else {
          reject(res)
        }
      }).catch(err => {
        reject (err)
      })
    })
  },

  //返回
  back(){
    window.history.go(-1);
  },

  //指定日期加上多少天，加多少月，加多少年的日期
  /*
      *   功能:实现VBScript的DateAdd功能.
      *   参数:interval,字符串表达式，表示要添加的时间间隔.
      *   参数:number,数值表达式，表示要添加的时间间隔的个数.
      *   参数:date,时间对象.
      *   返回:新的时间对象.
      *   var   now   =   new   Date();
      *   var   newDate   =   DateAdd( "d ",5,now);
      *---------------   DateAdd(interval,number,date)   -----------------
      */
  DateAdd(interval,number,date) {
    // console.log("date",interval);
    // debugger

    switch(interval){
      case "y" :
        date.setFullYear(date.getFullYear()+number);
        return   date;
        break;
      case "q":
        date.setMonth(date.getMonth()+number*3);
        return   date;
        break;

      case "M":
        date.setMonth(date.getMonth()+number);
        return   date;
        break;

      case   "w":
        date.setDate(date.getDate()+number*7);
        return   date;
        break;

      case "d":
        date.setDate(date.getDate()+number);
        return   date;
        break;

      case "h":
        date.setHours(date.getHours()+number);
        return   date;
        break;

      case "m":
        date.setMinutes(date.getMinutes()+number);
        return   date;
        break;

      case "s":
        date.setSeconds(date.getSeconds()+number);
        return   date;
        break;

      /*default   :
        date.setDate(date.getDate()+number);
        return   date;
        break;*/

    }
  },

  getSeriesLists() {
    this.getResTypeList();
    this.getResCodeList();
    this.getGroupList();
  },

  // dom导出为pdf
  transToPdf(title, domID, _this) {
    const loading = _this.$loading({
      lock: true,
      text: '下载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    let element = document.getElementById(domID); // 这个dom元素是要导出pdf的div容器
    html2Canvas(element).then(function(canvas) {
      var contentWidth = canvas.width;
      var contentHeight = canvas.height;

      //一页pdf显示html页面生成的canvas高度;
      var pageHeight = contentWidth / 592.28 * 841.89;
      //未生成pdf的html页面高度
      var leftHeight = contentHeight;
      //页面偏移
      let position = 0;
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      var imgWidth = 555.28;
      var imgHeight = 592.28 / contentWidth * contentHeight;

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
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
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
      _this.isDomShow = false;
    });
  }
}
