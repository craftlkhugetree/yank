$(function(){//banner轮播图
	
	    //加载树结构的参数
       var setting = {
			view: {
				showIcon: showIconForTree
			},
			data: {
				simpleData: {
					enable: true
				},
				key:{
					//title:"TITLE",
					name: "TITLE",
					children:"children",
					checked:"checked"
				}
			},
			view: {
				addDiyDom: addDiyDom,
				dblClickExpand: true,
				showIcon: false,
				fontCss: setFontCss
			}
		};
		
		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		}
		
		function addDiyDom(treeId, treeNode) {
			var aObj = $("#" + treeNode.tId + "_a");
			if ($("#diyBtn_"+treeNode.id).length>0) return;
			var editStr = "<div disabled> </div>";
			aObj.append(editStr);
//			var btn = $("#diyBtn_"+treeNode.id);
//			if (btn) btn.bind("click", function(){alert("diy Button for " + treeNode.name);});
		}
		function setFontCss(treeId, treeNode) {
			return {height:'25px',color:'#000'};
		}
		
	
        var dao = {
	        //书的信息
	        bookInfo: function(param) {
	            return dkr.util.ajaxPost(GLOBAL.URL+'Book/isRead', param)
	        }
	    };
        /*加载书的信息*/
	    dao.bookInfo({
	    	data:JSON.stringify({"dir":decryData(GLOBAL.GETQUERYSTRING('DIR')),"ZTTYPE":decryData(GLOBAL.GETQUERYSTRING('ZTTYPE'))})
	    }).done(function(res){
	    	res.BOOKIMG=GLOBAL.BOOKURL+decryData(GLOBAL.GETQUERYSTRING('DIR'))+"/"+res.BOOKIMG;
//	    	res.BOOKIMG='../img/search_07.png';
	    	if(GLOBAL.GETQUERYSTRING('LABEL')==2){
	    		res.LABEL="搜索";
	    	}else if(GLOBAL.GETQUERYSTRING('LABEL')==3){
	    		res.LABEL="搜索";
	    	}else if(GLOBAL.GETQUERYSTRING('LABEL')==4){
	    		res.LABEL="分类浏览";
	    	}else{
	    		res.LABEL="首页";
	    	}
	    	$('#bookResourceTemp').tmpl(res).appendTo('.recource');
	    	$('#bookInfoTemp').tmpl(res).appendTo('.bookInfo');
	    	$('#bookIntroTemp').tmpl(res).appendTo('.categoryname');
	    	
	    	//补齐ztree插件的参数
	    	for (var i=0;i<res.CALEGORY.length;i++) {
            	 res.CALEGORY[i].id=res.CALEGORY[i].ZJ;
                 res.CALEGORY[i].pId=res.CALEGORY[i].PZJ;
            }
	    	
	    	$.fn.zTree.init($("#treeDemo"), setting, res.CALEGORY);
	    	$.fn.zTree.getZTreeObj("treeDemo").expandAll(true);
	    	
	    	    	
	    	
            //判断目录是否超过18条,超过的话显示“显示全部”按钮,没超过的话,就隐藏
	    	if(res.CALEGORY.length>18){
	    		$(".showAll").show();
	    		$('.catalogContent').css("overflow","hidden");
	    		//$('.hideCategory').toggle();
	    		
	    	}else{
	    		$(".showAll").hide();
	    	}
	    	
	    	if(res.ISLOOK){
		    	
	  		    	$('.bookIntro > button').on('click',function(){
	  		    		 window.open('../readPage/index.html?DIR='+GLOBAL.GETQUERYSTRING("DIR")+'&ZTTYPE='+GLOBAL.GETQUERYSTRING("ZTTYPE"));
	  		    	});
	        }else{
	            	
	  		    	$('.bookIntro > button').attr('title',"请购买后阅读");
	  		    	$('.bookIntro > button').css({
	  		    		     cursor: "not-allowed",
	  		    		     border:"none",
	  		    		     background:"#CCCAC4"
	  		    		     //color:"#CCCAC4"
	  		    	});
	  		    	$('.bookIntro > button').on('click',function(){
	  		    		  return false
	  		    	});
	        }
	    	
	    	
	    });
	    
	     
	    $('.showAll a').on('click',showAllCategory); 
});
        

        //显示全部和收起
        var flag=true;
        function showAllCategory(){
	    		if(flag){                                                                   //展开
	    			$('.catalogContent').css("overflow-y","scroll");
		    		//$('.hideCategory').show();
		    		$(".showAll > a > span").text("收起");
		    		$(".showAll > a > img").attr("src","../img/icon-arrow-up.png");
	    			flag=false;
	    		}else{                                                                 //收起
	    			$('.catalogContent').css("overflow-y","hidden");
		    		//$('.hideCategory').hide();
		    		$(".showAll > a > span").text("显示全部");
		    		$(".showAll > a > img").attr("src","../img/icon-arrow-down.png");
	    			flag=true;
	    		}

		    
	    }
        //开始阅读
        function startRead(){
        	window.open('../readPage/index.html');
        }
        
        

