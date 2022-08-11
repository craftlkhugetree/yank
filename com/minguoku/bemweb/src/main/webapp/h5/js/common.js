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


//全局变量
    var GLOBAL = {
        HISTORY_ARR: ['index'],
        PAGES: {},
        USERID: '',
        TAP:'', //判断是查看详情还是编辑（日志）
        LONGITUDE: '', //经度
        LATITUDE: '', //纬度
        LON: '', //经度
        LAT: '', //纬度
        WEEK_DATA:[],
        URL: 'http://160.255.0.191:12080/book/rest/',
        BOOKURL:'http://160.255.0.191:12080/mgwxk/',
        PAGEURL:'http://160.255.0.191:12080/mgwxk/',
        GETQUERYSTRING:function(name){                                    //获取url后面的参数值
		     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		     var r = window.location.search.substr(1).match(reg);
		     if(r!=null)return  r[2]; return null;
		}
        
    }
$(function(){
	var vm = {};

    
    
    var commondao = {
        //公共轮播图
    	banner:function(param){
	        	return dkr.util.ajaxPost('banner.json', param)
	    },
	    //公共底部
	    footer:function(param){
	    	return dkr.util.ajaxPost('footer.json', param)
	    },
	    //公共头部Logo
	    headerLogo:function(param){
	    	return dkr.util.ajaxPost(GLOBAL.URL+'Book/getCustomer', param)
	    },
	    //客服电话
	    custumerPhone:function(param){
	    	return dkr.util.ajaxPost('headerLogo.json', param)
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
					    // 如果需要分页器
					    pagination: '.swiper-pagination'
					});
		});
    }
    if($("#footerTemp").length>0){
    	//加载底部
		commondao.footer({
		    	data:''
		}).done(function(res){
		    	$('#footerTemp').tmpl(res).appendTo('.bottomcontent');
		    	
		});
    }
	
	if($("#headerLogoTemp").length>0){
	    //用户名
		commondao.headerLogo({
		    	data:''
		}).done(function(res){
		    	$('#userLogoTemp').tmpl(res).appendTo('.titlePic');
		    	
		});	
		
		//客服电话
		commondao.custumerPhone({
		    	data:''
		}).done(function(res){
		    	$('#headerLogoTemp').tmpl(res).appendTo('.titlePic');
		    	
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
						window.open("../search/index.html?KEYWORDS="+$.trim($('#inputkeyword').val()));	
					}
				
	        }
	});
    
});

        function out(){ 
            $('#note').animate({top:'0'}, 500, function(){ 
                $(this).css({display:'none', top:'-100px'}); 
            }); 
        } 
        
        
        //高亮显示
	    function highlight(s,className,type){  
            //var s=document.getElementById("input").value;  
//	        var s=keyworsArray;   
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
	        	
//		        var list = document.getElementsByClassName(className);
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
	    	var b = new Base64();  
	    	return b.decode(params);
	    }
	    
	    
	    
