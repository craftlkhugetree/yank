//高级搜索
function seniorsearch(){
	window.open("../seniorSearch/index.html");

}
//分类搜索
function classifysearch(){

	//if($.trim($('#inputkeyword').val())){
	  window.open("../classifyBrowse/index.html");	
//	}else{
//		
//	}
	
}
//查看详情
function lookcheck(){
	window.open("../detail/index.html");
}

// 前往新闻公告
function jumpToNews() {
	window.open("../newsNotice/index.html");
}

// 前往新闻公告详情
function jumpToNewsDetail(url, data) {
  let obj = JSON.stringify(data);
//   let params = `?news=${encodeURI(obj)}`
//   window.open(url + params);
  localStorage.setItem('newsNotice', obj)
  window.open(url);
}


//兼容ie8
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0)
                from += len;
            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    };

	let isLocal = location.protocol === 'file:' || ['127.0.0.1', 'localhost'].includes(location.hostname)
	const serverIP = 'http://172.20.1.251:8080';

//全局变量
    var GLOBAL = {
      HISTORY_ARR: ['index'],
      PAGES: {},
      USERID: '',
      TAP: '', //判断是查看详情还是编辑（日志）
      LONGITUDE: '', //经度
      LATITUDE: '', //纬度
      LON: '', //经度
      LAT: '', //纬度
      WEEK_DATA: [],
      URL: isLocal
        ? serverIP + '/book/rest/'
        : location.protocol +
          '//' +
          location.host +
          location.pathname.substring(0, location.pathname.substr(1).indexOf('/') + 1) +
          '/rest/',
      //      URL: 'http://160.255.0.246:8089/book/rest/',
      BOOKURL: isLocal
        ? serverIP + '/mgwxk/'
        : location.protocol + '//' + location.host + '/mgwxk/',
      PAGEURL: isLocal
        ? serverIP + '/mgwxk/'
        : location.protocol + '//' + location.host + '/mgwxk/',
      GETQUERYSTRING: function (name) {
        //获取url后面的参数值
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
      },
    };
$(function(){
	var vm = {};

    
    
    var commondao = {
        //公共轮播图
    	banner:function(param){
	        	return dkr.util.ajaxPost(location.protocol+'//'+location.host+location.pathname.split('index.html')[0]+'banner.json', param)
	    },
	    //公共底部
	    footer:function(param){
	    	// return dkr.util.ajaxPost(location.protocol+'//'+location.host+location.pathname.split('index.html')[0]+'footer.json', param)
			return dkr.util.ajaxPost(location.protocol+'//'+location.host + '/book/h5/index/footer.json', param)
		},
	    //公共头部Logo
	    headerLogo:function(param){
	    	return dkr.util.ajaxPost(GLOBAL.URL+'Book/getCustomer', param)
	    },
	    //客服电话
	    custumerPhone:function(param){
			return dkr.util.ajaxPost(GLOBAL.URL+'Cfg/viewByCode', param)
	    	//return dkr.util.ajaxPost(location.protocol+'//'+location.host+location.pathname.split('index.html')[0]+'headerLogo.json', param)
	    }
	    
    };
    
    if($("#swiperTemp").length>0){
    	//加载轮播图
	    commondao.banner({
		    	data:''
		}).done(function(res){
		    	$('#swiperTemp').tmpl(res).appendTo('.swiper-wrapper');
		    	//动态轮播
		    	    var mySwiper = new Swiper ('.swiper-container', {
					    direction: 'horizontal',
					    loop: true,
					    autoplay: 2000,
					    paginationClickable: true,
					    autoplayDisableOnInteraction : false,
					    // 如果需要分页器
					    pagination: '.swiper-pagination'
					});
		});
    }
    if($(".bottomcontent").length>0){
    	//加载底部
		commondao.footer({
		    	data:''
		}).done(function(res){
		    	//$('#footerTemp').tmpl(res).appendTo('.bottomcontent');
				var tmpl = '<p class="operateGruide"><a href="../aboutUs/index.html?LABEL=7"><span>{{= ABOUTUS}}</span></a><span>|</span><a href="../useHelp/index.html?LABEL=7"><span>{{= USEHELP}}</span></a><span>|</span><a href="../disclaimer/index.html?LABEL=7"><span>{{= DISCLAIMER}}</span></a><span>|</span><a href="../connect/index.html?LABEL=7"><span>{{= CONNECT}}</span></a></p>'
						 + '<p>{{= PUTONFILE}} &nbsp;&nbsp;|&nbsp;&nbsp;'
				         + 'Copyright&nbsp;©&nbsp;{{= DEVEPMENTCOMPANY}} &nbsp;&nbsp;|&nbsp;&nbsp;'
				         + '{{= TIME}} &nbsp; {{= PROJECTNAME}}  &nbsp;&nbsp;&nbsp;&nbsp;</p>'
	    	             + '<p>技术支持：{{= USECOMPANY}} &nbsp;&nbsp;|&nbsp;&nbsp;项目创意：{{= PROJECTCREATION}}</p>';
		    	$.tmpl(tmpl, res).appendTo('.bottomcontent');
		});
    }
	
	if($(".titlePic").length>0){
	    //用户名
		commondao.headerLogo({
		    	data:''
		}).done(function(res){
		        var tmpl = '<span class="schoolname">{{= SCHOOLNAME}}</span>'
                	+'{{if SCHOOLNAME =="游客访问"}}'
					+'<span class="login" id="login" onclick="$(\'.login-div\').show();changeCode();">会员登录</span>'
					+'{{/if}}'
				$.tmpl(tmpl, res).appendTo('.titlePic');
		    	//$('#userLogoTemp').tmpl(res).appendTo('.titlePic');
		    	
		});	
		
		//客服电话
		commondao.custumerPhone({
		    	CODE:'PHONE'
		}).done(function(res){
		    	var tmpl = '<div>'
		    		+'<img src="../img/icon-tel.png"/>'
					+'<span class="custumerName">咨询电话：{{= CUSTOMERPHONE}}</span>'
		    	  + ' <span class="custumerPhone">QQ：29103144，吴老师</span>'
		    	+'</div>';
		    	$.tmpl(tmpl, res).appendTo('.titlePic');
		    	//$('#userLogoTemp').tmpl(res).appendTo('.titlePic');
		    	
		});	
	}
	
    
    
    $("#inputkeyword").keypress(function(e){
	        var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
	        
	        if (eCode == 13){
	           		
					if(!$.trim($('#inputkeyword').val())){
						if(!$('#note').is(':visible')){ 
			                $('#note').css({display:'block', top:'-100px',position:'fixed'}).animate({top: '+100'}, 500, function(){ 
			                    setTimeout(out, 1000); 
			                }); 
			            }
					}else{
						location.href="../search/index.html?KEYWORDS="+encodeURI($.trim($('#inputkeyword').val()));	
					}
				
	        }
	});
    
});

        function out(){ 
            $('#note').animate({top:'0'}, 500, function(){ 
                $(this).css({display:'none', top:'-100px'}); 
            }); 
        } 
        //登录
        function login(){
        	var loginname = $.trim($('#uname').val());
        	if(loginname==''){
        		$('.login-error').text('请输入用户名');
        		return false;
        	}
		    var pwd = $.trim($('#pword').val());
		    if(pwd==''){
        		$('.login-error').text('请输入密码');
        		return false;
        	}
		    var yzm =  $.trim($('#yzm').val());
		     if(yzm==''){
        		$('.login-error').text('请输入验证码');
        		return false;
        	}
		    var data = JSON.stringify({loginname:loginname,pwd:pwd,yzm:yzm});
		    var base64 = new Base64();
		    var params = { user: base64.encode(data) };
			$.ajax({
				url:'/idsweb/rest/login2/authUser',
				type:'post',
				data:params,
				success:function(res){
					if(res.success){
					    location.reload();
					}else{
						$('.login-error').text(res.msg);
						$('#yzm').val('');
						changeCode();
					}
				}
				
			});
		}
		function changeCode(){
		    document.getElementById("yzmtp").src="/idsweb/rest/captcha/get?"+Math.random();
		}
		$(document).click(function (e) {
		    var drag = $("#login-div"),
		        dragel = $("#login-div")[0],
		        target = e.target;
		    if ($(target).html()!=='会员登录'&&dragel !== target && dragel && !$.contains(dragel, target)) {
		        drag.hide();
		    }
		});
        //内页高亮
		function innerHighlight(key){
			var str = '';
			var elementList = document.getElementById("iframeId").contentWindow.document.getElementsByClassName('pagecss');
			elementList = $(elementList).find('div');
			$.each(elementList,function(index,value){
				str+=$(value).text();
			});
		    let pos = str.indexOf(key);
            while (pos > -1) {
              elementHighlight(elementList,key,pos)
              pos = str.indexOf(key, key.length + pos);
              
            }

		}
		//元素高亮
		function elementHighlight(obj,key,index){
			for(var i=0;i<key.length;i++){
				var j = index+i;
				$(obj[j]).css('color','red');
			}
		}
        
        //高亮显示
	    function highlight(s,className,type){  
               
            if(type==undefined){
            	type='';
            }
            
	        if (s.length==0){  
	            return false;  
	        }else if(s.length==1){
	        	var list;
	        	if(className=='book'){
	        		list = document.getElementsByClassName(className);
	        	}else{
	        		list =document.getElementById("iframeId").contentWindow.document.getElementsByClassName(className);
	        	}
	        	if(className=='pagecss'&&$(list).find('.divcomm').length<1){
					innerHighlight(s[0]);
				}
				
				for(i=0;i<list.length;i++){
					var obj=list[i]; 
					var t=obj.innerHTML.replace(/<em\s+style=.?color:red;font-style:normal class='highlight' value=type[0].?>([^<>]*)<\/em>/gi,"$1");
			        obj.innerHTML=t;  
			        var cnt=loopSearch(s,obj);  
			        t=obj.innerHTML  
			        var r=/{searchHL}(({(?!\/searchHL})|[^{])*){\/searchHL}/g  
			        t=t.replace(r,"<em class='highlight' style='color:red;font-style: normal;cursor:default;' value="+type[0]+">$1</em>");  
			        obj.innerHTML=t;
				}
	        }else if(s.length>1){
	        	var list;
	        	if(className=='book'){
	        		list = document.getElementsByClassName(className);
	        	}else{
	        		list =document.getElementById("iframeId").contentWindow.document.getElementsByClassName(className);
	        	}
	        	 for (var j=0;j<s.length;j++) {
	        	      
	        	 	    for(i=0;i<list.length;i++){
							var obj=list[i]; 
							var t=obj.innerHTML.replace(/<em\s[j]+style=.?color:red;font-style: normal class='highlight' value=type[j].?>([^<>]*)<\/em>/gi,"$1");
					        obj.innerHTML=t;  
					        var cnt=loopSearch(s[j],obj);  
					        t=obj.innerHTML  
					        var r=/{searchHL}(({(?!\/searchHL})|[^{])*){\/searchHL}/g  
					        t=t.replace(r,"<em class='highlight' style='color:red;font-style: normal;cursor:default;' value="+type[j]+">$1</em>");  
					        obj.innerHTML=t;
						}
	        	 }
	        }
	      
	    }  
	    
	    function loopSearch(s,obj){  
	        var cnt=0;  
	        if (obj.nodeType==3){  
	            cnt=replace(s,obj);  
	            return cnt;  
	        }  
	        for (var i=0,c;c=obj.childNodes[i];i++){  
	            if (!c.className||c.className!="highlight")  
	                cnt+=loopSearch(s,c);  
	        }  
	        return cnt;  
	    }  
	    
	    function replace(s,dest){  
	        var r=new RegExp(s,"g");  
	        var tm=null;  
	        var t=dest.nodeValue;  
	        var cnt=0;  
	        if (tm=t.match(r)){  
	            cnt=tm.length;  
	            t=t.replace(r,"{searchHL}"+s+"{/searchHL}")  
	            dest.nodeValue=t;  
	        }  
	        return cnt;
	    }
	    
	    //加密数据
	    function encryData(params){
	    	
	    	var b = new Base64(); 
	    	return b.encode(params);
	    }
	    
	    //解密数据
	    function decryData(params){
			if (params || params === 0) {
				var b = new Base64();  
				return b.decode(params);
			}
	    }
	    
/** Function : 时间函数封装 , Created By HarryC on 2019/1/31 0031 */
const formatTime = function (time, format) {
    let timeLength = '' + time;
    let tf = function (d) {
        return d >= 10 ? d : '0' + d;
    }
    let dateObj;
    switch (timeLength.length) {
        case 17:
        case 16:
        case 15:
        case 14:
            dateObj = new Date(parseInt(timeLength.substring(0, 4)),
                parseInt(timeLength.substring(4, 6)) - 1,
                parseInt(timeLength.substring(6, 8)),
                parseInt(timeLength.substring(8, 10)),
                parseInt(timeLength.substring(10, 12)),
                parseInt(timeLength.substring(12, 14)));
            break;
        case 13:
            dateObj = new Date(time);
            break;
        case 8:
            dateObj = new Date(parseInt(timeLength.substring(0, 4)),
                parseInt(timeLength.substring(4, 6)) - 1,
                parseInt(timeLength.substring(6, 8))
            );
            break;
        default:
            dateObj = "";
            // throw "Ow<这是一条来自common的提示：format参数输入错误";
            console.log("format参数输入错误");
    }
    let timeString = "";
    if (dateObj) {
        timeString = format.replace(/YYYY/gi, dateObj.getFullYear() + '')
            .replace(/MM/g, tf(dateObj.getMonth() + 1))
            .replace(/DD/gi, tf(dateObj.getDate()))
            .replace(/hh/gi, tf(dateObj.getHours()))
            .replace(/mm/g, tf(dateObj.getMinutes()))
            .replace(/ss/gi, tf(dateObj.getSeconds()));
    } else {
        timeString = "--"
    }
    return timeString;
}	    
	    
