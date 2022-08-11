
var dao = {};
var nodePAGE;
var zjPage=[];
var bookID;

var fontSizeWidth;
var fontSizeHeight;

$(function(){
	//静止页面复制，图片下载
	function stop(){ 
		return false; 
	} 
	document.oncontextmenu=stop; 
	
        //加载树结构的参数
        var setting = {
			view: {
				showIcon: false
				//showIcon: showIconForTree
			},
			callback: {
				onClick: zTreeOnClick
			},
			data: {
				simpleData: {
					enable: true
				},
				key:{
					//title:"TITLE",
					name: "TITLE",
					id:"ZJ",
					pId:"PZJ",
					children:"children",
					checked:"checked"
				}
			},
			view: {
				addDiyDom: addDiyDom,
				dblClickExpand: true,
				showIcon: false,
				fontCss:{height:'25px',color:'#000'}
//				fontCss: setFontCss
			}
		};
		
		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		}
		
		function addDiyDom(treeId, treeNode) {
			var aObj = $("#" + treeNode.tId + "_a .node_name");
			if ($("#diyBtn_"+treeNode.id).length>0) return;
			//var editStr= "<div id='diyBtn_space_" +treeNode.id+ "'> </div>";
			aObj.attr('id',treeNode.tId+'_span');
			//var editStr = "<a disabled href=''> </a>";
			//aObj.append(editStr);
		}
		
		function zTreeOnClick(event, treeId, treeNode){

			$('.wordContent').empty();
			$('.allPicture').empty();
			$('.scanning').empty();
			var pagehtml=GLOBAL.PAGEURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/epub/EPUB"+"/"+"page_"+(treeNode.PAGE.length==2?'00'+treeNode.PAGE:(treeNode.PAGE.length==3?'0'+treeNode.PAGE:(treeNode.PAGE.length==1?'000'+treeNode.PAGE:'')))+".html";

			treeNode.SCANPICTURE=GLOBAL.PAGEURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/scanpic/m"+"/"+(treeNode.PAGE.length==2?'00'+treeNode.PAGE:(treeNode.PAGE.length==3?'0'+treeNode.PAGE:(treeNode.PAGE.length==1?'000'+treeNode.PAGE:'')))+".png";
			
			$('#'+treeNode.tId+'_span').addClass('active');
			$('#'+treeId).find('span').not('#'+treeNode.tId+'_span').removeClass('active');
			
			//判断文件是否存在
			pagingIsFile(pagehtml,treeNode,treeNode.PAGE);
		
			
//			console.log(treeNode);
			if(treeNode.hasOwnProperty('PAGECOUNT')&&treeNode.PAGECOUNT!=''){
				    nodePAGE=Number(treeNode.PAGE);
			        //点击分页
			  	    $('#div_pager').pagination({
			  	  	        callback: PageCallback,
							pageCount:treeNode.PAGECOUNT,
							totalData:treeNode.PAGECOUNT,
							current_page: 10,//当前页索引
							showData:1,
							current:Number(treeNode.PAGE),
							prevCls:'prev',
							nextCls:'next',
							activeCls:'active',
							count:3,
						    coping:true,
						    homePage:'首页',
						    endPage:'末页',
						    prevContent:'上页',
						    nextContent:'下页',
						    jump:true,				//跳转到指定页数
							jumpIptCls:'jump-ipt',	//文本框内容
							jumpBtnCls:'jump-btn',	//跳转按钮
							jumpBtn:'跳转',			//跳转按钮文本
						    showGoInput: true,
				            showGoButton: true
				    });	
				  
			}
			
			dao.heightLightKeyword({
			  	data:JSON.stringify({"BOOKID":bookID,"PAGENUM":Number(treeNode.PAGE),"TYPE":'1'})
			}).done(function(res){
				//console.log(res.data.items);
				var nameArray=[];
				var typeArray=[];
				for (var i=0;i<res.data.items.length;i++) {
					nameArray.push(res.data.items[i].NAME);
					typeArray.push(res.data.items[i].TYPE);
				}
				if(nameArray.length!=0){
				    setTimeout(function(){
					   highlight(nameArray,'pagecss',typeArray);	
					},500);	
				}
				
			});
			
			
			
			
		}
		
	     
	     //加载书的基本信息
	     dao.bookInfo=function(param){
	        	return dkr.util.ajaxPost(GLOBAL.URL+'Book/isRead', param)
	     }
	     
	     //搜索书的关键词
	     dao.searchBookInfo=function(param){
	        	return dkr.util.ajaxPost(GLOBAL.URL+'Book/inBookSearch', param)
	     }
	     
	     //下载
	     dao.downloadBookParaph=function(param){
	        	return dkr.util.ajaxPost(GLOBAL.URL+'Book/saveDownRecord', param)
	     }
	     
	     //引用
	     dao.quote=function(param){
	        	return dkr.util.ajaxPost(GLOBAL.URL+'Book/quote', param)
	     }
	     
	     //关键词高亮
	     dao.heightLightKeyword=function(param){
	        	return dkr.util.ajaxPost(GLOBAL.URL+'Book/pageEntry', param)
	     }
	     
	     //关键词显示详细信息
	     dao.heightLightDetail=function(param){
	        	return dkr.util.ajaxPost(GLOBAL.URL+'Book/getEntry', param)
	     }
	
	dao.bookInfo({
	  	data:JSON.stringify({"dir":decryData(GLOBAL.GETQUERYSTRING('DIR')),"ZTTYPE":decryData(GLOBAL.GETQUERYSTRING('ZTTYPE'))})
	}).done(function(res){
	  	    $('#bookInfomationTemp').tmpl(res).appendTo('.bookInfo');
            bookID=res.ID;
            for (var i=0;i<res.CALEGORY.length;i++) {
            	 res.CALEGORY[i].id=res.CALEGORY[i].ZJ;
                 res.CALEGORY[i].pId=res.CALEGORY[i].PZJ;
                 res.CALEGORY[i].PAGECOUNT=res.PAGECOUNT;
            }
	  	    $.fn.zTree.init($("#treeDemo"), setting, res.CALEGORY);
	  	    $.fn.zTree.getZTreeObj("treeDemo").expandAll(true);
	  	    //$('#bookCatalogTemp').tmpl(res).appendTo('.catalog > ul');
	  	    
	  	    if(res.hasOwnProperty('CALEGORY')&&res.CALEGORY.length>0){
	  	    	var pagehtml=GLOBAL.PAGEURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/epub/EPUB"+"/"+"page_0001.html";
                var treeNode={};
			      treeNode.SCANPICTURE=GLOBAL.PAGEURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/scanpic/m"+"/0001.png";
			    nodePAGE=Number(1);
	  	    		pagingIsFile(pagehtml,treeNode,'1');
	  	    	
	  	    		//点击分页
			  	    $('#div_pager').pagination({
			  	  	        callback: PageCallback,
							pageCount:res.PAGECOUNT,
							totalData:res.PAGECOUNT,
							current_page: 10,//当前页索引
							showData:1,
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
						    jump:true,				//跳转到指定页数
							jumpIptCls:'jump-ipt',	//文本框内容
							jumpBtnCls:'jump-btn',	//跳转按钮
							jumpBtn:'跳转',			//跳转按钮文本
						    showGoInput: true,
				            showGoButton: true
				    });
				    
	  	        //默认ztree加载一条数据
		  	    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
//				var node = treeObj.getNodeByParam("id", res.CALEGORY[0].id);
//				treeObj.selectNode(node);
//				treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node);//调用事件  	
				//获取目录所有的页数
				var node = treeObj.getNodes();
                var nodes = treeObj.transformToArray(node);
                
                nodes.forEach(function(x,y){
            	   
					zjPage.push(Number(nodes[y].PAGE));  
				});
				
				
				dao.heightLightKeyword({
				  	data:JSON.stringify({"BOOKID":res.ID,"PAGENUM":Number(1),"TYPE":'1'})
				}).done(function(res){
					//console.log(res.data.items);
					var nameArray=[];
					var typeArray=[];
					for (var i=0;i<res.data.items.length;i++) {
						nameArray.push(res.data.items[i].NAME);
						typeArray.push(res.data.items[i].TYPE);
					}
					if(nameArray.length!=0){
					    setTimeout(function(){
						   highlight(nameArray,'pagecss',typeArray);	
						},500);	
					}
					
				});
				
	  	    }else{
	  	    	if(res.hasOwnProperty('PAGECOUNT')&&res.PAGECOUNT!=''){
	  	    		nodePAGE=Number(1);
	  	    		
	  	    		
	  	    		var pagehtml=GLOBAL.PAGEURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/epub/EPUB"+"/"+"page_0001.html";
                    var treeNode={};
			           treeNode.SCANPICTURE=GLOBAL.PAGEURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/scanpic/m"+"/0001.png";
			
	  	    		
	  	    		
	  	    		pagingIsFile(pagehtml,treeNode,'1');
	  	    		
			        //点击分页
			  	    $('#div_pager').pagination({
			  	  	        callback: PageCallback,
							pageCount:res.PAGECOUNT,
							totalData:res.PAGECOUNT,
							current_page: 10,//当前页索引
							showData:1,
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
						    jump:true,				//跳转到指定页数
							jumpIptCls:'jump-ipt',	//文本框内容
							jumpBtnCls:'jump-btn',	//跳转按钮
							jumpBtn:'跳转',			//跳转按钮文本
						    showGoInput: true,
				            showGoButton: true
				    });
	  	    	}
	  	    	
		  	    		
	  	    }
	  	
	  	    
		  
		    //搜索关键词
			$("#articleKeyword").keypress(function(e){
			
			        var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
			        $('.bookInfo').empty();
			        if (eCode == 13){
			        	    dao.searchBookInfo({
							  	data:JSON.stringify({"KEYWORD":$('#articleKeyword').val(),"BOOKID":res.ID,"dir":decryData(GLOBAL.GETQUERYSTRING('DIR'))})
							}).done(function(res){
								           // $('#bookInfomationTemp').tmpl(res).appendTo('.bookInfo');
								           res.HANSKEYWORD=$('#articleKeyword').val();
	  	                                     $('#bookInfomationTemp').tmpl(res).appendTo('.bookInfo');
								            for (var i=0;i<res.CALEGORY.length;i++) {
								            	 res.CALEGORY[i].id=res.CALEGORY[i].ZJ;
								                 res.CALEGORY[i].pId=res.CALEGORY[i].PZJ;
								                 res.CALEGORY[i].PAGECOUNT=res.PAGECOUNT;
								            }
									  	    $.fn.zTree.init($("#treeDemo"), setting, res.CALEGORY);
									  	    $.fn.zTree.getZTreeObj("treeDemo").expandAll(true);
									  	    //$('#bookCatalogTemp').tmpl(res).appendTo('.catalog > ul');
									  	    
									  	    if(res.hasOwnProperty('CALEGORY')&&res.CALEGORY.length>0){
									  	        //默认ztree加载一条数据
										  	    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
												var node = treeObj.getNodeByParam("id", res.CALEGORY[0].id);
												treeObj.selectNode(node);
												
												treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node);//调用事件  	
												
									  	    }
									  	    
									  	  
									  	   
							});
				
				
				
				
			        }
			});
			
			//下载
			$('.operation .downloadBook').on("click",function(){
				        dao.downloadBookParaph({
						  	data:JSON.stringify({"BOOKID":res.ID,"PAGENUM":nodePAGE,"IMGURL":decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/scanpic/l"+"/"+(String(nodePAGE).length==2?'00'+String(nodePAGE):(String(nodePAGE).length==3?'0'+String(nodePAGE):(String(nodePAGE).length==1?'000'+String(nodePAGE):'')))+".png"})
						}).done(function(res){
							var imgpic=res.data.IMGSRC;
							
							window.open(GLOBAL.PAGEURL+"temp/"+imgpic);
							
						});
			});
			
			//  引用
			$('.appoint').click(function(){
				    dao.quote({
						  	data:JSON.stringify({"TITLE":res.hasOwnProperty('TITLE')?res.TITLE:'',"AUTHOR":res.hasOwnProperty('AUTHOR')?res.AUTHOR:'',"PUBLISHNAME":res.hasOwnProperty('HOLDER')?res.HOLDER:'',"PUBDATE":res.hasOwnProperty('CREATEYEAR')?res.CREATEYEAR:''})
						}).done(function(result){
							
							console.log(result.data);
							
							layer.open({
								type: 1,
								title:"引用",
								skin: 'layui-layer-rim', //加上边框
								area: ['580px', '350px'], //宽高
								content: '<div style="margin-left:30px;margin-top:30px;width: 518px;">'+
								            '<p style="margin:0px;border-bottom: 1px solid gray;padding-bottom: 10px;"><span style="display: inline-block;width:90px;text-align:right;margin-right:20px;color:#9A9A9A;">GB/T 7714</span><span style="color:#000">'+
								            //'闻一多. 诗经研究[M]. 巴蜀书社, 2002.'
								            res.AUTHOR+' . '+res.TITLE+' . '+res.HOLDER+' , '+res.CREATEYEAR+' . '
								            +'</span></p><br/>'+
								            '<p style="margin:0px;border-bottom: 1px solid gray;padding-bottom: 10px;"><span style="display: inline-block;width:90px;text-align:right;margin-right:20px;color:#9A9A9A">MLA</span><span style="color:#000">'+
								            res.AUTHOR+' . '+res.TITLE+' . '+res.HOLDER+' , '+res.CREATEYEAR+' . '+
								            '</span></p><br/>'+
								            '<p style="margin:0px;border-bottom: 1px solid gray;padding-bottom: 10px;"><span style="display: inline-block;width:90px;text-align:right;margin-right:20px;color:#9A9A9A">APA</span><span style="color:#000">'+
								            res.AUTHOR+' . '+'('+res.CREATEYEAR+')'+' . '+res.TITLE+' . '+res.HOLDER+' , '+
								            '</span></p><br/>'+
								            '<p style="margin:0px;"><span style="display: inline-block;width:90px;text-align:right;margin-right:12px;color:#9A9A9A">导入链接</span>'+   
								            '<a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.BibTeX+'" download="">BibTeX</a> <a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.EndNote+'" download="">EndNote</a>'+ 
								            '<a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.RefMan+'" download="">RefMan</a> <a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.NoteFirst+'" download="">NoteFirst</a>'+ 
								            '<a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.NoteExpress+'" download="">NoteExpress</a></p></div>'
							});
							
							
					});
				
				    
					
			});
			
				
		
				
			
	});
	
	
	        
});


var flagword=true;var flagscan=true;
//点击文字触发的事件
$('.showStyle > .word > img').on('click',function(){
	if(flagword){
		$(this).attr('src','../img/icon-txt.png');        //文字取消状态
		$('.articleContent > .wordContent').css('display','none');
		$('.articleContent > .scanning').css('display','none');
		if(flagscan){
			$(this).attr('src','../img/icon-txt-active.png');       
			$('.articleContent > .wordContent').css('display','block');
		    $('.articleContent > .scanning').css('display','none');
		    $('.articleContent > .allPicture').css('display','none');
		    flagword=true;
		}else{
			$(this).attr('src','../img/icon-txt.png');
			//$('.articleContent > .wordContent').css('display','none');
			$('.articleContent > .allPicture').css('display','block');
			$('.articleContent > .allPicture').css('width','50%');
			flagword=false;
		}
		
		
	}else{
		$(this).attr('src','../img/icon-txt-active.png');  //文字选用状态
		$('.articleContent > .wordContent').css('display','block');
		$('.articleContent > .allPicture').css('display','none');
		if(flagscan){                                                             //只选文字
			var minwidth='650px';
			var minheight='1104px';
			if($("#iframeId").contents().find('.pagecss')[0]!=undefined){
				minwidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;
				minheight=$("#iframeId").contents().find('.pagecss')[0].offsetHeight;
			}
			$('.articleContent > .wordContent').css('width','50%');
//			$('.articleContent > .wordContent').css('height',minheight);
			
			var screenWordContent=$('.articleContent .wordContent').width();                //屏幕大小自适应宽度
            var htmlWidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;    //html宽度
            $("#iframeId").contents().find("body").css("zoom",screenWordContent/htmlWidth*100+'%');
			
			$('.articleContent > .scanning').css('display','none');
		}else{
			var minwidth='650px';
			var minheight='1104px';
			if($("#iframeId").contents().find('.pagecss')[0]!=undefined){
				minwidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;
				minheight=$("#iframeId").contents().find('.pagecss')[0].offsetHeight;
			}
//			$('.articleContent > .wordContent').css('width','auto');       //文字和扫描同时选中
//			$('.articleContent > .wordContent').css('min-width',minwidth);       //文字和扫描同时选中
//			$('.articleContent > .wordContent').css('min-height',minheight);       //文字和扫描同时选中
			
			//$('.articleContent > .wordContent').css('flex-grow',1);
			$('.articleContent > .wordContent').css('margin','0px');
			$('.articleContent > .scanning').css('display','block');
			
			$('.articleContent > .wordContent').css('width','50%');
			$('.articleContent > .scanning').css('width','50%');
			
			$('.articleContent .wordContent').css('min-width','');
			$('.articleContent .wordContent').css('min-height','');
			
			var screenWordContent=$('.articleContent .wordContent').width();                //屏幕大小自适应宽度
            var htmlWidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;    //html宽度
            $("#iframeId").contents().find("body").css("zoom",screenWordContent/htmlWidth*100+'%');
            
            
		}
		flagword=true;
	}
	
});
//点击扫描触发的事件
$('.showStyle > .scan > img').on('click',function(){
	if(flagscan){
		$(this).attr('src','../img/origin-page-active.png');     //扫描选用状态
		$('.articleContent > .allPicture').css('display','block');
		$('.articleContent > .wordContent').css('display','none');
		$('.articleContent > .scanning').css('display','none');
		if(flagword){                                                         //文字和扫描同时选中
			var minwidth='650px';
			var minheight='1104px';
			if($("#iframeId").contents().find('.pagecss')[0]!=undefined){
				minwidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;
				minheight=$("#iframeId").contents().find('.pagecss')[0].offsetHeight;
			}
			
			//$('.articleContent > .wordContent').css('flex-grow',1);
			
//			$('.articleContent > .wordContent').css('width','auto');
//			$('.articleContent > .wordContent').css('min-width',minwidth); 
//			$('.articleContent > .wordContent').css('min-height',minheight);       //文字和扫描同时选中
			
			$('.articleContent > .wordContent').css('margin','0px');
			
			$('.articleContent > .wordContent').css('display','block');
			$('.articleContent > .scanning').css('display','block');
			$('.articleContent > .allPicture').css('display','none');
			
			$('.articleContent > .wordContent').css('width','50%');
			$('.articleContent > .scanning').css('width','50%');
			
			$('.articleContent .wordContent').css('min-width','');
			$('.articleContent .wordContent').css('min-height','');
			
			var screenWordContent=$('.articleContent .wordContent').width();                //屏幕大小自适应宽度
            var htmlWidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;    //html宽度
            $("#iframeId").contents().find("body").css("zoom",screenWordContent/htmlWidth*100+'%');
            
            
		}else{                                                                       //只选扫描
//			$('.showStyle > .word > img').attr('src','../img/icon-txt.png');
			$('.articleContent > .wordContent').css('display','none');
			$('.articleContent > .scanning').css('display','none');
			$('.articleContent > .allPicture').css('width','50%');
		}
		flagscan=false;
	}else{
		var minwidth='650px';
		var minheight='1104px';
		if($("#iframeId").contents().find('.pagecss')[0]!=undefined){
			minwidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;
			minheight=$("#iframeId").contents().find('.pagecss')[0].offsetHeight;
		}
		$(this).attr('src','../img/origin-page.png');          //扫描取消状态
		$('.articleContent > .allPicture').css('display','none');
		$('.articleContent > .wordContent').css('min-width',minwidth);
		//$('.articleContent > .wordContent').css('min-height',minheight);
		$('.articleContent > .wordContent').css('margin','0 auto');
		$('.articleContent > .scanning').css('display','none');
		
		var screenWordContent=$('.articleContent .wordContent').width();                //屏幕大小自适应宽度
        var htmlWidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;    //html宽度
        $("#iframeId").contents().find("body").css("zoom",screenWordContent/htmlWidth*100+'%');
        //至少存在一个
        if(!flagword){   //文字取消
        	
        	$(this).attr('src','../img/origin-page-active.png');  
        	$('.articleContent > .allPicture').css('display','block');
        	$('.articleContent > .scanning').css('display','none');
        	$('.articleContent > .wordContent').css('display','none');
        	flagscan=false;
        }else{
        	flagscan=true;
        }
		//$("#iframeId").contents().find("body").css("zoom",'100%');
		
	}
	
});

var test;
//字体放大
$('.zoomIn .fontAdd').on('click',function(){
	
	if(!flagword&&!flagscan||flagword&&flagscan){            //只选一个
		fontBig();
	}
    
});

//字体缩小
$('.zoomIn .fontReduce').on('click',function(){
	if(!flagword&&!flagscan||flagword&&flagscan){            //只选一个
		fontSmall();
	}
    
});

//字体放大
function fontBig(){
	setTimeout(function(){
    	//扩大的最大宽度 不能 超过显示区域
    	
    	if($('.articleContent .wordContent').width()<$('.showcontent .articleContent').width()*0.9){
    		

    		$('.articleContent .wordContent').css('width',$('.articleContent .wordContent').width()*1.1);
    		$('.articleContent .wordContent').css('height',$('.articleContent .wordContent').height()*1.1);

    		//实时的缩放比列
    		$("#iframeId").contents().find("body").css("zoom",$('.articleContent .wordContent').width()/$("#iframeId").contents().find('.pagecss')[0].offsetWidth*100+'%');

    		if(test==undefined&&test!=''){
    			test=$('.articleContent .wordContent').width();	
    		}
    		
    	}
    	fontSizeWidth=$('.articleContent .wordContent').width();
    	fontSizeHeight=$('.articleContent .wordContent').height();
    	$('.articleContent .allPicture').css('width',$('.articleContent .wordContent').width()*1.1);
    	
    },100);
}

//字体放小
function fontSmall(){
	setTimeout(function(){
    	//缩小的最大宽度 不能 超过初始化的宽度
    	if($('.articleContent .wordContent').width()>=test){
    		
    		
    		
    		$('.articleContent .wordContent').css('width',$('.articleContent .wordContent').width()*0.9);
    		$('.articleContent .wordContent').css('height',$('.articleContent .wordContent').height()*0.9);
    	    //实时的缩放比列
    		$("#iframeId").contents().find("body").css("zoom",$('.articleContent .wordContent').width()/$("#iframeId").contents().find('.pagecss')[0].offsetWidth*100+'%');

    		if(test==undefined&&test!=''){
    			test=$('.articleContent .wordContent').width();	
    		}
    	}
    	fontSizeWidth=$('.articleContent .wordContent').width();
    	fontSizeHeight=$('.articleContent .wordContent').height();
    	$('.articleContent .allPicture').css('width',$('.articleContent .wordContent').width()*0.9);
    },100);
}

    /**
     * 分页
    */
    //分页回调函数
    function PageCallback(index, jq) {
      	InitTable(index);
    }
    
    //分页
    function InitTable(pageIndex) {

    	    var currentpage=String(pageIndex.getCurrent());
    	    var treeNode={};
    	    nodePAGE=Number(currentpage);
    	    $('.wordContent').empty();
			$('.allPicture').empty();
			$('.scanning').empty();
			var pagehtml=GLOBAL.PAGEURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/epub/EPUB"+"/"+"page_"+(currentpage.length==2?'00'+currentpage:(currentpage.length==3?'0'+currentpage:(currentpage.length==1?'000'+currentpage:'')))+".html";
//			treeNode.PAGEHTML=GLOBAL.GETQUERYSTRING('DIR')+"/"+"page_"+(currentpage.length==2?'00'+currentpage:(currentpage.length==3?'0'+currentpage:(currentpage.length==1?'000'+currentpage:'')))+".html";
			
			treeNode.SCANPICTURE=GLOBAL.PAGEURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/scanpic/m"+"/"+(currentpage.length==2?'00'+currentpage:(currentpage.length==3?'0'+currentpage:(currentpage.length==1?'000'+currentpage:'')))+".png";
			
	
			//判断文件是否存在
			pagingIsFile(pagehtml,treeNode,currentpage);
		
			
			var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var node = treeObj.getNodes();
            var nodes = treeObj.transformToArray(node);
            
            var data=find(zjPage,currentpage);
            //定位目录的位置
            for (var i=0;i<nodes.length;i++) {
            	if(data==nodes[i].PAGE||nodes[i].PAGE==currentpage){
            		var nodeid = treeObj.getNodeByParam("id", nodes[i].id);
                    treeObj.selectNode(nodeid);
         
                    $('#'+nodes[i].tId+'_span').addClass('active');
		            $('#treeDemo').find('span').not('#'+nodes[i].tId+'_span').removeClass('active');		
                    
            		break;
            	}
            }
            
            dao.heightLightKeyword({
			  	data:JSON.stringify({"BOOKID":bookID,"PAGENUM":Number(currentpage),"TYPE":'1'})
			}).done(function(res){
				//console.log(res.data.items);
				var nameArray=[];
				var typeArray=[];
				for (var i=0;i<res.data.items.length;i++) {
					nameArray.push(res.data.items[i].NAME);
					typeArray.push(res.data.items[i].TYPE);
				}
				if(nameArray.length!=0){
				    setTimeout(function(){
					   highlight(nameArray,'pagecss',typeArray);	
					},500);	
				}
				
			});

  
    }
    
    //判断点击分页的数字是否在章节区间
    function find(array,val){
    	var idx;
    	for(var i=0;i<array.length;i++){
            if(array[i] > val){
                idx = array[i-1];
                break;
            };
        }
    	return idx;
    }
    
   
    
    $('.backtop').on('click',function(){
    
    	 $('.showcontent').animate({scrollTop:0},'fast');
    });

         //目录显示滚动条
         var height=window.innerHeight-$('.catalog').offset().top;
	     $('.catalogContent .catalog').css('height',height+'px');
	     $('.catalogContent .catalog').css('overflow','auto');
	     
	     //内容显示滚动条
	     var heightCon=window.innerHeight-$('.showcontent').offset().top;
	     $('.showcontent').css('height',heightCon+'px');
	     $('.showcontent').css('overflow','auto');
	
    document.getElementById('showcontentid').onscroll = function(){
    	
         if($('.showcontent').scrollTop()>=100){
         	$('.backtop').fadeIn(1000);
         }else{
         	$('.backtop').fadeOut(1000);
         }

    }
    
    
    //字体转化
    var changeflag=true;
	$('.showStyle .changeFont').on('click',function(){
			var treeNode={};
			nodePAGE=String(nodePAGE);
			kkk=0;
	        var parent = div.parentElement;
	       
	        if(kkk!=0){
	        	parent.removeChild(div);
	        }
	        $('.wordContent').empty();
	    	if(changeflag||flagword==false&&flagscan==false){
	    	   
	    	   $('.showStyle .changeFont img').attr('src','../img/simplifiedCheck.png');         //转化为简体
	    	   
	    	   treeNode.PAGEHTML=GLOBAL.PAGEURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/epub/EPUBS"+"/"+"page_"+(nodePAGE.length==2?'00'+nodePAGE:(nodePAGE.length==3?'0'+nodePAGE:(nodePAGE.length==1?'000'+nodePAGE:'')))+".html";
	    	   
	    	   fontChange(treeNode);
	    	   
	    	   
	    	    dao.heightLightKeyword({
				  	data:JSON.stringify({"BOOKID":bookID,"PAGENUM":nodePAGE,"TYPE":'0'})
				}).done(function(res){
					//console.log(res.data.items);
					var nameArray=[];
					var typeArray=[];
					for (var i=0;i<res.data.items.length;i++) {
						nameArray.push(res.data.items[i].NAME);
						typeArray.push(res.data.items[i].TYPE);
					}
					if(nameArray.length!=0){
					    setTimeout(function(){
						   highlight(nameArray,'pagecss',typeArray);	
						   
						   var list=document.getElementById("iframeId").contentWindow.document.getElementsByClassName("highlight");
			                	
		                	for(var i = 0;i < list.length;i++){
			                	
			                	(function(i){								            
							        list[i].onmouseover = function() {        

										//提示信息
                                        dao.heightLightDetail({
										  	data:JSON.stringify({"NAME":$(list[i]).html(),"TYPE":$(list[i]).attr('value'),"CODE":'0'})
										}).done(function(res){
                                            tipsPosition(res.data.MAINBOOK,$(list[i]));
											
										});
							        }
							        
							        list[i].onmouseleave = function(e) {        

											tipsLeave();
								    }
							   })(i);
							   
			                }
						},500);	
					}
				});
	     	  
	    	   changeflag=false;
	    	}else if(!changeflag||flagword==true&&flagscan==true){
	    		$('.showStyle .changeFont img').attr('src','../img/simplified.png');                //转化为繁体
	    		treeNode.PAGEHTML=GLOBAL.PAGEURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/epub/EPUB"+"/"+"page_"+(nodePAGE.length==2?'00'+nodePAGE:(nodePAGE.length==3?'0'+nodePAGE:(nodePAGE.length==1?'000'+nodePAGE:'')))+".html";
	    	    
	    	    fontChange(treeNode);
	    	    
	    	    dao.heightLightKeyword({
				  	data:JSON.stringify({"BOOKID":bookID,"PAGENUM":nodePAGE,"TYPE":'1'})
				}).done(function(res){
					//console.log(res.data.items);
					var nameArray=[];
					var typeArray=[];
					for (var i=0;i<res.data.items.length;i++) {
						nameArray.push(res.data.items[i].NAME);
						typeArray.push(res.data.items[i].TYPE);
					}
					if(nameArray.length!=0){
					    setTimeout(function(){
						   highlight(nameArray,'pagecss',typeArray);	
						   
						    var list=document.getElementById("iframeId").contentWindow.document.getElementsByClassName("highlight");
			                	
		                	for(var i = 0;i < list.length;i++){
			                	
			                	(function(i){								            
							        list[i].onmouseover = function() {        

										//提示信息
                                        dao.heightLightDetail({
										  	data:JSON.stringify({"NAME":$(list[i]).html(),"TYPE":$(list[i]).attr('value'),"CODE":'1'})
										}).done(function(res){

                                            tipsPosition(res.data.MAINBOOK,$(list[i]));
											
										});
							        } 
							        
							        list[i].onmouseleave = function(e) {        

											tipsLeave();
								    }
							   })(i);
							   
			                }
						},500);	
					}
					
				});
	
	    		changeflag=true;
	    	}
 
    });
    
    //字体判断文件是否存在
    function fontChange(treeNode){
    	$.ajax({
		   url:treeNode.PAGEHTML,
		   type:'HEAD',
    	   error:function(){
    	   	  treeNode.PAGEHTML="lostPage.html";
    	   	  $('#bookContentShowTemp').tmpl(treeNode).appendTo('.wordContent');
    	   	  
	  	      $("#iframeId").on('load',function(){
	  	
	            	var screenWordContent=$('.articleContent .wordContent').width();                //屏幕大小自适应宽度
		            var htmlWidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;    //html宽度
		            $("#iframeId").contents().find("body").css("zoom",screenWordContent/htmlWidth*100+'%');
	  		  });
    	   	  
    	   },
    	   success:function(){
    	   	  $('#bookContentShowTemp').tmpl(treeNode).appendTo('.wordContent');
    	   	  
    	   	$("#iframeId").on('load',function(){
    		  	
            	var screenWordContent=$('.articleContent .wordContent').width();                //屏幕大小自适应宽度
	            var htmlWidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;    //html宽度
	            $("#iframeId").contents().find("body").css("zoom",screenWordContent/htmlWidth*100+'%');
  		    });
    	   }
	    });
    }
    
    //分页或点击目录判断文件是否存在
    function pagingIsFile(pagehtml,treeNode,pageNum){
    	    //判断文件是否存在
			$.ajax({
			   url:pagehtml,
			   type:'HEAD',
			   error: function() {          
			       treeNode.PAGEHTML="lostPage.html";
			            
			            $('.articleContent > .wordContent').css('width','50%');
			            
			            $.ajax({
						   url:treeNode.SCANPICTURE,
						   type:'HEAD',
						   error: function() { 
						   	   treeNode.SCANPICTURE="lostPage.png";
						   	   $('#bookContentShowTemp').tmpl(treeNode).appendTo('.wordContent');
							   $('#bookScanShowTemp').tmpl(treeNode).appendTo('.allPicture');
							   $('#bookScanShowTemp').tmpl(treeNode).appendTo('.scanning');
							   
							    $("#iframeId").on('load',function(){
			            	
						            
						            if(fontSizeWidth!=''){
						            	    $('.articleContent .wordContent').css('width',fontSizeWidth);
								    		$('.articleContent .wordContent').css('height',fontSizeHeight);
								    	    //实时的缩放比列
								    		$("#iframeId").contents().find("body").css("zoom",$('.articleContent .wordContent').width()/$("#iframeId").contents().find('.pagecss')[0].offsetWidth*100+'%');
						            }else{
						            	    var screenWordContent=$('.articleContent .wordContent').width();                //屏幕大小自适应宽度
								            var htmlWidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;    //html宽度
								            $("#iframeId").contents().find("body").css("zoom",screenWordContent/htmlWidth*100+'%');
						            }
						            
					            });
						   	   
						   },
						   success:function(){
						   	   $('#bookContentShowTemp').tmpl(treeNode).appendTo('.wordContent');
							   $('#bookScanShowTemp').tmpl(treeNode).appendTo('.allPicture');
							   $('#bookScanShowTemp').tmpl(treeNode).appendTo('.scanning');
							   
							   $("#iframeId").on('load',function(){
					            	
						            if(fontSizeWidth!=''){
						            	    $('.articleContent .wordContent').css('width',fontSizeWidth);
								    		$('.articleContent .wordContent').css('height',fontSizeHeight);
								    	    //实时的缩放比列
								    		$("#iframeId").contents().find("body").css("zoom",$('.articleContent .wordContent').width()/$("#iframeId").contents().find('.pagecss')[0].offsetWidth*100+'%');
						            
						            }else{
						            	    var screenWordContent=$('.articleContent .wordContent').width();                //屏幕大小自适应宽度
								            var htmlWidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;    //html宽度
								            $("#iframeId").contents().find("body").css("zoom",screenWordContent/htmlWidth*100+'%');
						           
						            }
						            
					            });
						   }
			            });
			            
			   },
			   success: function() {
			   	    kkk=0;
                    var parent = div.parentElement;
                   
                    if(kkk!=0){
                    	parent.removeChild(div);
                    }
                    console.log(pageNum);
                    
                    if(changeflag){     //选择的是简体
                        treeNode.PAGEHTML=pagehtml;
                    }else{
                    	
                    	treeNode.PAGEHTML=GLOBAL.PAGEURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/epub/EPUBS"+"/"+"page_"+(pageNum.length==2?'00'+pageNum:(pageNum.length==3?'0'+pageNum:(pageNum.length==1?'000'+pageNum:'')))+".html";
                        changeflag=false;
                    }
                     
			       
			            
			            $('.articleContent > .wordContent').css('width','50%');
				            
				        $('#bookContentShowTemp').tmpl(treeNode).appendTo('.wordContent');
						$('#bookScanShowTemp').tmpl(treeNode).appendTo('.allPicture');
						$('#bookScanShowTemp').tmpl(treeNode).appendTo('.scanning');    
				            
				        $("#iframeId").on('load',function(){
				        	//从前一页字体是否放大或缩小
				        	if(fontSizeWidth!=''){
				            	    $('.articleContent .wordContent').css('width',fontSizeWidth);
						    		$('.articleContent .wordContent').css('height',fontSizeHeight);
						    	    //实时的缩放比列
						    		$("#iframeId").contents().find("body").css("zoom",$('.articleContent .wordContent').width()/$("#iframeId").contents().find('.pagecss')[0].offsetWidth*100+'%');
			
				        	}else{
				            	    var screenWordContent=$('.articleContent .wordContent').width();                //屏幕大小自适应宽度
						            var htmlWidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;    //html宽度
						            $("#iframeId").contents().find("body").css("zoom",screenWordContent/htmlWidth*100+'%');
				            
				            }

			                setTimeout(function(){
			                	       	
			                	
			                	var list=document.getElementById("iframeId").contentWindow.document.getElementsByClassName("highlight");
			                	
			                	for(var i = 0;i < list.length;i++){
				                	
				                	(function(i){								            
								        list[i].onmouseover = function() {        

											//提示信息
                                            dao.heightLightDetail({
											  	data:JSON.stringify({"NAME":$(list[i]).html(),"TYPE":$(list[i]).attr('value'),"CODE":'1'})
											}).done(function(res){
												
										       tipsPosition(res.data.MAINBOOK,$(list[i]));

											});
								        }  
								        
								        list[i].onmouseleave = function(e) {        

											tipsLeave();
								        } 
								   })(i);
								   
				                }
			                	
			                },800);
			                
			                //禁止iframe右键
	                        document.getElementById("iframeId").contentWindow.document.oncontextmenu = function(){ 
							      return false 
							}
				            
			            });
			       	    
			       
			   }
			});
    }
    
    //关键字tips提示
    var kkk=0;
    var div=document.getElementById('tipId');
    function tipsPosition(params,element){
    	
    	var leftDis=element.offset().left+element.width();
    	
    	
        if(kkk==0){
        	div.innerText=params;
        	
        	if($("#iframeId").contents().find('.pagecss')[0].offsetWidth-leftDis<180){  //当右侧位置显示不够时
        		var leftWidth=element.offset().left-180;
        		div.setAttribute('style','position: absolute;left:'+leftWidth+'px;top:'+element.offset().top+'px;z-index:100;background:#0056A6;cursor:default;color:#fff;width:180px;font-size:14px;');
	        
        	}else{
        		div.setAttribute('style','position: absolute;left:'+leftDis+'px;top:'+element.offset().top+'px;z-index:100;background:#0056A6;cursor:default;color:#fff;width:180px;');
	        
        	}
        	$("#iframeId")[0].contentWindow.document.body.appendChild(div);
	        

	        kkk++;
        }else{
        	var list=document.getElementById("iframeId").contentWindow.document.getElementById("tipId");
        	list.innerText=params;
        	
        	if($("#iframeId").contents().find('.pagecss')[0].offsetWidth-leftDis<180){  //当右侧位置显示不够时
        		var leftSecondWidth=element.offset().left-180;
        		list.setAttribute('style','position: absolute;left:'+leftSecondWidth+'px;top:'+element.offset().top+'px;z-index:100;background:#0056A6;cursor:default;color:#fff;width:180px;font-size:14px;');
	        
        	}else{
        		list.setAttribute('style','position: absolute;left:'+leftDis+'px;top:'+element.offset().top+'px;z-index:100;background:#0056A6;cursor:default;color:#fff;width:180px;');
        	
        	}
          	
        }
        

    }
    //关键词提示消失
    function tipsLeave(){
    	var list=document.getElementById("iframeId").contentWindow.document.getElementById("tipId");
    	list.setAttribute('style','display:none;');
    }
    

 