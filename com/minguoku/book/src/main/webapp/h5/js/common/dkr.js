
(function() {

    //定义对象命名空间
    var dkr = {};

    // 公共基础方法模块
    dkr.util = {};

    /**
     * 链式调用所用对象
     * @class AjaxObj
     * @namespace Util
     */
    dkr.util.AjaxObj = function() {
        var obj = {};

        obj.done = function(callback) {
            if (callback) this._done = callback;
            return this;
        };

        obj.fail = function(callback) {
            if (callback) this._fail = callback;
            return this;
        };

        obj.empty = function(callback) {
            if (callback) this._empty = callback;
            return this;
        };

        return obj;
    };

    /**
     * [post description]
     * @param  {[type]} url  [请求]
     * @param  {[type]} data [接口数据]
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    dkr.util.post = function(url, data, type) {
        type = type || 'json';
        return $.ajax({
          url: url,
          //   contentType: "application/json;charset=utf-8",
          //   data: data || {},
          contentType: data.isPayLoadStringify
            ? 'application/json'
            : 'application/x-www-form-urlencoded;charset=UTF-8',
          data: data.isPayLoadStringify ? JSON.stringify(data) : data,
          dataType: type || 'json',
          type: 'POST',
        //   xhrFields: {
        //     withCredentials: true,
        //   },
        //   crossDomain: true,
        });
    };

    /**
     * 公用的post请求
     * @param  {[type]} url请求
     * @return {[type]}
     */
    dkr.util.ajaxPost = function(url, param) {
        var obj = new dkr.util.AjaxObj();

        dkr.util.post(url, param)
            .done(function(data) {
                setTimeout(function() {
                    if (data) {
                    	obj._done && obj._done(data);
//                      if (data.errcode === '0') {
//                          obj._done && obj._done(data);
//                      } else {
//                          // obj._fail && obj._fail(data.message);
//                          // layer.msg(data.message, {
//                          //     offset: 't',
//                          //     anim: 6
//                          // });
////                          layer.open({
////                              content: data.errmsg,
////                              style: 'background:#f00',
////                              skin: 'msg',
////                              time: 1.5
////                          })
//                      }
                    } else {
                        obj._done && obj._done(data.errmsg);
                    }
                }, 0);
            })
            .fail(function(data) {
                setTimeout(function() {
                    obj._fail && obj._fail(data.errmsg);
                }, 0);
            });
        return obj;
    };

    /**
     * 获取URL中的参数值(单个)
     * @param  {String} name 参数名
     * @return {String} 参数值，若没有该参数，则返回''
     */
    dkr.util.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
            r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return '';
    };


    /**
     * 获取URL中的参数值(多个)
     * @return {String} 参数值，以对象的形式返回，若没有该参数，则返回''
     */
    dkr.util.GetRequest = function() {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    };

    /**
     * [valid 验证输入信息]
     * @param  {[type]} param      [参数]
     * @param  {[type]} validRules [验证规则]
     * @return {[type]}            [输入是否合法]
     */

    dkr.util.valid = function(param, validRules) {
        var flag = true,
            tip = '';

        var $input = $('input[name][type="text"],input[name][type="password"],input[name][type="date"],textarea[name],input[name][type="hidden"],select[name]');
        for (var i = 0; i < $input.length; i++) {
            var current = $input.eq(i).get(0),
                name = current.name,
                type = current.type;

            if (name in validRules && name in param) {
                var rule = validRules[name];
                // 验证不能为空
                if ('require' in rule) {
                    if (rule.require) {
                        if (type !== 'password' && $.trim(param[name]) === '') {
                            tip = rule.emptyTip || '请输入内容'
                            flag = false;
                        }

                        if (type === 'password' && param[name] === '') {
                            tip = rule.emptyTip || '请输入内容'
                            flag = false;
                        }

                        //验证下拉框
                        if (type === 'select-one' && param[name] === '请选择') {
                            tip = rule.emptyTip || '请输入内容'
                            flag = false;
                        }

                    } else {
                        if (param[name] === '') {
                            continue;
                        }
                    }
                } else {
                    if (param[name] === '') {
                        continue;
                    }
                }

                // 验证特殊字符
                if (flag) {
                    var keyword = ['alert', 'javascript', 'document', 'select', 'order', 'union', 'script', 'from', 'delete', '<', '>', '&'];

                    for (var j = 0, max = keyword.length; j < max; j++) {
                        var reg = new RegExp(keyword[j], 'g');
                        if (param[name].match(reg)) {
                            tip = '不允许输入特殊字符'
                            flag = false;
                            break;
                        }
                    }
                }

                // 验证正则表达式
                if (flag && 'pattern' in rule && !param[name].match(rule.pattern)) {
                    tip = rule.tip || '内容格式不符合要求';
                    flag = false;
                }

                if (flag === false) {
                    layer.open({
                        content: tip,
                        style: 'background:#f00',
                        skin: 'msg',
                        time: 1.5
                    })

                    break;
                }
            }
        }

        return flag;
    };

    /**
     * [getLineNum 数据分行]
     * @param  {[type]} $strlen [返回数据长度]
     * @param  {[type]} $data   [data]
     * @param  {[type]} $n      [一行多少数据]
     * @return {[type]}         [description]
     */
    dkr.util.getLineNum = function($strlen, $data, $n) {
        var arr = [];

        //数据处理分页
        for (var i = 0, s = $strlen; i < s / $n; i++) {
            var col = [];
            var len = i * $n + $n >= strlen ? strlen : i * $n + $n;

            for (var j = i * $n; j < len; j++) {
                col.push($data[j])
            }
            arr.push(col);
        }

        //返回数组
        return arr;
    },

    /**
     * [getRandomNum 获取随机字符串]
     * @return {[type]} [description]
     */
    dkr.util.getRandomNum = function() {
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz23456789';
        var maxPos = chars.length;　　
        var pwd = '';　　
        for (i = 0; i < 16; i++) {　　　　
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));　　
        }　　
        return pwd;
    };

    /**
     * [toUtf8 转字符串的支持中文格式]
     * @param  {[type]} str [带转化的字符串]
     * @return {[type]}     [description]
     */
    dkr.util.toUtf8 = function(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    };

    //开始微信端的验证方法
    dkr.util.getAuth = function(userid, publicid) {
        var myDate = new Date();
        var time = myDate.getTime();
        var xx = time.toString();
        var newstr = xx.substring(0, xx.length - 3);
        var j = parseInt(newstr);

        var md5 = hex_md5("182561f33901491fb66d57ad29a39f0f" + "f0ec4b456d8e4f018169498dd3d5941f" + newstr);

        var PostData = {
            "product": "f0ec4b456d8e4f018169498dd3d5941f",
            "version": "1.0",
            "timestamp": j,
            "token": md5,
            "userid": userid,
            "publicid": publicid
        };
        var json_data = PostData;
        return json_data;
    };


    /**
     * [dataDiff 根据日期计算天数]
     * @param  {[type]} startTime [开始时间]
     * @param  {[type]} endTime   [结束时间]
     * @return {[type]}           [description]
     */
    dkr.util.dataDiff = function(startTime,endTime) {
        var beginDate = new Date(startTime.replace(/-/g, "/"));  
        //结束日期  
        var endDate = new Date(endTime.replace(/-/g, "/"));  
        //日期差值,即包含周六日、以天为单位的工时，86400000=1000*60*60*24.  
        var workDayVal = (endDate - beginDate)/86400000 + 1;  
        //工时的余数  
        var remainder = workDayVal % 7;
        //工时向下取整的除数  
        var divisor = Math.floor(workDayVal / 7);  
        var weekendDay = 2 * divisor;  
          
        //起始日期的星期，星期取值有（1,2,3,4,5,6,0）  
        var nextDay = beginDate.getDay();  
        //从起始日期的星期开始 遍历remainder天  
        for(var tempDay = remainder; tempDay>=1; tempDay--) {  
            //第一天不用加1  
            if(tempDay == remainder) {  
                nextDay = nextDay + 0;  
            } else if(tempDay != remainder) {  
                nextDay = nextDay + 1;  
            }  
            //周日，变更为0  
            if(nextDay == 7) {  
                nextDay = 0;  
            }  
          
            //周六日  
            if(nextDay == 0 || nextDay == 6) {  
                weekendDay = weekendDay + 1;  
            }  
        }  
        //实际工时（天） = 起止日期差 - 周六日数目。  
        workDayVal = workDayVal - weekendDay;

        return workDayVal;  
    };

     //加载下拉框数据
    dkr.util.loadDropList =  function(url,id,str_type,Id_code) {
        var param = {
                auth:JSON.stringify(dkr.util.getAuth('','')),
                data:JSON.stringify({ "filter":{"SEARCH":false,"CODE":str_type}})
            };
        dkr.util.ajaxPost(url,param).done(function(res) {
            var str = '';

            //下拉框数据
            
            for (var i = 0; i < res.items.length; i++) {
                  if(res.items[i].CODE == Id_code) {
                    str += '<option selected="selected" value="' + res.items[i].CODE +'" name="' + res.items[i].NAME + '">' + res.items[i].NAME + '</option>'
                }else {
                    str += '<option value="' + res.items[i].CODE + '" name="' + res.items[i].NAME + '">' + res.items[i].NAME + '</option>'
                }
            }

            // return str;
            $('#'+id).append(str);
        }).fail(function() {
            console.log("error");
        })
    },

    window.dkr = dkr;
})(window)
