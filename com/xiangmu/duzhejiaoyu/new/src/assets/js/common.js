import options from "./options";
import util from "./util";
import global from "./global";
import store from "../../store";
import { Message, Loading } from "element-ui"
import BigDecimal from "js-big-decimal"
import el from "element-ui/src/locale/lang/el";
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

  // 获取题目分类下拉列表
  getClassifyList() {
    return new Promise((resolve,reject) => {
      util.postAjax({
        code:global.code,
        url:"/qusetclass/list"
      })
      .then( res => {
        if(res.success == true){
          resolve (res);
        }else{
          reject (res);
        }
      }).catch(err => {
      reject (err)
    });
    })
  },

  //用户维护内提交角色
  saveRole(res,form){
    return new Promise((resolve,reject)=> {
      util.postAjax({
        code:global.authCode,
        url:"/User/saveUserRole",
        data:{
          data:JSON.stringify({
              ROLEID:form.ROLEID.toString(),
              USERID:res.ID,
          })
      }
      }).then( res => {
        if(res.success){
          resolve (res);
        }else{
          reject (res)
        }
      }).catch(err => {
        reject (err)
      })
    })
  },

  // 获取当前用户详情
  getCurrentUser(row){
    return new Promise((resolve,reject)=> {
      util.postAjax({
        code:global.authCode,
        url:"/User/userDetail",
        data:{
          ID:row.ID
        }
      }).then( res => {
        if(res.success){
          resolve (res);
        }else{
          reject (res)
        }
      }).catch(err => {
        reject (err)
      })

    })
  },

   //获取校区列表接口
   getCampusList() {
    return new Promise((resolve,reject) => {
      util.postAjax({
        code:global.code,
        url: "/campus/list",
      }).then( res => {
        if(res.success){
          resolve (res);
        }else{
          reject (res)
        }
      }).catch(err => {
        reject (err)
      })
    })
  },

  //获取校区列表接口
  getUserTypes() {
    return new Promise((resolve,reject) => {
      util.postAjax({
        code:global.code,
        url: "/user/readerType",
      }).then( res => {
        if(res.success){
          resolve (res);
        }else{
          reject (res)
        }
      }).catch(err => {
        reject (err)
      })
    })
  },



  //学习资料类型转换
  fileTypeFormatter(row, column, cellValue) {
    switch (cellValue) {
      case 1:
        return "视频";
        break;
      case 2:
        return "文档";
        break;
      case 3:
        return "在线文章";
        break;  
    }
  },

  //学习资料是否下载转换
  showdownFormatter(row, column, cellValue) {
    if(cellValue){
      switch (cellValue) {
        case "0":
          return "否";
          break;
        case "1":
          return "是";
          break;
      }
    }else{
      return "--"
    }
    
  },
  
  //学习资料文件大小转换
  fileSizeFormatter(row, column, cellValue) {
   
    switch (row.fileType) {
      case 1:
        return (cellValue/1024/1024).toFixed(2)+"M";
        break;
      case 2:
        return (cellValue/1024/1024).toFixed(2)+"M";
        break;
      case 3:
        return cellValue+"kb";
        break;  
    }
  },



}
