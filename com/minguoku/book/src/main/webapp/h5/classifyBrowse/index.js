//获取查询的关键字

    var keyworsArray=[];
    //console.log(JSON.stringify(keywords));
    var pageIndex=0 ;  //初始页索引
    var pageSize =10; //每页数据条数
    var totalSize=0; //设置默认总数据条数
    var bookids;     //分类id
    var dao={};
    var time = 0;
	var qu = {}; //引用
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
//			    layer.open({
//	    		  type: 1,
//	    		  skin: 'layui-layer-rim', //加上边框
//	    		  area: ['300px', '150px'], //宽高
//	    		  offset:['200px', ''],
//	    		  content: '<p style="text-align:center;margin-top:30px;">加载中......</p>'
//	    		});
	            
	            //判断计时器是否处于关闭状态
//			    if (time == 0) {
//			        time = 2; //设定间隔时间（秒）
//			 
//			        //启动计时器，倒计时time秒后自动关闭计时器。
//			        var index = setInterval(function(){
//			            time--;
//			            if (time == 0) {
//			                clearInterval(index);
//			            }
//			        }, 1000);
			        layer.load(1, {
					  shade: [0.01,'#fff'], //0.1透明度的白色背景
				      offset:['400px', ''] //0.1透明度的白色背景
					});
			       
			       
			        categoryFilterBook(treeNode.BOOKIDS);	
//			    }
	            
	            
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

    $('.backtop').on('click',function(){
        
    	 $('body').animate({scrollTop:0},'fast');
    });
    
    //屏蔽键盘事件
    document.onkeydown = function (){
         var e = window.event || arguments[0];
         //F12
         if(e.keyCode == 123){
             return false;
         //Ctrl+Shift+I
         }
    };
    
    //屏蔽鼠标右键
    document.oncontextmenu = function (){
       return true;
    }
    
});
    
    
    //初始化加载页面
    function initloadPage(setting){
    	    layer.load(1, {
				  shade: [0.01,'#fff'], //0.1透明度的白色背景
				  offset:['400px', '']
			});
    	    dao.bookInfo({
				  	data:JSON.stringify({"start":"0","limit":"10","page":"1"})
				  }).done(function(res){
			          layer.closeAll(); 
				  	  
				  	  totalSize=res.BOOKTOTAl;
//				  	    $('.expertComment .ztree').css('max-height',$('.expertComment').height()-84);
				  	    $.fn.zTree.init($("#treeDemo"), setting, res.CALEGORY);
				  	    
				  	    //默认ztree加载一条数据
				  	    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
				  	    if(res.CALEGORY.length>0&&res.CALEGORY[0].hasOwnProperty('id')){
				  	        var node = treeObj.getNodeByParam("id", res.CALEGORY[0].id);
							treeObj.selectNode(node);
							
							treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node);//调用事件  	
				  	    }
				  	    
				  	   
				  	   $.fn.zTree.init($("#subjectDemo"), setting, res.EDUCALEGORY);
						
				  	  
				  });
    }
    
    window.onscroll = function(){
    	
         if(document.body.scrollTop>=100){
         	$('.backtop').fadeIn(1000);
         }else{
         	$('.backtop').fadeOut(1000);
         }

    }
    
    function pageComm (callback, current) {
		$('#div_pager,#div_pager2').pagination({
				callback: callback,
				totalData: totalSize,
				showData: pageSize,
				current: current,
				prevCls:'prev',
				nextCls:'next',
				activeCls:'active',
				count:2,
				coping:true,
				homePage:'首页',
				endPage:'末页',
				prevContent:'上页',
				nextContent:'下页',
				showGoInput: true,
				showGoButton: true,
				jump: true
		});			
	}
    
    
    //点击分类过滤书本
		function categoryFilterBook(params){
			  bookids=params;
			  $(".bookDetail").empty();
			  $(".showbookcontent").empty();
			  dao.filterBook({
			  	data:JSON.stringify({"start":0,"limit":10,"page":1,"BOOKIDS":params})
			  	//data:JSON.stringify({'filter':{'bookids':params.getAttribute('value')}})
			  }).done(function(res){
				        layer.closeAll(); 
					  	totalSize=res.BOOKTOTAl;
					  	if(!res.hasOwnProperty('BOOKTOTAl')){
					  		res.BOOKTOTAl=0;
					  	}
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
								  	  		    
								  	  		    data.AUTHORER=data.AUTHOR;
								  	  		    var authors=[];
								  	  		    if(data.hasOwnProperty('AUTHOR')&&data.AUTHOR!=''){
								  	  		        var authorSplit=data.AUTHOR.split(',');
								  	  		       
								  	  		        for (var j=0;j<authorSplit.length;j++) {
								  	  		        	authors.push({NAME:authorSplit[j]});
								  	  		        }	
								  	  		    }
								  	  		    data.AUTHOR=authors;
								  	  		    
//								  	  		    data.ZTTYPE=encryData(res.BOOKLIST[i].ZTTYPE);
								  	  		    data.ISLOOK=res.BOOKLIST[i].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		                //判断是否可阅读
					  	  		                isread(res.BOOKLIST[i].ISLOOK,data);
					  	  		                //判断是否有全文
					  	  		                isfull(res.BOOKLIST[i].ISTEXT,data);
	   						  	  		    
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
					  	//alert(res.BOOKTOTAl);
					  	if(res.hasOwnProperty('BOOKTOTAl')&&Number(res.BOOKTOTAl)>=1){
					  	       pageComm(categoryCallback, 1)
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
    	 
	     var start=10*(pageIndex.getCurrent())-10;
	     
	     dao.bookInfo({
				  	data:JSON.stringify({"start":start,"limit":10,"page":pageIndex.getCurrent(),"KEYWORD":keyworsArray})
				  }).done(function(res){
				  	    if(res.hasOwnProperty('BOOKLIST')&&res.BOOKLIST.length>0){
				  	    	    $.ajaxSettings.async = false;
				  	    	    
				  	    	    for(var i=0;i<res.BOOKLIST.length;i++) {
		          	                $.getJSON(GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+res.BOOKLIST[i].FILEPATH,
										function(data){
								  	  		    data.DIR=encryData(res.BOOKLIST[i].DIR);
								  	  		    if(res.BOOKLIST[i].hasOwnProperty('ZTTYPE')){
								  	  		      data.ZTTYPE=encryData(res.BOOKLIST[i].ZTTYPE);	
								  	  		    }
								  	  		    
								  	  		    data.AUTHORER=data.AUTHOR;
								  	  		    var authors=[];
								  	  		    if(data.hasOwnProperty('AUTHOR')&&data.AUTHOR!=''){
								  	  		        var authorSplit=data.AUTHOR.split(',');
								  	  		       
								  	  		        for (var j=0;j<authorSplit.length;j++) {
								  	  		        	authors.push({NAME:authorSplit[j]});
								  	  		        }	
								  	  		    }
								  	  		    data.AUTHOR=authors;
//								  	  		    data.ZTTYPE=encryData(res.BOOKLIST[i].ZTTYPE);
								  	  		    data.ISLOOK=res.BOOKLIST[i].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		                //判断是否可阅读
					  	  		                isread(res.BOOKLIST[i].ISLOOK,data);
					  	  		                //判断是否有全文
					  	  		                isfull(res.BOOKLIST[i].ISTEXT,data);
	   						  	  		    
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
				  	    
//				  	    $('.expertComment .ztree').css('max-height',$('.expertComment').height()-84);
				  	    
				  	 
				  });
 
    }
    
    //分类过滤回调函数
    var timePage=0;
    function categoryCallback(index) {
    	    pageComm(categoryCallback, index.getCurrent())
			//判断计时器是否处于关闭状态
//	    	layer.open({
//	  		  type: 1,
//	  		  skin: 'layui-layer-rim', //加上边框
//	  		  area: ['300px', '150px'], //宽高
//	  		  offset:['200px', ''],
//	  		  content: '<p style="text-align:center;margin-top:30px;">加载中......</p>'
//	  		});
//		    if (timePage == 0) {
//		        timePage = 1; //设定间隔时间（秒）
//		 
//		        //启动计时器，倒计时time秒后自动关闭计时器。
//		        var indexVar = setInterval(function(){
//		            timePage--;
//		            if (timePage == 0) {
//		                clearInterval(indexVar);
//		            }
//		        }, 1000);
		        layer.load(1, {
					  shade: [0.01,'#fff'], //0.1透明度的白色背景
					  offset:['400px', '']
				});
		       categoryInitTable(index);
//		    }
      	
    }
    
    //分类过滤分页
    function categoryInitTable(pageIndex) {
    	  $(".bookDetail").empty();
    	  //每页索引
    	  
	     var start=10*(pageIndex.getCurrent())-10;
	     
	     dao.filterBook({
				  	data:JSON.stringify({"start":start,"limit":10,"page":pageIndex.getCurrent(),"BOOKIDS":bookids})
				  }).done(function(res){
					  totalSize=res.BOOKTOTAl;
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
								  	  		    
								  	  		    data.AUTHORER=data.AUTHOR;
								  	  		    var authors=[];
								  	  		    if(data.hasOwnProperty('AUTHOR')&&data.AUTHOR!=''){
								  	  		        var authorSplit=data.AUTHOR.split(',');
								  	  		       
								  	  		        for (var j=0;j<authorSplit.length;j++) {
								  	  		        	authors.push({NAME:authorSplit[j]});
								  	  		        }	
								  	  		    }
								  	  		    data.AUTHOR=authors;
								  	  		    
//								  	  		    data.ZTTYPE=encryData(res.BOOKLIST[i].ZTTYPE);
								  	  		    data.ISLOOK=res.BOOKLIST[i].ISLOOK;
								  	  		    data.BOOKIMG=GLOBAL.BOOKURL+res.BOOKLIST[i].DIR+"/"+data.BOOKIMG;
								  	  		    $('#pageTemp').tmpl(data).appendTo('.bookDetail');
					  	  		                //判断是否可阅读
					  	  		                isread(res.BOOKLIST[i].ISLOOK,data);
					  	  		                //判断是否有全文
					  	  		                isfull(res.BOOKLIST[i].ISTEXT,data);
	   						  	  		    
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

		//判断是否有全文
		function  isfull(istext,data){
			 if(istext=='1'){
            	$('.fullimage'+data.ID).show();
            }
		}
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
		
		//引用
		$('body').on('click','.quto-dow',function(ev){
			$('#showPoint').css("display","block");
			$('#showPoint').css("left", ev.clientX-20); 
			$('#showPoint').css("top", $(this)[0].offsetTop + 430); 
			var dir=$(this).data('dir');
			var zttype=$(this).data('ztype');
			qu.id = $(this).data('id');
			qu.url =window.location.protocol + '//'+window.location.hostname +'/book/h5/readPage/index.html?DIR='+dir+'&ZTTYPE='+zttype;
		});
		
		//阅读按钮
		function readMethod(params){
			var dir=params.getAttribute('dir');
			var zttype=params.getAttribute('zttype');
			var islook=params.getAttribute('islook');
			
			if(islook=='true'){
				window.open('../readPage/index.html?DIR='+dir+'&ZTTYPE='+zttype);
				
			}
			
		}
		
		var d1 = document.getElementById('showPoint');  
			d1.onmouseout = mouseout_x ;  	
			function mouseout_x( ae ){  
				var e = window.event || ae;  
				var s = e.toElement || e.relatedTarget;     
				if(document.all){     
					if( !this.contains(s) ){     
						$('#showPoint').hide();   
					}     
				}else{     
					var res= this.compareDocumentPosition(s) ;       
					if( ! ( res == 20 || res == 0) ){        
						$('#showPoint').hide();     
					}       
				}    
			} 
			$('.p-download').click(function(){
				var url = encodeURIComponent(qu.url);
				id = qu.id;
				type = $(this).data('text');
				window.open(GLOBAL.URL+"Book/getQuote?url="+url+"&id="+id+"&type="+type);
			});	
			// 搜索按钮事件
		$('.toSearch').on('click', function () {
			location.href="../search/index.html?KEYWORDS="+encodeURI($.trim($('.inputkeywordclass').val()));	
		})

