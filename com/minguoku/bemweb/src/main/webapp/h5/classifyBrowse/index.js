//获取查询的关键字

    var keyworsArray=[];
    //console.log(JSON.stringify(keywords));
    var pageIndex=0 ;  //初始页索引
    var pageSize =3; //每页数据条数
    var totalSize=0; //设置默认总数据条数
    var bookids;     //分类id
    var dao={};
    var time = 0;
$(function(){//banner轮播图
	
	//加载树结构的参数
       var setting = {
			view: {
				//showIcon: showIconForTree
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				onClick: zTreeOnClick
			},
			view: {
				addDiyDom: addDiyDom,
				dblClickExpand: true,
				showIcon: false,
				fontCss: setFontCss
			}
		};
		
		function addDiyDom(treeId, treeNode) {
			var aObj = $("#" + treeNode.tId + "_a");
			if ($("#diyBtn_"+treeNode.id).length>0) return;
			var editStr;
			if(treeNode.hasOwnProperty('COUNT')){
				editStr = "<div id='diyBtn_space_" +treeNode.id+ "'> </div><span>"+treeNode.COUNT+"</span>";
			}else{
				editStr = "<div id='diyBtn_space_" +treeNode.id+ "'> </div><span>"+0+"</span>";
			}
			aObj.append(editStr);
//			var btn = $("#diyBtn_"+treeNode.id);
//			if (btn) btn.bind("click", function(){alert("diy Button for " + treeNode.name);});
		}
		
		function setFontCss(treeId, treeNode) {
			return {height: '24px'};
		}
		
		function zTreeOnClick(event, treeId, treeNode){
//			console.log(treeNode);
//	        if(!treeNode.hasOwnProperty('BOOKIDS')){
//              alert('该分类没有图书！');
//	        }else{
	            
	            
	            //判断计时器是否处于关闭状态
			    if (time == 0) {
			        time = 2; //设定间隔时间（秒）
			 
			        //启动计时器，倒计时time秒后自动关闭计时器。
			        var index = setInterval(function(){
			            time--;
			            if (time == 0) {
			                clearInterval(index);
			            }
			        }, 1000);
			       
			       categoryFilterBook(treeNode.BOOKIDS);	
			    }
	            
	            
//	        }
			
		}
			        

		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		}
	  
//  $('.keywords').text(decodeURI(keywords));
    dao.bookInfo=function(param){
    	  return dkr.util.ajaxPost(GLOBAL.URL+'Book/categorySearch', param)
    }
    //分类过滤书本
    dao.filterBook=function(param){
    	  return dkr.util.ajaxPost(GLOBAL.URL+'Book/searchBookByType', param)
//        return dkr.util.ajaxPost('bookDetail.json', param)
    }
    
    //引用
     dao.quote=function(param){
        	return dkr.util.ajaxPost(GLOBAL.URL+'Book/quote', param)
     }
//  //高级搜索接口
//  dao.seniorsearch=function(param){
//  	
//	    return dkr.util.ajaxPost(GLOBAL.URL+'Book/advancedSearch', param)
//	    
//	}
	  
	  
	  //初始化加载
	  
	  initloadPage(setting); 	      
	  
	 
	 
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
						window.open("../search/index.html?KEYWORDS="+$.trim($('.inputkeywordclass').val()));	
						
					}
				
	        }
	});
	
	    
    $('.search .seniorlocalsearchbutton').on('click',seniorsearch); 
//  $('.search .classfiylocalsearchbutton').on('click',classifylocalsearch); 
    
});
    
    
    //初始化加载页面
    function initloadPage(setting){
    	    dao.bookInfo({
				  	data:JSON.stringify({"start":"0","limit":"3","page":"1"})
				  }).done(function(res){
			
				  	  $.fn.zTree.init($("#treeDemo"), setting, res.CALEGORY);
				  	  
				  	  $.fn.zTree.init($("#subjectDemo"), setting, res.EDUCALEGORY);
				  	  
				  	  totalSize=res.BOOKTOTAl;
				  	  
				  	    //默认ztree加载一条数据
				  	    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
						var node = treeObj.getNodeByParam("id", res.CALEGORY[0].id);
						treeObj.selectNode(node);
						
						treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node);//调用事件  
				  	  
				  });
    }
    
    
    
    
    //点击分类过滤书本
		function categoryFilterBook(params){
			  bookids=params;
			  $(".bookDetail").empty();
			  $(".showbookcontent").empty();
			  dao.filterBook({
			  	data:JSON.stringify({"start":0,"limit":3,"page":1,"BOOKIDS":params})
			  	//data:JSON.stringify({'filter':{'bookids':params.getAttribute('value')}})
			  }).done(function(res){
			  	    
					  	totalSize=res.BOOKTOTAl;
					  	if(!res.hasOwnProperty('BOOKTOTAl')){
					  		res.BOOKTOTAl=0;
					  	}
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
					  	//alert(res.BOOKTOTAl);
					  	if(res.hasOwnProperty('BOOKTOTAl')&&Number(res.BOOKTOTAl)>=1){
					  	       //点击分页
						  	    $('#div_pager').pagination({
						  	  	        callback: categoryCallback,
										totalData:res.BOOKTOTAl,
										current_page: 1,//当前页索引
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
					  	}else{
					  		    //点击分页
						  	    $('#div_pager').pagination({
						  	  	        callback: categoryCallback,
										totalData:1,
										current_page: 1,//当前页索引
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

    /**
     * 分页
    */
        //查询关键字分页回调函数
    function PageCallback(index, jq) {
    	  
      	InitTable(index);
    }
    //查询关键字分页
    function InitTable(pageIndex) {
    	  $(".bookDetail").empty();
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
    
    //分类过滤回调函数
    var timePage=0;
    function categoryCallback(index, jq) {
    	    //判断计时器是否处于关闭状态
		    if (timePage == 0) {
		        timePage = 1; //设定间隔时间（秒）
		 
		        //启动计时器，倒计时time秒后自动关闭计时器。
		        var indexVar = setInterval(function(){
		            timePage--;
		            if (timePage == 0) {
		                clearInterval(indexVar);
		            }
		        }, 1000);
		       
		       categoryInitTable(index);
		    }
      	
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
    
    
        //分类搜索
//		function classifylocalsearch(){
//			
//			if($.trim($('.inputkeywordclass').val())){
//			          $('.tree').empty();
//					  $('.showbookcontent').empty();
//					  $('.bookDetail').empty();
//					  
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
		
		//引用
		function quoteMethod(params){
		
				var title=params.getAttribute('value');
				var author=params.getAttribute('name');
				var holder=params.getAttribute('holder');
				var createyear=params.getAttribute('createyear');
				
				var islook=params.getAttribute('islook');
				console.log(islook);
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
		
		

