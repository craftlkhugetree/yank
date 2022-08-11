var akCommFunction={
	deleterecord:function(mygrid,Toolbar,urlss,PostData){
    	if(mygrid.getSelectionModel().getSelected()!=undefined){
       		Ext.MessageBox.confirm('提示', '真的要删除吗？', callBack); 
      		function callBack(id) { 
        	if(id=='yes'){
			    var deleterecord = mygrid.getSelectionModel().getSelected();
			    var bb={"ID":[deleterecord.data.ID]};
			    data=JSON.stringify(bb);
			    Ext.Ajax.request({
				    url:urls+urlss,// 要跳转的url,此为属性必须要有
				    method:'post',
				    params:{data:data}, // 提交参数
				    success: function(response, options){
				      if(errbyextjs(response)){
				       Ext.getCmp(Toolbar).doLoad(0);
					   PostData='';
				      }
				    },
				    failure:function(response, options){
				     	Ext.Msg.alert("提示",'网络出错了！')
				    }
				})
			}}
  		}else{Ext.Msg.alert("提示",'请选择一条记录！')}
	},

	
	getCookie:function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
        else
        return null;
    },
    setCookie:function(name,value){
	    var Days = 1;
	    var exp = new Date();
	    exp.setTime(exp.getTime() + Days*24*60*60*1000);
	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	},
	DelCookie:function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
		var cval = getCookie(name);
		document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
	}

	
};
var akDateChange={
	timechangeymd:function(timestr){           //把20111202转换成2011-12-02
		if(timestr!=""){
		    var timestr1="";
                timestr1+= timestr.substring(0,4);
                timestr1+="-";
                timestr1+=timestr.substring(4,6);
                timestr1+="-";
                timestr1+=timestr.substring(6,8);
                
                return timestr1;
		}else{return}
	},
	datechangeymd:function(timestr){           //把20111202转换成2011年12月02日
		if(timestr!=""){
		    var timestr1="";
                timestr1+= timestr.substring(0,4);
                timestr1+="年";
                timestr1+=timestr.substring(4,6);
                timestr1+="月";
                timestr1+=timestr.substring(6,8);
                 timestr1+="日";
                return timestr1;
		}else{return}
	},
	timechange:function(timestr){
	    if(timestr!=""){
	        var timestr1="";
	        timestr1+= timestr.substring(0,4);
	        timestr1+="-";
	        timestr1+=timestr.substring(4,6);
	        timestr1+="-";
	        timestr1+=timestr.substring(6,8);
	        timestr1+=" ";
	        timestr1+=timestr.substring(8,10);
	        timestr1+=":";
	        timestr1+=timestr.substring(10,12);
	        timestr1+=":";
	        timestr1+=timestr.substring(12,14);
	        return timestr1;
	    }else{return}
	},
	timechangeHourMin:function(timestr){   //只有时分
	    if(timestr!=""){
	        var timestr1="";
	        timestr1+= timestr.substring(0,4);
	        timestr1+="-";
	        timestr1+=timestr.substring(4,6);
	        timestr1+="-";
	        timestr1+=timestr.substring(6,8);
	        timestr1+=" ";
	        timestr1+=timestr.substring(8,10);
	        timestr1+=":";
	        timestr1+=timestr.substring(10,12);
	        return timestr1;
	    }else{return}
	},
	datetimesave:function(value){
		var values=value.replace(new RegExp(/(:)/g),"").replace(new RegExp(/(-)/g),"").replace(/\s+/g,"");
		return values
	}
}

