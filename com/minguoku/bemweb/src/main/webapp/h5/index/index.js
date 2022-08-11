var explorer=navigator.userAgent;
	    if(explorer.indexOf("Chrome")<0){         //不是chrome

              $('.tipChrome').show();

		   
		}

$(function(){//banner轮播图
	   
        var dao = {
	        //专家评论调用接口
	        expertComment: function(param) {
	            return dkr.util.ajaxPost('expert.json', param)
	        },
	        //民国人物调用接口
	        minguoPeople: function(param) {
	            return dkr.util.ajaxPost('minguoPeople.json', param)
	        },
            //最新上架调用接口
            newArrival:function(param){
            	return dkr.util.ajaxPost('newArrival.json', param)
            }
	    };
	  
//	    dao.expertComment({
//	    	data:''
//	    }).done(function(res){
//	    	console.log(res);
////	    	$('#commentTemp').tmpl(res.slice(0, 4)).appendTo('#commentContent');
//	    });
//	    dao.minguoPeople({
//	    	data:''
//	    }).done(function(res){
////	    	$('#commentTemp').tmpl(res.slice(0, 4)).appendTo('#mgMaster');
//	    });
	   
//	    dao.newArrival({
//	    	data:''
//	    }).done(function(res){
////	    	$('#newArrivalTemp').tmpl(res).appendTo('#marquee1 > ul');
////	    	$("#marquee1").kxbdMarquee({direction:"right"});
////	    	
////	    	$('#marquee1 ul li a,#marquee1 ul li p a').on('click',detailLook); 
//	    	
//	    });
	    
	    //点击按钮触发事件
	    $('.search .seniorindexsearchbutton').on('click',seniorsearch); 
	    $('.search .classfiysearchbutton').on('click',classifysearch); 
	    
	     //滚动滑动
	    $("#marquee1").kxbdMarquee({direction:"right",loop:"0"});
	    $('#marquee1 ul li p a').css({"width":"102px","display":"inline-block","text-overflow":"ellipsis","overflow":"hidden","white-space":"nowrap"});

	    
	    $('#marquee1 ul li a,#marquee1 ul li p a').on('click',function(){
			 
		//	    	  console.log($(this)[0].attributes.value.value);
		//	    	  console.log($(this)[0].attributes.name.value);
			    	  window.open('../detail/index.html?DIR='+encryData($(this)[0].attributes.value.value)+'&ZTTYPE='+encryData($(this)[0].attributes.name.value)+'&LABEL=5');
			    	  
			    	 
	    });
	    
	    
	    
	    //下载
	    $('.tipChrome .downChrome').on('click',function(){
	    	 window.open('https://www.baidu.com/s?wd=chrome');
	    });
	    //取消
	    $('.tipChrome .cancelChrome').on('click',function(){
	    	$('.tipChrome').hide();
	    });

});

		 

	      