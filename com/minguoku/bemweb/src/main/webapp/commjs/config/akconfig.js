/**
*解决ExtJS TreePanel 在IE9、IE10下报错：无法获取未定义或 null 引用的属性ui
*/
Ext.Element.prototype.getAttributeNS=(Ext.isIE&&!(document.documentMode === 9)&&!(document.documentMode === 10) ) ? function(ns, name){
        var d = this.dom;
        var type = typeof d[ns+":"+name];
        if(type != 'undefined' && type != 'unknown'){
            return d[ns+":"+name];
        }
        return d[name];
    } : function(ns, name){
        var d = this.dom;
        return d.getAttributeNS(ns, name) || d.getAttribute(ns+":"+name) || d.getAttribute(name) || d[name];
    };
/**
 * 解决谷歌浏览器grid多字段表格和sm错位 by:mufeng
 */
Ext.grid.ColumnModel.override({
    getTotalWidth: function(includeHidden) {
        var off = 0;
        if (Ext.isChrome) {
            off = 2;
        };
        if (!this.totalWidth) {
            this.totalWidth = 0;
            for (var i = 0, len = this.config.length; i < len; i++) {
                if (includeHidden || !this.isHidden(i)) {
                    this.totalWidth += this.getColumnWidth(i) + off;
                };
            };
        };
        return this.totalWidth;
    }
});
/**
 * 解决ie9不支持extjs对象的“createContextualFragment”属性或方法
 */
if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment){
    Range.prototype.createContextualFragment = function(html)
    {
        var frag = document.createDocumentFragment(), 
        div = document.createElement("div");
        frag.appendChild(div);
        div.outerHTML = html;
        return frag;
    }
}

//这个解决了时间控件在google浏览器上不可用的问题
if(Ext.isChrome===true){       
	var chromeDatePickerCSS = ".x-date-picker {border-color: #1b376c;background-color:#fff;position: relative;width: 185px;}";
	Ext.util.CSS.createStyleSheet(chromeDatePickerCSS,'chromeDatePickerStyle');
}

var teststr={
		ise:false
	};
teststr.tspace=0;


var MenuAuth={
	/**
	 * 预先设置所有受权限控制的按钮为不可用
	 */
	_setAllDisable : function(container) {
		var dolist = [ container ];
		while (dolist.length > 0) {
			var cd = dolist.pop();
			if (!Ext.isEmpty(cd.akfun)) {
				if (typeof cd.setDisabled == "function"){
					cd.setVisible(false);	
				}else{
					cd.hidden =true;
				}
			}
			// 获取当前控件的所有items加入到待处理
			if (!Ext.isEmpty(cd.items) && cd.items.each) {
				cd.items.each(function(item, index, len) {
					dolist[dolist.length] = item;
				});
			}
			// 获取当前控件的所有dockeditems加入到待处理
			if (typeof cd.getTopToolbar == "function") {
				var items = cd.getTopToolbar();
				if (items.items==null){
					for (var i = 0; i < items.length; i++) {
						dolist[dolist.length] = items[i];
					}
				}else{
					items.items.each(function(item, index, len) {
						dolist[dolist.length] = item;
					});
				}
			}
		}
	},
	
	/**
	 * 根据权限设置按钮是否可用
	 * 
	 * @container 要进行权限处理的父容器
	 * @funID 本容器涉及的功能ID,本来设计是功能ID数组，从目前代码看，已经退化成了只能传一个功能了
	 * @outCheckFun 外部判断按钮是否显示的函数
	 */
	checkAuth : function(container, funID,outCheckFun) {
		this._setAllDisable(container);
		if(typeof(funID)!='object'){
			funID=[funID]
		}
		funID=JSON.stringify(funID);
		Ext.Ajax.request({
			url:akconfig.url+'rest/Authc/getFunResAuth',
	 		method:'post',
	 		params:{funID:funID},
	 		success:function(response, options){
	 			var funAuth=Ext.util.JSON.decode(response.responseText);
	 			funAuth = funAuth.data;
				var dolist = [ container ];
				while (dolist.length > 0) {
					var cd = dolist.pop();
					// 如果本控件有exResCode属性，并且有相应权限数据则进行设置
					if (!Ext.isEmpty(cd.akfun)) {
						if (!Ext.isEmpty(funAuth[cd.akfun])){
							var isview=funAuth[cd.akfun];
							if (outCheckFun){
								isview=outCheckFun(cd);
							}
							if (typeof cd.setDisabled == "function"){
								cd.setVisible(isview);
//								cd.setDisabled(!funAuth[cd.akfun]);	
							}else{
								cd.hidden =!isview;
//								cd.disabled=!funAuth[cd.akfun];
							}
						}
					}
					// 获取当前控件的所有items加入到待处理
					if (!Ext.isEmpty(cd.items) && cd.items.each) {
						cd.items.each(function(item, index, len) {
							dolist[dolist.length] = item;
						});
					}
					// 获取当前控件的所有dockeditems加入到待处理
					if (typeof cd.getTopToolbar == "function") {
						var items = cd.getTopToolbar();
						if (items.items==null){
							for (var i = 0; i < items.length; i++) {
								dolist[dolist.length] = items[i];
							}
						}else{
							items.items.each(function(item, index, len) {
								dolist[dolist.length] = item;
							});
						}
					}
				}
			}
		});
	}
};

//1.0.0.0.0 先搞个URL
var akconfig={
	// url:"http://wxdev.angke.com.cn/platform/rest/",
// 	url:"http://160.255.0.208:80/jalis/rest/",
 	url:"http://160.255.0.158:8080/",
		//url:"http://paydev.angke.com.cn/jalis/rest/",
	// urlforswf:"http://wxdev.angke.com.cn/platform/",
	// _setAllDisable : function(container) {

	// 	// var dolist = [container];
		
	// 	for(var i=0;i<container.length;i++){
	// 		Ext.getCmp(container[i]).setVisible(false);
	// 	}
		
	// },
	checkAuth:function(funID){//权限控制 container按钮的数组ID 
		if(typeof(funID)!='object'){
			funID=[funID]
		}
		funID=JSON.stringify(funID);
		var buttons=Ext.select("table.ak-auth").elements;
		
		var buttonsComponent=[];
		
		for(var i=0;i<buttons.length;i++){
			//console.log(buttons[i].id);
			 buttonsComponent[i]=Ext.getCmp(buttons[i].id);
			 Ext.getCmp(buttons[i].id).setVisible(false);
		}
		Ext.Ajax.request({
			url:akconfig.url+'rest/Authc/getFunResAuth',
	 		//url:'../../rest/main/getFunResAuth',
	 		// url:urls+'user/getFunResAuth',
	 		//url:'../../rest/main/getFunResAuth',
	 		method:'post',
	 		params:{funID:funID},
	 		success:function(response, options){
	 			var json = eval('(' + response.responseText + ')');
	 
	 			for(var i=0;i<buttonsComponent.length;i++){
					
					Ext.getCmp(buttons[i].id).setVisible(json.data[buttonsComponent[i].akfun]);
					//console.log(buttonsComponent[i].akfunID);
	 				//if(!Ext.isEmpty(json[buttonsComponent[i].akfunID]) && !Ext.isEmpty(json[buttonsComponent[i].akfunID][buttonsComponent[i].akfun])){
	 				//	buttonsComponent[i].setVisible(json[buttonsComponent[i].akfunID][buttonsComponent[i].akfun])
	 				//}
	 			}
	 			
	 		}
	 	});
	 // console.log(Ext.select('*').elements) // select * 和select xxx返回的对象不一样
	 // for(var i=0;i<Ext.select('*').elements.length;i++){
	 // 	if(typeof Ext.select('*').elements[i]=='object'){
	 // 		console.log(Ext.select('*').elements[i])
	 // 	}
	 // }
	},
	mask:function(str){
		Ext.getBody().mask(str);
	},
	unmask:function(){
		Ext.getBody().unmask();
	},
	GetQueryString:function(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
}
//1.0.0.0.1 再来个报错提示

//extjs ajax请求报错处理
//Ext.MessageBox.minWidth=300;
function errbyextjs(response){
 	var json = eval('(' + response.responseText + ')'); 
                   
	if(!json.success){
   
    	return false;
	}
	return true;
}
//function akwindowclose(){
//	window.close();
//}
//1.0.2 添加Ajax报错提示
//Ext.Ajax请求全局设置
//Ext.namespace('extex');
//extex.checkResponseAndSession = function(conn,response, options) {
//	var str = response.responseText;
//	//判断没有登录的情况
//	if (str.indexOf("{\"login\":false") > -1){
//		location.reload();
//		return;
//	}
//	//判断出错的情况
//	var json = eval('(' + response.responseText + ')');
//	if(!json.success&&json.success!=undefined){
//		Ext.Msg.alert('提示！',json.errInf.metailBusInf);
//	}
//};
Ext.namespace("FrameWork.index");
FrameWork.index.ErrHandler={
		
		addMask:function(){
			var th=FrameWork.index.ErrHandler;
			th.masked=th.masked+1;
			if (th.masked==1){
				Ext.getBody().mask("正在跟服务端交互数据，请稍等...");
//				Ext.MessageBox.wait("正在跟服务端交互数据...","提示");
			}
		},
		delMask:function(){
			var th=FrameWork.index.ErrHandler;
			th.masked=th.masked-1;
			if (th.masked<=0){
				Ext.getBody().unmask();
				th.masked=0;
			}
		},
	
	
		/**
		 * 通过请求的返回,判断当前客户端是否登录或session已经超时
		 */
		_isWantLogin:function(str){
			return str.indexOf("{\"login\":false") > -1;
		},
			
		/**
		 * 重定向自己或父界面到登录界面
		 */
		redirectToLogin:function(){
//			//可能存在跨域问题，刷不了父界面，只能刷新自己
////		location.reload(true);//true表示不走缓存
			var p=window;
//			if(p.parent){
//				p=p.parent;
//			}
			var purl=akconfig.allUrl;//+"/"+FrameWork.urlRoot;
			p.location.href=akconfig.url+'rest/Idsclient/reqLogin?reqUrl='+encodeURIComponent(purl);
//			FrameWork.index.Login.show(FrameWork_currentUserLoginName, option,response);
		},
		
		/**
		 * 判断当前客户端是否需要再登录,如果不需要再检查返回值是否有出错信息
		 */
		checkResAndLogin:function(response) {
			FrameWork.index.ErrHandler.delMask();
			var str=response;
			if (response.responseText){
				str = response.responseText;
			}
			if (FrameWork.index.ErrHandler._isWantLogin(str)){
				FrameWork.index.ErrHandler.redirectToLogin();
				return false;
			} else {
				var options=response.argument!=null?response.argument.options:null;
				return FrameWork.index.ErrHandler._checkRes(response,options);
			}
		},
		
//		/**
//		 * 通过response返回的内容处理错误，如果不能返回false
//		 */
//		_processSuccFalse : function(conn, response, options) {
//			var res = {
//				processed:false
//			};
//			if (!Ext.isEmpty(response) && !Ext.isEmpty(response.responseText)) {
//				var errorData = null;
//				try {
//					var data = Ext.JSON.decode(response.responseText);
//				} catch (e) {
//				}
//				if (!Ext.isEmpty(data) && !Ext.isEmpty(data.success)) {
//					res.data=data;
//					res.processed = true;
//					if (data.success == false) {// 处理登录超时
//						if (data.login == false) {
//							this.redirectToLogin();
//						} else if (!Ext.isEmpty(data.teststr)) {// 处理编码
//							this._processEnc(conn,response, data, options);
//						} else {// 处理错误
//							FrameWork.comm.ErrMessDialog.show(data.errInf);
//						}
//					}
//				}
//			}
//			return res;
//		},

		
		
		_processEnc:function(conn,response, errorData, options) {
			teststr = errorData.teststr;// 更新编码参数
			teststr.tspace=teststr.str3-((new Date()).valueOf());//更新时间差
			// 判断一下是否已经重试过N次了，如果是则报错
			if (!Ext.isEmpty(options.exRetryTimes) && options.exRetryTimes > 7) {
				var str = "与服务器交互发生未预料到的错误，请于客服人员沟通。";
				var err={
						code:"NM0001",
						type:2,
						shortBusInf:str,
						metailBusInf:str
				};
				FrameWork.comm.ErrMessDialog.show(err);
			} else {
				options.exRetryTimes = Ext.isEmpty(options.exRetryTimes) ? 0 : (options.exRetryTimes + 1);
				if (teststr.ise == true) {// 恢复原来的未编码参数
					options.params = options.exOrgiParas;
				}
				//发起重新提交前把callback备份起来，并置空
//				options.callbackbk=options.callback;
//				options.callback=null;
				Ext.Ajax.request(options);// 重新提交
			}
		},
		
		/**
		 * 检查返回值中是否返回不成功,如果不成功弹出错误
		 * 		本方法同时给通过script标签方法与服务器交互使用,在服务器端需要返回类似如下信息:
		 * 		FrameWork.index.ErrHandler.checkRes({success:false,errInf:*});
		 */
		_checkRes:function(response,options) {
			var str=response;
			if (response.responseText){
				str = response.responseText;
			}
			var msg;
//			try {
				if (typeof(str) == "string"){
					msg = Ext.util.JSON.decode(str);
				}else if (typeof(str) == "object"){
					msg = str;
				}else{//如果返回值为空,那么也算是成功
					return true;
				}
				if (msg.success == false) {
//					FrameWork.index.ErrHandler.delMask();
					if (!Ext.isEmpty(msg.teststr)) {// 处理编码
						this._processEnc(null,response, msg, options);
						return false;
					}else{
						FrameWork.comm.ErrMessDialog.show(msg.errInf);
						return false;
					}
//					try{
//						Ext.MessageBox.hide();
//					}catch(ex){};
//					return true;
				}
//			} catch (e) {
//			}
			return true;
		},
		
		masked:0,
		
		iniCheckAjax:function(){
			//所有ajax请求都校验是否登录
			Ext.override(Ext.data.Connection, { 
//			    request : Ext.data.Connection.prototype.request.createSequence(function(options,v2,v3){ 
//			    	options.headers={xcu:"1"};
//			    }),
				handleResponse : Ext.data.Connection.prototype.handleResponse.createInterceptor(
						FrameWork.index.ErrHandler.checkResAndLogin
				)
			});
//			Ext.Ajax.on("requestcomplete", function(conn, response, option) {
//				FrameWork.index.ErrHandler.checkResAndLogin(response, option);
//			});
			//只有基于Ext.Ajax类发出的请求才检查错误，比如即时消息用的是Ext.data.Connection,错误自己处理
			
//			Ext.Ajax.on('requestcomplete', function(conn, response, options) {
//				var res=FrameWork.index.ErrHandler._processSuccFalse(conn, response, options);
//				if (res.processed==true && res.data.success==false){
//					return false;
//				}else{
//					if (!Ext.isEmpty(options.callbackbk)){//发起重新的请求前把callback函数备份在了callbackbk，要恢复回去
//						options.callback=options.callbackbk;
//					}
//					return true;
//				}
//			});
			var _produceRandomStr=function(){
				var dtstr=(Math.random()*10000).toString(16).replace(".","");
				dtstr=dtstr+(Math.random()*10000).toString(16).replace(".","");
				return dtstr;
			};

			Ext.Ajax.on('beforerequest', function(conn, options, eOpts) {
				if (!Ext.isEmpty(teststr) && teststr.ise == true) {
					if (Ext.isEmpty(options.params)){
						options.params={};
					}
					if (typeof(options.params) == "string"){
						options.params={
							_strPara:options.params
						};
					}
				}
				if (!Ext.isEmpty(teststr) && teststr.iscr == true) {
					if (options.params==null || typeof(options.params) == "string"){
						var ex="exAt="+((new Date()).valueOf()+teststr.tspace);
						ex=ex+"&exStr="+_produceRandomStr();
						options.params=options.params==null?ex:options.params+"&"+ex;
					}else{
						options.params.exAt=(new Date()).valueOf()+teststr.tspace;
						options.params.exStr=_produceRandomStr();
					}
				}
				if (!Ext.isEmpty(teststr) && teststr.ise == true) {
					var decstr = options.params;
					if (typeof(options.params) != "string"){
						decstr = Ext.util.JSON.encode(options.params);
					}
					var iv = CryptoJS.enc.Utf8.parse(teststr.str1);
					var key = CryptoJS.enc.Utf8.parse(teststr.str2);
					var srcs = CryptoJS.enc.Utf8.parse(decstr);
					var estr = CryptoJS.AES.encrypt(srcs, key, {
						iv : iv,
						mode : CryptoJS.mode.CBC
					});
					options.exOrgiParas = options.params;// 备份编码前的参数
					options.params = {
						para : estr.toString()
					};
				} else {
					options.exOrgiParas = options.params;// 备份编码前的参数
					// options.params.isAjax = true;
				}
			});
			
			
			Ext.Ajax.on("beforerequest",function(conn, options){
				var th=FrameWork.index.ErrHandler;
				th.addMask();
			});
//			Ext.Ajax.on("requestcomplete",function(conn, options){
//				var th=FrameWork.index.ErrHandler;
//				th.delMask();
//			});
//			Ext.Ajax.on("requestexception",function(conn, options){
//				var th=FrameWork.index.ErrHandler;
//				th.delMask();
//			});
			
			Ext.Ajax.on("requestexception", function(conn, response, option) {
//				try {
//					Ext.MessageBox.hide();
//				}catch(ex) {}
				var mess="HTTP"+response.status+"("+response.statusText+")-网络连接出错或该链结不存在,请确认本机网络是否正常或联系管理员!"
					+"\n 链结返回:"+response.status
					+"\n 相关访问链结为:"+option.url+"\n"+response.responseText;
				var err={
					code:"NM0000",
					type:2,
					shortBusInf:mess,
					metailBusInf:mess
				};
//				FrameWork.comm.ErrMessDialog.show(err);
			});
		}
//		/**
//		 * iframe刷新后，检查iframe中session是否已经过期并重定向到统一认证了
//		 */
//		checkIframeSession:function(tframe){
//			setTimeout(function () {
//				console.log(tframe.contentWindow.document.state);
//				if (tframe.contentWindow.document.URL.indexOf("idsweb")>0){
//		        	FrameWork.index.ErrHandler.redirectToLogin();
//		        }else{
//					Ext.getBody().unmask();
//		        }
//			}, 1000);
//
//		}

		
}


FrameWork.index.globini=function(){
	//获取当前网址，如： http://localhost:8083/testweb/abc/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： testweb/abc/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/testweb
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    akconfig.url=projectName+"/";
    akconfig.authurl = localhostPaht+'/authweb/';
    akconfig.resturl=akconfig.url+"test/rest/";
    akconfig.allUrl=curWwwPath;
	
  //设置s.gif的本地路径，防止tree等组件显示时访问extjs官网的s.gif
    Ext.BLANK_IMAGE_URL="/commjs/resources/images/default/s.gif";
    Ext.QuickTips.init();
	Ext.Ajax.timeout=2000000;//默认超时2分钟
	//set BasicForm's time out
	FrameWork.index.ErrHandler.iniCheckAjax();
//	Ext.Ajax.on("requestcomplete", function(conn, response, option) {
//		extex.checkResponseAndSession(conn,response, option);
//	});
//	
//	Ext.Ajax.on("requestexception", function(conn, response, option) {
//		Ext.Msg.alert('提示！','网络错误码为：'+response.status);//简单处理网路报错
//	});
}
FrameWork.index.globini();



Ext.namespace("FrameWork.comm.ErrMessDialog");
FrameWork.comm.ErrMessDialog={
	
	show:function(para){
		var icopanel=new Ext.Panel({
			region:"west",
			width:80,
			html:"图标"
		});
		var shortpanel=new Ext.form.TextArea({
			region:"center",
			readOnly:true
		});
		
		var toppanel=new Ext.Panel({
			region:"north",
			height:80,
			layout:"border",
			border:false,
			items:[icopanel,shortpanel]
		}); 
		
		var detailpanel=new Ext.form.TextArea({
			region:"center",
			readOnly:true,
			border:false
		});
	
		var win=new Ext.Window({
			layout:'border',
			title:'提示',
			width:500,
			height:135,
			closable:true,
			closeAction:'hide',
			maximizable:true,
			modal:true,
			tbar:[{
				text:"关闭",
				iconCls:'submit',
				handler:function(){
					win.close();
				},
				scope:win
			},{
				text:"详细信息",
				iconCls:'detail',
				handler:function(th,ev){
					if (th.para==1){
						win.setHeight(500);
						th.setText("收起详细");
						th.para=2;
					}else{
						win.setHeight(135);
						th.setText("详细信息");
						th.para=1;
					}
					
				},
				scope:win,
				para:1
			}],
			items:[toppanel,detailpanel]
		});
		win.render(Ext.getBody());
		
		shortpanel.setValue(para.shortBusInf);
		detailpanel.setValue(para.metailBusInf);
		if (para.type==1){
			icopanel.body.dom.innerHTML="<div align='center' class='errdialog_err'></div>";
		}else{
			icopanel.body.dom.innerHTML="<div align='center' class='errdialog_wran'></div>";
		}
		
		win.show();
	}
		
		
		
}

    if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment)
    {
        Range.prototype.createContextualFragment = function(html)
        {
            var frag = document.createDocumentFragment(), 
            div = document.createElement("div");
            frag.appendChild(div);
            div.outerHTML = html;
            return frag;
        }
    }

//Ext.onReady(function(){  
//	Ext.QuickTips.init();
//	Ext.form.Field.prototype.msgTarget = 'side';    //统一指定错误信息提示方式，在输入栏右侧显示一个突出的出错图标  
//	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
//	App.ini();
//});
