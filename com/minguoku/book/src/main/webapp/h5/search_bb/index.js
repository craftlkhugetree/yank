//获取查询的关键字
    var keywords='';
    var keyworsArray=[];
    //console.log(JSON.stringify(keywords));
    var pageIndex=0 ;  //初始页索引
    var pageSize =10; //每页数据条数
    var totalSize=0; //设置默认总数据条数
    var bookids;     //分类id
    var dao={};
$(function(){//banner轮播图
	
//  $('.keywords').text(decodeURI(keywords));
    dao.bookInfo=function(param){
    	  return dkr.util.ajaxPost(GLOBAL.URL+'Book/searchBook', param)
    }
    //分类过滤书本
    dao.filterBook=function(param){
    	  return dkr.util.ajaxPost(GLOBAL.URL+'Book/searchBookByType', param)
    }
    //高级搜索接口
    dao.seniorsearch=function(param){
    	
	    return dkr.util.ajaxPost(GLOBAL.URL+'Book/advancedSearch', param)
	    
	}
    
    //引用
     dao.quote=function(param){
        	return dkr.util.ajaxPost(GLOBAL.URL+'Book/quote', param)
     }
	  
	  
	  //判断从首页过来还是高级搜索过来的
	  if(GLOBAL.GETQUERYSTRING('KEYWORDS')==null){     //高级搜索   
	  	   
	  	   if(GLOBAL.GETQUERYSTRING('LABEL')=='6'){
	  	   	    $('.labelname').text('分类检索');	
	  	   }else{
	  	   	    $('.labelname').text('高级检索');
	  	   }
	  	   
	  	   seniorsearchloaddata();  
	  }else{                                           //关键字搜索
	  	   $('.tipsInfo').text('关键词:');
	  	   $('.tipsInfo').attr('title','');
	  	   $('.keywords').text(decodeURI(GLOBAL.GETQUERYSTRING('KEYWORDS')));
	  	   localStorage.setItem('keywords', decodeURI(GLOBAL.GETQUERYSTRING('KEYWORDS')));
	  	   
	  	   if(GLOBAL.GETQUERYSTRING('LABEL')=='6'){
	  	   	    $('.labelname').text('检索');	
	  	   }else{
	  	      
	  	        $('.labelname').text('首页');	
	  	   }
	  	   
	  	   keywords=GLOBAL.GETQUERYSTRING('KEYWORDS');
	  	   
	  	    if(document.getElementById("squaredThree").checked){         //在结果内搜索
				keyworsArray.push(decodeURI(keywords));
				keyworsArray=uniqueArray(keyworsArray);
				$('.tipsInfo').text('关键词:');
				$('.keywords').text(keyworsArray);
			}else{                                                       //不在结果内搜索
				keyworsArray=[];
				keyworsArray.push(decodeURI(keywords));
				$('.tipsInfo').text('关键词:');
				$('.keywords').text(decodeURI(keywords));
			}
	       initloadPage();
	  }
	 
	 
	$(".inputkeywordclass").keypress(function(e){
	        var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
	        if (eCode == 13){
					if(!$.trim($('.inputkeywordclass').val())){
						if(!$('#note').is(':visible')){ 
			                $('#note').css({display:'block', top:'-100px',position:'fixed'}).animate({top: '+100'}, 500, function(){ 
			                    setTimeout(out, 1000); 
			                }); 
			            }
					}else{
						$('.tipsInfo').css('width','auto');
						$('.tree').empty();
					    $('.showbookcontent').empty();
					    $('.bookDetail').empty();
					    keywords=$.trim($('.inputkeywordclass').val());
					    //$('.keywords').text(decodeURI(keywords));
					    
					    if(document.getElementById("squaredThree").checked){         //在结果内搜索
							keyworsArray.push(decodeURI(keywords));
							keyworsArray=uniqueArray(keyworsArray);
							$('.tipsInfo').text('关键词:');
							$('.keywords').text(keyworsArray);
						}else{                                                       //不在结果内搜索
							keyworsArray=[];
							keyworsArray.push(decodeURI(keywords));
							$('.tipsInfo').text('关键词:');
							$('.keywords').text(decodeURI(keywords));
						}
					    initloadPage();
					}
	        }
	});
	
    
    $('.search .seniorlocalsearchbutton').on('click',seniorsearch); 
    $('.search .classfiysearchbutton').on('click',classifysearch); 
    
    $('.labelname').on('click',function(){
    	  
    	  if($(this).text()=='高级检索'){
    	  	
    	  	window.open('../seniorSearch/index.html');
    	  	
    	  }else if($(this).text()=='首页'){
    	  	
    	  	window.open('../index/index.html');
    	  	
    	  }else if($(this).text()=='检索'){
    	  	
    	  	window.open('../search/index.html');
    	  	
    	  }else if($(this).text()=='分类检索'){
    	  	window.open('../classifyBrowse/index.html');
    	  }
    	  
    });
    
    $('.backtop').on('click',function(){
        
    	 $('body').animate({scrollTop:0},'fast');
    });
    
    
});

    window.onscroll = function(){
    	
         if(document.body.scrollTop>=100){
         	$('.backtop').fadeIn(1000);
         }else{
         	$('.backtop').fadeOut(1000);
         }

    }
    
    

    //初始化加载页面
    function initloadPage(){
    	    layer.load(1, {
			  shade: [0.01,'#fff'], //0.1透明度的白色背景
			  offset:['400px', '']
			});
    	    dao.bookInfo({
			  	data:JSON.stringify({"start":"0","limit":"10","page":"1","KEYWORD":keyworsArray})
			}).done(function(res){
				  	
				  	  layer.closeAll(); 
				  	 
				  	  totalSize=res.BOOKTOTAl;
				  	  
				  	  $('#bookTemp').tmpl(res).appendTo('.showbookcontent');
			          // console.log(res);
			          if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
			          	        $.ajaxSettings.async = false;
			          	        
			          	        for(var i=0;i<res.BOOKLIST.length;i++) {
			          	        	$.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+res.BOOKLIST[i].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[i].DIR);
								  	  		    if(res.BOOKLIST[i].hasOwnProperty('ZTTYPE')){
								  	  		      data.ZTTYPE=encryData(res.BOOKLIST[i].ZTTYPE);	
								  	  		    }
								  	  		    
								  	  		    data.ISLOOK=res.BOOKLIST[i].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
								  	  		    highlight(keyworsArray,'book');
	//							  	  		    res.BOOKLIST[0].ISLOOK=false;
								  	  		    //判断是否可阅读
					  	  		                isread(res.BOOKLIST[i].ISLOOK,data);
	   						  	  		    
							  	    });
							  	    
							  	    if(i==0){
							  	    	$('.book').css('border-top','1px solid #9A886E');
							  	    }
			          	        }
			          	          
			          }else{
				  	  	
						  		  $('.cateinfo').css({
						  		  	  "height": "36px",
	                                  "border-bottom": "1px solid #9A886E"
						  		  });
					  }
			          $('.expertComment > .tree').css('max-height',$('.expertComment').height()-40);
			          $('#categoryTemp').tmpl(res).appendTo('.tree');
				  	  //点击分页
				  	  if(res.hasOwnProperty('BOOKTOTAl')){
				  	  	        $('#div_pager').pagination({
					  	  	            callback: PageCallback,
//								    pageCount:res.BOOKTOTAl/3+1,
										totalData:res.BOOKTOTAl,
										current_page: pageIndex,//当前页索引
										showData:10,
										current:1,
										prevCls:'prev',
										nextCls:'next',
										activeCls:'active',
										count:2,
									    coping:true,
									    homePage:'首页',
									    endPage:'末页',
									    prevContent:'上页',
									    nextContent:'下页',
//									    jump:true,				//跳转到指定页数
//										jumpIptCls:'jump-ipt',	//文本框内容
//										jumpBtnCls:'jump-btn',	//跳转按钮
//										jumpBtn:'跳转',			//跳转按钮文本
									    showGoInput: true,
							            showGoButton: true
								});
				  	  }
					  	 
				  });
				  
		
    }
    
    //高级搜索跳转到当前页面的加载数据
    function seniorsearchloaddata(){
    	    
    	    var title=decodeURI(GLOBAL.GETQUERYSTRING('TITLE'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('TITLE')):'';
    	    var series=decodeURI(GLOBAL.GETQUERYSTRING('SERIES'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('SERIES')):'';
    	    var publishname=decodeURI(GLOBAL.GETQUERYSTRING('PUBLISHERNAME'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('PUBLISHERNAME')):'';
    	    var address=decodeURI(GLOBAL.GETQUERYSTRING('ADDRESS'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('ADDRESS')):'';
    	    var pubdate=decodeURI(GLOBAL.GETQUERYSTRING('PUBDATE'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('PUBDATE')):'';
    	    var keyword=decodeURI(GLOBAL.GETQUERYSTRING('KEYWORD'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('KEYWORD')):'';
    	    var zttype=decodeURI(GLOBAL.GETQUERYSTRING('ZTTYPE'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('ZTTYPE')):'';
    	    var author=decodeURI(GLOBAL.GETQUERYSTRING('AUTHOR'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('AUTHOR')):'';
    	    
    	    $('.tipsInfo').css('width','270px');
    	    
    	    $('.tipsInfo').html((title!=''?'题目:'+title+'&nbsp;&nbsp;&nbsp;&nbsp;':'')+(series!=''?'丛书名:'+series+'  ':'')+(publishname!=''?'出版社:'+publishname+'  ':'')
    	                         +(address!=''?'出版地:'+address+'  ':'')+(pubdate!=''?'出版时间:'+pubdate+'  ':'')+(keyword!=''?'主题词:'+keyword+'  ':'')
    	                         +(zttype!=''?'中图法:'+zttype+'  ':'')+(author!=''?'责任者:'+author+'  ':''));
    	    
    	    $('.tipsInfo').attr('title',(title!=''?'题目:'+title+'  ':'')+(series!=''?'丛书名:'+series+'  ':'')+(publishname!=''?'出版社:'+publishname+'  ':'')
    	                         +(address!=''?'出版地:'+address+'  ':'')+(pubdate!=''?'出版时间:'+pubdate+'  ':'')+(keyword!=''?'主题词:'+keyword+'  ':'')
    	                         +(zttype!=''?'中图法:'+zttype+'  ':'')+(author!=''?'责任者:'+author+'  ':''));
    	    layer.load(1, {
			  shade: [0.01,'#fff'], //0.1透明度的白色背景
			  offset:['400px', '']
			});
    	    
    	    dao.seniorsearch({
				  	data:JSON.stringify({"start":"0","limit":"10","page":"1","filter":{"TITLE":title,"SERIES":series
				  	  ,"PUBLISHERNAME":publishname,"ADDRESS":address,"PUBDATE":pubdate
				  	  ,"KEYWORD":keyword,"ZTTYPE":zttype,"AUTHOR":author}})
				  }).done(function(res){
				  	  layer.closeAll(); 
				  	  totalSize=res.BOOKTOTAl;
//				  	  $('#categoryTemp').tmpl(res).appendTo('.tree');
				  	  $('#bookTemp').tmpl(res).appendTo('.showbookcontent');
			          // console.log(res);
			          
			          if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
			          	        $.ajaxSettings.async = false;
			          	        
			          	        for(var i=0;i<res.BOOKLIST.length;i++) {
			          	        	$.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+res.BOOKLIST[i].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[i].DIR);
								  	  		    if(res.BOOKLIST[i].hasOwnProperty('ZTTYPE')){
								  	  		      data.ZTTYPE=encryData(res.BOOKLIST[i].ZTTYPE);	
								  	  		    }
								  	  		    data.ISLOOK=res.BOOKLIST[i].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+data.BOOKIMG;
								  	  		    
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		                //判断是否可阅读
					  	  		                isread(res.BOOKLIST[i].ISLOOK,data);
	   						  	  		    
							  	    });
							  	    
							  	    if(i==0){
							  	    	$('.book').css('border-top','1px solid #9A886E');
							  	    }
			          	        }
			          	         	  
			          }else{
				  	  	
						  		  $('.cateinfo').css({
						  		  	  "height": "36px",
	                                  "border-bottom": "1px solid #9A886E"
						  		  });
					  }
			          $('.expertComment > .tree').css('max-height',$('.expertComment').height()-40);
			          $('#categoryTemp').tmpl(res).appendTo('.tree');
				  	  //点击分页
				  	  if(res.hasOwnProperty('BOOKTOTAl')){
				  	  	        $('#div_pager').pagination({
					  	  	        callback: seniorSearchCallback,
//								    pageCount:res.BOOKTOTAl/3+1,
									totalData:res.BOOKTOTAl,
									current_page: pageIndex,//当前页索引
									showData:10,
									current:1,
									prevCls:'prev',
									nextCls:'next',
									activeCls:'active',
									count:2,
								    coping:true,
								    homePage:'首页',
								    endPage:'末页',
								    prevContent:'上页',
								    nextContent:'下页',
//								    jump:true,				//跳转到指定页数
//									jumpIptCls:'jump-ipt',	//文本框内容
//									jumpBtnCls:'jump-btn',	//跳转按钮
//									jumpBtn:'跳转',			//跳转按钮文本
								    showGoInput: true,
						            showGoButton: true
								});
				  	  }
					  	  
				  });
    }
    
    //点击分类过滤书本
		function categoryFilterBook(params){
			  bookids=params.getAttribute('value');
			  $('.tipsInfo').text('筛选:');
			  $('.keywords').text(params.innerText);
			  $('.tree').empty();
			  $(".bookDetail").empty();
			  $(".showbookcontent").empty();
			  
			  layer.load(1, {
				  shade: [0.01,'#fff'], //0.1透明度的白色背景
				  offset:['400px', '']
			  });
			 // $('.keywords').text('');
			  //alert(params.getAttribute('value'));
			  dao.filterBook({
			  	data:JSON.stringify({"start":0,"limit":10,"page":1,"BOOKIDS":params.getAttribute('value')})
			  	//data:JSON.stringify({'filter':{'bookids':params.getAttribute('value')}})
			  }).done(function(res){
			  	    
			  	    layer.closeAll();
//			  	    $('.keywords').text('');
					totalSize=res.BOOKTOTAl;
//					$('#categoryTemp').tmpl(res).appendTo('.tree');
//				  	  $('#categoryTemp').tmpl(res).appendTo('.tree');
				  	$('#bookTemp').tmpl(res).appendTo('.showbookcontent');
		          
		            if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
		          	            $.ajaxSettings.async = false;
		          	            
		          	            for(var i=0;i<res.BOOKLIST.length;i++) {
		          	            	$.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+res.BOOKLIST[i].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[i].DIR);
								  	  		    if(res.BOOKLIST[i].hasOwnProperty('ZTTYPE')){
								  	  		      data.ZTTYPE=encryData(res.BOOKLIST[i].ZTTYPE);	
								  	  		    }
								  	  		    data.ISLOOK=res.BOOKLIST[i].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		                //判断是否可阅读
					  	  		                isread(res.BOOKLIST[i].ISLOOK,data);
	   						  	  		    
							  	    });
							  	    if(i==0){
							  	    	$('.book').css('border-top','1px solid #9A886E');
							  	    }
		          	            }
		          	            
						  	  
					  	}else{
					  		  $('.cateinfo').css({
					  		  	  "height": "36px",
                                  "border-bottom": "1px solid #9A886E"
					  		  });
					  	}
					  	$('.expertComment > .tree').css('max-height',$('.expertComment').height()-40);
			            $('#categoryTemp').tmpl(res).appendTo('.tree');
					  	//点击分页
					  	if(res.hasOwnProperty('BOOKTOTAl')){
					            $('#div_pager').pagination({
					  	  	        callback: categoryCallback,
									totalData:res.BOOKTOTAl,
									current_page: pageIndex,//当前页索引
									showData:10,
									current:1,
									prevCls:'prev',
									nextCls:'next',
									activeCls:'active',
									count:2,
								    coping:true,
								    homePage:'首页',
								    endPage:'末页',
								    prevContent:'上页',
								    nextContent:'下页',
	//							    jump:true,				//跳转到指定页数
	//								jumpIptCls:'jump-ipt',	//文本框内容
	//								jumpBtnCls:'jump-btn',	//跳转按钮
	//								jumpBtn:'跳转',			//跳转按钮文本
								    showGoInput: true,
						            showGoButton: true
								});		
					  	}
				  	  
			  });
		}
		
		//点击隐藏显示
		function clickShowHide(params){
			console.log(params);
			
			$('.expertComment > .tree').css('max-height',$('.expertComment').height()-40);
			$($(params)).next().toggle();
			$('.searchName').not('.searchName[value="'+params.attributes.value.nodeValue+'"]').next().hide();
		}

    /**
     * 分页
    */
        //查询关键字分页回调函数
    var time=0;
    function PageCallback(index, jq) {
    	        $(".bookDetail").empty();
    	        
    	        layer.load(1, {
				  shade: [0.01,'#fff'], //0.1透明度的白色背景
				  offset:['400px', '']
				});
    	        
//  	        layer.open({
//  	    		  type: 1,
//  	    		  skin: 'layui-layer-rim', //加上边框
//  	    		  area: ['300px', '150px'], //宽高
//  	    		  offset:['200px', ''],
//  	    		  content: '<p style="text-align:center;margin-top:30px;">加载中......</p>'
//  	    	});
    	        //判断计时器是否处于关闭状态--不能连续点击
//			    if (time == 0) {
//			        time = 1; //设定间隔时间（秒）
//			 
//			        //启动计时器，倒计时time秒后自动关闭计时器。
//			        var indexVar = setInterval(function(){
//			            time--;
//			            if (time == 0) {
//			                clearInterval(indexVar);
//			            }
//			        }, 1000);
			       
			       InitTable(index);
			   // }  
      	
    }
    //查询关键字分页
    function InitTable(pageIndex) {
    	  //$(".bookDetail").empty();
    	  //每页索引
    	 $('.searchName').next().hide();
    	 $('.expertComment > .tree').css('max-height','');
	     var start=10*(pageIndex.getCurrent())-10;
	     
	     dao.bookInfo({
				  	data:JSON.stringify({"start":start,"limit":10,"page":pageIndex.getCurrent(),"KEYWORD":keyworsArray})
				  }).done(function(res){
					    layer.closeAll(); 
				  	    if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
				  	    	    $.ajaxSettings.async = false;
				  	    	    
				  	    	    for(var i=0;i<res.BOOKLIST.length;i++) {
				  	    	    
				  	    	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+res.BOOKLIST[i].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[i].DIR);
								  	  		    if(res.BOOKLIST[i].hasOwnProperty('ZTTYPE')){
								  	  		      data.ZTTYPE=encryData(res.BOOKLIST[i].ZTTYPE);	
								  	  		    }
								  	  		    data.ISLOOK=res.BOOKLIST[i].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
								  	  		    //高亮显示
								  	  		    highlight(keyworsArray,'book');
								  	  		    
					  	  		                //判断是否可阅读
					  	  		                isread(res.BOOKLIST[i].ISLOOK,data);
	   						  	  		    
							  	    });
							  	    if(i==0){
							  	    	$('.book').css('border-top','1px solid #9A886E');
							  	    }
				  	    	    	
				  	    	    }
				  	    	    
				  	    }else{
				  	  	
					  		  $('.cateinfo').css({
					  		  	  "height": "36px",
                                  "border-bottom": "1px solid #9A886E"
					  		  });
					  	}
				  	    
				  	 
				  });
 
    }
    
    //分类过滤回调函数
    function categoryCallback(index, jq) {
    	
    	layer.load(1, {
		  shade: [0.01,'#fff'], //0.1透明度的白色背景
		  offset:['400px', '']
	    });
    	
      	categoryInitTable(index);
    }
    
    //分类过滤分页
    function categoryInitTable(pageIndex) {
    	  $(".bookDetail").empty();
    	  //每页索引
    	 $('.searchName').next().hide();
    	 $('.expertComment > .tree').css('max-height','');
	     var start=10*(pageIndex.getCurrent())-10;
	     
	     dao.filterBook({
				  	data:JSON.stringify({"start":start,"limit":10,"page":pageIndex.getCurrent(),"BOOKIDS":bookids})
				  }).done(function(res){
				  	  layer.closeAll();
				  	  if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
				  	  	        $.ajaxSettings.async = false;
				  	  	        
				  	  	        for(var i=0;i<res.BOOKLIST.length;i++) {
				  	  	        	
				  	  	            $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+res.BOOKLIST[i].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[i].DIR);
								  	  		    if(res.BOOKLIST[i].hasOwnProperty('ZTTYPE')){
								  	  		      data.ZTTYPE=encryData(res.BOOKLIST[i].ZTTYPE);	
								  	  		    }
								  	  		    data.ISLOOK=res.BOOKLIST[i].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		                //判断是否可阅读
					  	  		                isread(res.BOOKLIST[i].ISLOOK,data);
	   						  	  		    
							  	    });	
							  	    if(i==0){
							  	    	$('.book').css('border-top','1px solid #9A886E');
							  	    }
				  	  	        	
				  	  	        }
				  	  	        
				  	  }else{
				  	  	
					  		  $('.cateinfo').css({
					  		  	  "height": "36px",
                                  "border-bottom": "1px solid #9A886E"
					  		  });
					  	}
				  	    
				  	 
				  });
 
    }
    
    //高级搜索回调函数
    var seniortime=0;
    function seniorSearchCallback(index, jq) {
    	    $(".bookDetail").empty();
    	    //判断计时器是否处于关闭状态--不能连续点击
//  	    layer.open({
//    		  type: 1,
//    		  skin: 'layui-layer-rim', //加上边框
//    		  area: ['300px', '150px'], //宽高
//    		  offset:['200px', ''],
//    		  content: '<p style="text-align:center;margin-top:30px;">加载中......</p>'
//    		});
//		    if (seniortime == 0) {
//		        seniortime = 1; //设定间隔时间（秒）
//		 
//		        //启动计时器，倒计时time秒后自动关闭计时器。
//		        var indexVar = setInterval(function(){
//		            seniortime--;
//		            if (seniortime == 0) {
//		                clearInterval(indexVar);
//		            }
//		        }, 1000);

		        layer.load(1, {
				  shade: [0.01,'#fff'], //0.1透明度的白色背景
				  offset:['400px', '']
				});
				
		       seniorSearchInitTable(index);
//		    } 
      	
    }
    
    //高级搜索分页
    function seniorSearchInitTable(pageIndex) {
//  	  $(".bookDetail").empty();
    	  //每页索引
    	   $('.searchName').next().hide();
    	   $('.expertComment > .tree').css('max-height','');
    	  var title=decodeURI(GLOBAL.GETQUERYSTRING('TITLE'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('TITLE')):'';
    	    var series=decodeURI(GLOBAL.GETQUERYSTRING('SERIES'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('SERIES')):'';
    	    var publishname=decodeURI(GLOBAL.GETQUERYSTRING('PUBLISHERNAME'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('PUBLISHERNAME')):'';
    	    var address=decodeURI(GLOBAL.GETQUERYSTRING('ADDRESS'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('ADDRESS')):'';
    	    var pubdate=decodeURI(GLOBAL.GETQUERYSTRING('PUBDATE'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('PUBDATE')):'';
    	    var keyword=decodeURI(GLOBAL.GETQUERYSTRING('KEYWORD'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('KEYWORD')):'';
    	    var zttype=decodeURI(GLOBAL.GETQUERYSTRING('ZTTYPE'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('ZTTYPE')):'';
    	    var author=decodeURI(GLOBAL.GETQUERYSTRING('AUTHOR'))!="null"?decodeURI(GLOBAL.GETQUERYSTRING('AUTHOR')):'';
    	  
	     var start=10*(pageIndex.getCurrent())-10;
	     
	     dao.seniorsearch({
				  	data:JSON.stringify({"start":start,"limit":10,"page":pageIndex.getCurrent(),"filter":{"TITLE":title,"SERIES":series
				  	  ,"PUBLISHERNAME":publishname,"ADDRESS":address,"PUBDATE":pubdate
				  	  ,"KEYWORD":keyword,"ZTTYPE":zttype,"AUTHOR":author}})
				}).done(function(res){
					  layer.closeAll();
				  	  if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
				  	  	        $.ajaxSettings.async = false;
				  	  	        
				  	  	        for(var i=0;i<res.BOOKLIST.length;i++) {
				  	  	        	$.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+res.BOOKLIST[i].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[i].DIR);
								  	  		    if(res.BOOKLIST[i].hasOwnProperty('ZTTYPE')){
								  	  		      data.ZTTYPE=encryData(res.BOOKLIST[i].ZTTYPE);	
								  	  		    }
								  	  		    data.ISLOOK=res.BOOKLIST[i].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		                //判断是否可阅读
					  	  		                isread(res.BOOKLIST[i].ISLOOK,data);
	   						  	  		    
							  	    });
							  	    if(i==0){
							  	    	$('.book').css('border-top','1px solid #9A886E');
							  	    }
				  	  	        }
				  	  	        
				  	  }else{
				  	  	
					  		  $('.cateinfo').css({
					  		  	  "height": "36px",
                                  "border-bottom": "1px solid #9A886E"
					  		  });
					  	}
				  	    
				  	 
				  });
 
    }
    
//      //分类搜索
//		function classifylocalsearch(){
//			
//			if($.trim($('.inputkeywordclass').val())){
//			          $('.tree').empty();
//					  $('.showbookcontent').empty();
//					  $('.bookDetail').empty();
//					  keywords=$.trim($('.inputkeywordclass').val());
////					  $('.keywords').text(decodeURI(keywords));
//					  
//					    if(document.getElementById("squaredThree").checked){         //在结果内搜索
//							keyworsArray.push(decodeURI(keywords));
//							keyworsArray=uniqueArray(keyworsArray);
//							$('.keywords').text(keyworsArray);
//						}else{                                                       //不在结果内搜索
//							keyworsArray=[];
//							keyworsArray.push(decodeURI(keywords));
//							$('.keywords').text(decodeURI(keywords));
//						}
//					  
//					  initloadPage();
//					  //$('.inputkeywordclass').val("");	
//					  
//					 
//			}
//			
//						 
//		}
		//是否可阅读
		function isread(params,data){
			    if(params){
	            	$('.startreadimg'+data.ID).attr('src',"../img/search_05.png");
//	            	$('.startreadimgQuote'+data.ID).attr('src',"../img/icon-ref-blue.png");
		    	
	  		    	$('.startreadbutton'+data.ID).on('click',function(){
	  		    		  return true
	  		    	});
	  		    	
	            }else{
	            	$('.startreadimg'+data.ID).attr('src',"../img/search_09.png");
//	            	$('.startreadimgQuote'+data.ID).attr('src',"../img/icon-ref-gray.png");
	  		    	$('.startreadbutton'+data.ID).attr('title',"请购买后阅读");
	  		    	$('.startreadbutton'+data.ID).css({
	  		    		     cursor: "not-allowed",
	  		    		     color:"#CCCAC4"
	  		    	});
	  		    	$('.startreadbutton'+data.ID).on('click',function(){
	  		    		  return false
	  		    	});
	            }
		}
		
		function uniqueArray(params){        //关键词去重
				 var res = [];
				 var json = {};
				 for(var i = 0; i < params.length; i++){
					  if(!json[params[i]]){
					   res.push(params[i]);
					   json[params[i]] = 1;
					  }
				 }
				 return res;
		}
		
		//引用
		function quoteMethod(params){
		
				var title=params.getAttribute('value');
				var author=params.getAttribute('name');
				var holder=params.getAttribute('holder');
				var createyear=params.getAttribute('createyear');
				var islook=params.getAttribute('islook');
				
//				if(islook=='true'){
					//引用
					dao.quote({
					  	data:JSON.stringify({"TITLE":title,"AUTHOR":author,"PUBLISHNAME":holder,"PUBDATE":createyear})
					}).done(function(result){
				
						layer.open({
										type: 1,
										title:"<span style='text-align:left;'>引用</span>",
										skin: 'layui-layer-rim', //加上边框
										area: ['580px', '350px'], //宽高
										offset:['200px', ''],
										content: '<div style="margin-left:30px;margin-top:30px;width: 518px;">'+
										            '<p style="margin:0px;border-bottom: 1px solid gray;padding-bottom: 10px;text-align:left;"><span style="display: inline-block;width:90px;text-align:right;margin-right:20px;color:#9A9A9A;">GB/T 7714</span><span style="color:#000">'+
										            //'闻一多. 诗经研究[M]. 巴蜀书社, 2002.'
										            author+' . '+title+' . '+holder+' , '+createyear+' . '
										            +'</span></p><br/>'+
										            '<p style="margin:0px;border-bottom: 1px solid gray;padding-bottom: 10px;text-align:left;"><span style="display: inline-block;width:90px;text-align:right;margin-right:20px;color:#9A9A9A">MLA</span><span style="color:#000">'+
										            author+' . '+title+' . '+holder+' , '+createyear+' . '+
										            '</span></p><br/>'+
										            '<p style="margin:0px;border-bottom: 1px solid gray;padding-bottom: 10px;text-align:left;"><span style="display: inline-block;width:90px;text-align:right;margin-right:20px;color:#9A9A9A">APA</span><span style="color:#000">'+
										            author+' . '+'('+createyear+')'+' . '+title+' . '+holder+' , '+
										            '</span></p><br/>'+
										            '<p style="margin:0px;text-align:left;"><span style="display: inline-block;width:90px;text-align:right;margin-right:12px;color:#9A9A9A;">导入链接</span>'+   
										            '<a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.BibTeX+'" download="">BibTeX</a> &nbsp;&nbsp;<a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.EndNote+'" download="">EndNote</a>&nbsp;&nbsp;'+ 
										            '<a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.RefMan+'" download="">RefMan</a> &nbsp;&nbsp;<a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.NoteFirst+'" download="">NoteFirst</a>&nbsp;&nbsp;'+ 
										            '<a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.NoteExpress+'" download="">NoteExpress</a></p></div>'
					    });
						
					});
//				}
				
				
				
	    }
		//阅读按钮
		function readMethod(params){
			var dir=params.getAttribute('dir');
			var zttype=params.getAttribute('zttype');
			var islook=params.getAttribute('islook');
			
			if(islook=='true'){
				window.open('../readPage/index.html?DIR='+dir+'&ZTTYPE='+zttype);
				
			}
			
		}
		

