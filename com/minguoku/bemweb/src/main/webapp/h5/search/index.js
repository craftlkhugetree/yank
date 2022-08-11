//获取查询的关键字
    var keywords='';
    var keyworsArray=[];
    //console.log(JSON.stringify(keywords));
    var pageIndex=0 ;  //初始页索引
    var pageSize =3; //每页数据条数
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
	  	   seniorsearchloaddata();  
	  }else{                                           //关键字搜索
	  	   $('.keywords').text(decodeURI(GLOBAL.GETQUERYSTRING('KEYWORDS')));
	  	   keywords=GLOBAL.GETQUERYSTRING('KEYWORDS');
	  	   
	  	    if(document.getElementById("squaredThree").checked){         //在结果内搜索
				keyworsArray.push(decodeURI(keywords));
				keyworsArray=uniqueArray(keyworsArray);
				$('.keywords').text(keyworsArray);
			}else{                                                       //不在结果内搜索
				keyworsArray=[];
				keyworsArray.push(decodeURI(keywords));
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
						$('.tree').empty();
					    $('.showbookcontent').empty();
					    $('.bookDetail').empty();
					    keywords=$.trim($('.inputkeywordclass').val());
					    //$('.keywords').text(decodeURI(keywords));
					    
					    if(document.getElementById("squaredThree").checked){         //在结果内搜索
							keyworsArray.push(decodeURI(keywords));
							keyworsArray=uniqueArray(keyworsArray);
							$('.keywords').text(keyworsArray);
						}else{                                                       //不在结果内搜索
							keyworsArray=[];
							keyworsArray.push(decodeURI(keywords));
							$('.keywords').text(decodeURI(keywords));
						}
					    initloadPage();
					}
	        }
	});
	
    
    $('.search .seniorlocalsearchbutton').on('click',seniorsearch); 
    $('.search .classfiysearchbutton').on('click',classifysearch); 
    
});

    //初始化加载页面
    function initloadPage(){
    	    dao.bookInfo({
				  	data:JSON.stringify({"start":"0","limit":"3","page":"1","KEYWORD":keyworsArray})
				  }).done(function(res){
				  	  totalSize=res.BOOKTOTAl;
				  	  $('#categoryTemp').tmpl(res).appendTo('.tree');
				  	  $('#bookTemp').tmpl(res).appendTo('.showbookcontent');
			          // console.log(res);
			          if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
			          	        //第一个
			          	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+res.BOOKLIST[0].FILEPATH,
									function(data){
							  	  		    data.DIR=encryData(res.BOOKLIST[0].DIR);
							  	  		    data.ZTTYPE=encryData(res.BOOKLIST[0].ZTTYPE);
							  	  		    data.ISLOOK=res.BOOKLIST[0].ISLOOK;
							  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+data.BOOKIMG;
							  	  		    console.log(data.BOOKIMG);
							  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
							  	  		    highlight(keyworsArray,'book');
//							  	  		    res.BOOKLIST[0].ISLOOK=false;
							  	  		    //判断是否可阅读
				  	  		                isread(res.BOOKLIST[0].ISLOOK,data);
   						  	  		    
						  	    });
						  	    //第二个
						  	    if(res.BOOKLIST.length>1){
						  	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+res.BOOKLIST[1].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[1].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[1].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[1].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
								
								  	  		    highlight(keyworsArray,'book');
							  	  		    	isread(res.BOOKLIST[1].ISLOOK,data);
							  	  		    
							  	    });	
						  	    }
						  	    //第三个
						  	    if(res.BOOKLIST.length>2){
						  	    	$.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+res.BOOKLIST[2].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[2].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[2].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[2].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
								  	  		    highlight(keyworsArray,'book');
							  	  		    	isread(res.BOOKLIST[2].ISLOOK,data);
							  	  		    
							  	    });
						  	    }
						  	    
                            
								  	  
			          }else{
				  	  	
						  		  $('.cateinfo').css({
						  		  	  "height": "36px",
	                                  "border-bottom": "1px solid #000"
						  		  });
					  }
				  	  //点击分页
				  	  if(res.hasOwnProperty('BOOKTOTAl')){
				  	  	        $('#div_pager').pagination({
					  	  	            callback: PageCallback,
//								    pageCount:res.BOOKTOTAl/3+1,
										totalData:res.BOOKTOTAl,
										current_page: pageIndex,//当前页索引
										showData:3,
										current:1,
										prevCls:'prev',
										nextCls:'next',
										activeCls:'active',
										count:3,
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
    	    dao.seniorsearch({
				  	data:JSON.stringify({"start":"0","limit":"3","page":"1","filter":{"TITLE":decodeURI(GLOBAL.GETQUERYSTRING('TITLE')),"SERIES":decodeURI(GLOBAL.GETQUERYSTRING('SERIES'))
				  	  ,"PUBLISHERNAME":decodeURI(GLOBAL.GETQUERYSTRING('PUBLISHERNAME')),"ADDRESS":decodeURI(GLOBAL.GETQUERYSTRING('ADDRESS')),"PUBDATE":decodeURI(GLOBAL.GETQUERYSTRING('PUBDATE'))
				  	  ,"KEYWORD":decodeURI(GLOBAL.GETQUERYSTRING('KEYWORD')),"ZTTYPE":decodeURI(GLOBAL.GETQUERYSTRING('ZTTYPE')),"AUTHOR":decodeURI(GLOBAL.GETQUERYSTRING('AUTHOR'))}})
				  }).done(function(res){
				  	  totalSize=res.BOOKTOTAl;
				  	  $('#categoryTemp').tmpl(res).appendTo('.tree');
				  	  $('#bookTemp').tmpl(res).appendTo('.showbookcontent');
			          // console.log(res);
			          
			          if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
			          	        //第一个
			          	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+res.BOOKLIST[0].FILEPATH,
									function(data){
							  	  		    data.DIR=encryData(res.BOOKLIST[0].DIR);
							  	  		    data.ZTTYPE=encryData(res.BOOKLIST[0].ZTTYPE);
							  	  		    data.ISLOOK=res.BOOKLIST[0].ISLOOK;
							  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+data.BOOKIMG;
							  	  		    console.log(data.BOOKIMG);
							  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
				  	  		                //判断是否可阅读
				  	  		                isread(res.BOOKLIST[0].ISLOOK,data);
   						  	  		    
						  	    });
						  	    //第二个
						  	    if(res.BOOKLIST.length>1){
						  	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+res.BOOKLIST[1].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[1].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[1].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[1].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		    
							  	  		    	isread(res.BOOKLIST[1].ISLOOK,data);
							  	  		    
							  	    });	
						  	    }
						  	    //第三个
						  	    if(res.BOOKLIST.length>2){
						  	    	$.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+res.BOOKLIST[2].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[2].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[2].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[2].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		    
							  	  		    	isread(res.BOOKLIST[2].ISLOOK,data);
							  	  		    
							  	    });
						  	    }
						  	    

								  	  
			          }else{
				  	  	
						  		  $('.cateinfo').css({
						  		  	  "height": "36px",
	                                  "border-bottom": "1px solid #000"
						  		  });
					  }
				  	  //点击分页
				  	  if(res.hasOwnProperty('BOOKTOTAl')){
				  	  	        $('#div_pager').pagination({
					  	  	        callback: seniorSearchCallback,
//								    pageCount:res.BOOKTOTAl/3+1,
									totalData:res.BOOKTOTAl,
									current_page: pageIndex,//当前页索引
									showData:3,
									current:1,
									prevCls:'prev',
									nextCls:'next',
									activeCls:'active',
									count:3,
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
			  $('.tree').empty();
			  $(".bookDetail").empty();
			  $(".showbookcontent").empty();
			 // $('.keywords').text('');
			  //alert(params.getAttribute('value'));
			  dao.filterBook({
			  	data:JSON.stringify({"start":0,"limit":3,"page":1,"BOOKIDS":params.getAttribute('value')})
			  	//data:JSON.stringify({'filter':{'bookids':params.getAttribute('value')}})
			  }).done(function(res){
			  	    
			  	    
					  	totalSize=res.BOOKTOTAl;
					  	$('#categoryTemp').tmpl(res).appendTo('.tree');
//				  	  $('#categoryTemp').tmpl(res).appendTo('.tree');
				  	  $('#bookTemp').tmpl(res).appendTo('.showbookcontent');
		          
		            if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
		          	
		          	            $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+res.BOOKLIST[0].FILEPATH,
									function(data){
							  	  		    data.DIR=encryData(res.BOOKLIST[0].DIR);
							  	  		    data.ZTTYPE=encryData(res.BOOKLIST[0].ZTTYPE);
							  	  		    data.ISLOOK=res.BOOKLIST[0].ISLOOK;
							  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+data.BOOKIMG;
							  	  		    console.log(data.BOOKIMG);
							  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
				  	  		                //判断是否可阅读
				  	  		                isread(res.BOOKLIST[0].ISLOOK,data);
   						  	  		    
						  	    });
						  	    
						  	    if(res.BOOKLIST.length>1){
						  	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+res.BOOKLIST[1].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[1].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[1].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[1].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		    
							  	  		    	isread(res.BOOKLIST[1].ISLOOK,data);
							  	  		    
							  	    });	
						  	    }
						  	    if(res.BOOKLIST.length>2){
						  	    	$.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+res.BOOKLIST[2].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[2].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[2].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[2].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		    
							  	  		    	isread(res.BOOKLIST[2].ISLOOK,data);
							  	  		    
							  	    });
						  	    }
		          	
		          	
						  	  
						  	  
						  	  
					  	}else{
					  		  $('.cateinfo').css({
					  		  	  "height": "36px",
                                  "border-bottom": "1px solid #000"
					  		  });
					  	}
					  	//点击分页
					  	if(res.hasOwnProperty('BOOKTOTAl')){
					            $('#div_pager').pagination({
					  	  	        callback: categoryCallback,
									totalData:res.BOOKTOTAl,
									current_page: pageIndex,//当前页索引
									showData:3,
									current:1,
									prevCls:'prev',
									nextCls:'next',
									activeCls:'active',
									count:3,
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

    /**
     * 分页
    */
        //查询关键字分页回调函数
    var time=0;
    function PageCallback(index, jq) {
    	        $(".bookDetail").empty();
    	        //判断计时器是否处于关闭状态--不能连续点击
			    if (time == 0) {
			        time = 1; //设定间隔时间（秒）
			 
			        //启动计时器，倒计时time秒后自动关闭计时器。
			        var indexVar = setInterval(function(){
			            time--;
			            if (time == 0) {
			                clearInterval(indexVar);
			            }
			        }, 1000);
			       
			       InitTable(index);
			    }  
      	
    }
    //查询关键字分页
    function InitTable(pageIndex) {
    	  //$(".bookDetail").empty();
    	  //每页索引
    	 
	     var start=3*(pageIndex.getCurrent())-3;
	     
	     dao.bookInfo({
				  	data:JSON.stringify({"start":start,"limit":3,"page":pageIndex.getCurrent(),"KEYWORD":keyworsArray})
				  }).done(function(res){
				  	    if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
				  	  	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+res.BOOKLIST[0].FILEPATH,
									function(data){
							  	  		    data.DIR=encryData(res.BOOKLIST[0].DIR);
							  	  		    data.ZTTYPE=encryData(res.BOOKLIST[0].ZTTYPE);
							  	  		    data.ISLOOK=res.BOOKLIST[0].ISLOOK;
							  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+data.BOOKIMG;
							  	  		    console.log(data.BOOKIMG);
							  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
							  	  		    //高亮显示
							  	  		    highlight(keyworsArray,'book');
							  	  		    
				  	  		                //判断是否可阅读
				  	  		                isread(res.BOOKLIST[0].ISLOOK,data);
   						  	  		    
						  	    });
						  	    
						  	    if(res.BOOKLIST.length>1){
						  	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+res.BOOKLIST[1].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[1].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[1].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[1].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		                
								  	  		    highlight(keyworsArray,'book');
								  	  		    
							  	  		    	isread(res.BOOKLIST[1].ISLOOK,data);
							  	  		    
							  	    });	
						  	    }
						  	    if(res.BOOKLIST.length>2){
						  	    	$.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+res.BOOKLIST[2].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[2].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[2].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[2].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		                
								  	  		    highlight(keyworsArray,'book');
								  	  		    
							  	  		    	isread(res.BOOKLIST[2].ISLOOK,data);
							  	  		    
							  	    });
						  	    }
				  	    }else{
				  	  	
					  		  $('.cateinfo').css({
					  		  	  "height": "36px",
                                  "border-bottom": "1px solid #000"
					  		  });
					  	}
				  	    
				  	 
				  });
 
    }
    
    //分类过滤回调函数
    function categoryCallback(index, jq) {
    	  
      	categoryInitTable(index);
    }
    
    //分类过滤分页
    function categoryInitTable(pageIndex) {
    	  $(".bookDetail").empty();
    	  //每页索引
    	  
	     var start=3*(pageIndex.getCurrent())-3;
	     
	     dao.filterBook({
				  	data:JSON.stringify({"start":start,"limit":3,"page":pageIndex.getCurrent(),"BOOKIDS":bookids})
				  }).done(function(res){
				  	  
				  	  if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
				  	  	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+res.BOOKLIST[0].FILEPATH,
									function(data){
							  	  		    data.DIR=encryData(res.BOOKLIST[0].DIR);
							  	  		    data.ZTTYPE=encryData(res.BOOKLIST[0].ZTTYPE);
							  	  		    data.ISLOOK=res.BOOKLIST[0].ISLOOK;
							  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+data.BOOKIMG;
							  	  		    console.log(data.BOOKIMG);
							  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
				  	  		                //判断是否可阅读
				  	  		                isread(res.BOOKLIST[0].ISLOOK,data);
   						  	  		    
						  	    });
						  	    
						  	    if(res.BOOKLIST.length>1){
						  	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+res.BOOKLIST[1].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[1].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[1].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[1].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		    
							  	  		    	isread(res.BOOKLIST[1].ISLOOK,data);
							  	  		    
							  	    });	
						  	    }
						  	    if(res.BOOKLIST.length>2){
						  	    	$.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+res.BOOKLIST[2].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[2].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[2].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[2].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		    
							  	  		    	isread(res.BOOKLIST[2].ISLOOK,data);
							  	  		    
							  	    });
						  	    }
				  	  }else{
				  	  	
					  		  $('.cateinfo').css({
					  		  	  "height": "36px",
                                  "border-bottom": "1px solid #000"
					  		  });
					  	}
				  	    
				  	 
				  });
 
    }
    
    //高级搜索回调函数
    var seniortime=0;
    function seniorSearchCallback(index, jq) {
    	    $(".bookDetail").empty();
    	    //判断计时器是否处于关闭状态--不能连续点击
		    if (seniortime == 0) {
		        seniortime = 1; //设定间隔时间（秒）
		 
		        //启动计时器，倒计时time秒后自动关闭计时器。
		        var indexVar = setInterval(function(){
		            seniortime--;
		            if (seniortime == 0) {
		                clearInterval(indexVar);
		            }
		        }, 1000);
		       
		       seniorSearchInitTable(index);
		    } 
      	
    }
    
    //高级搜索分页
    function seniorSearchInitTable(pageIndex) {
//  	  $(".bookDetail").empty();
    	  //每页索引
    	  
	     var start=3*(pageIndex.getCurrent())-3;
	     
	     dao.seniorsearch({
				  	data:JSON.stringify({"start":start,"limit":3,"page":pageIndex.getCurrent(),"filter":{"TITLE":decodeURI(GLOBAL.GETQUERYSTRING('TITLE')),"SERIES":decodeURI(GLOBAL.GETQUERYSTRING('SERIES'))
				  	  ,"PUBLISHERNAME":decodeURI(GLOBAL.GETQUERYSTRING('PUBLISHERNAME')),"ADDRESS":decodeURI(GLOBAL.GETQUERYSTRING('ADDRESS')),"PUBDATE":decodeURI(GLOBAL.GETQUERYSTRING('PUBDATE'))
				  	  ,"KEYWORD":decodeURI(GLOBAL.GETQUERYSTRING('KEYWORD')),"ZTTYPE":decodeURI(GLOBAL.GETQUERYSTRING('ZTTYPE')),"EDUTYPE":decodeURI(GLOBAL.GETQUERYSTRING('EDUTYPE'))}})
				}).done(function(res){
				  	  
				  	  if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
				  	  	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+res.BOOKLIST[0].FILEPATH,
									function(data){
							  	  		    data.DIR=encryData(res.BOOKLIST[0].DIR);
							  	  		    data.ZTTYPE=encryData(res.BOOKLIST[0].ZTTYPE);
							  	  		    data.ISLOOK=res.BOOKLIST[0].ISLOOK;
							  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[0].DIR+"/"+data.BOOKIMG;
							  	  		    console.log(data.BOOKIMG);
							  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
				  	  		                //判断是否可阅读
				  	  		                isread(res.BOOKLIST[0].ISLOOK,data);
   						  	  		    
						  	    });
						  	    
						  	    if(res.BOOKLIST.length>1){
						  	        $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+res.BOOKLIST[1].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[1].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[1].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[1].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[1].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		    
							  	  		    	isread(res.BOOKLIST[1].ISLOOK,data);
							  	  		    
							  	    });	
						  	    }
						  	    if(res.BOOKLIST.length>2){
						  	    	$.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+res.BOOKLIST[2].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[2].DIR);
							  	  		        data.ZTTYPE=encryData(res.BOOKLIST[2].ZTTYPE);
							  	  		        data.ISLOOK=res.BOOKLIST[2].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[2].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		    
							  	  		    	isread(res.BOOKLIST[2].ISLOOK,data);
							  	  		    
							  	    });
						  	    }
				  	  }else{
				  	  	
					  		  $('.cateinfo').css({
					  		  	  "height": "36px",
                                  "border-bottom": "1px solid #000"
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
	            	$('.startreadimgQuote'+data.ID).attr('src',"../img/icon-ref-blue.png");
		    	
	  		    	$('.startreadbutton'+data.ID).on('click',function(){
	  		    		  return true
	  		    	});
	  		    	
	            }else{
	            	$('.startreadimg'+data.ID).attr('src',"../img/search_09.png");
	            	$('.startreadimgQuote'+data.ID).attr('src',"../img/icon-ref-gray.png");
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
				
				if(islook=='true'){
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
				}
				
				
				
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
		

