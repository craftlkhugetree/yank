var dao={};
$(function(){
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
			dblClickExpand: true,
			showIcon: false,
			fontCss: setFontCss
		}
	};
	function setFontCss(treeId, treeNode) {
//		if (treeNode.color == "gray") {
//	        treeNode.chkDisabled = true;
//	        return {color:"#AAAAAA",height: '24px'};
//	    }
		return {height:'24px',color:'#000'};
	}
	function zTreeOnClick(event, treeId, treeNode){
		console.log(treeNode)
        categoryFilterBook(treeNode.id);	
	}
	function showIconForTree(treeId, treeNode) {
		return !treeNode.isParent;
	}
    dao.bookInfo=function(param){
	  	return dkr.util.ajaxPost(GLOBAL.URL+'Government/tree', param)
    }
    //分类过滤书本
    dao.filterBook=function(param){
	  	return dkr.util.ajaxPost(GLOBAL.URL+'Government/view', param)
    }
  	//初始化加载
  	initloadPage(setting); 	      
    
});
    //初始化加载页面
    function initloadPage(setting){
	    dao.bookInfo({
		  	data:JSON.stringify({})
	  	}).done(function(res){
	  	  	var str = JSON.stringify(res.tree)
			str = str.toLowerCase()
			str=JSON.parse(str)
	  	    $.fn.zTree.init($("#treeDemo"), setting, str);
	  	    //默认ztree加载一条数据
	  	    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	  	    if(str.length>0&&str[0].hasOwnProperty('id')){
	  	        var node = treeObj.getNodeByParam("id", str[0].id);
				treeObj.selectNode(node);
				treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node);//调用事件  	
	  	    }
	  	});
    }
    //点击分类过滤书本
	function categoryFilterBook(ID){
	  	dao.filterBook({
		  	ID:ID
		  }).done(function(res){
		 	var innerText = doT.template($("#mainright_tpl").text());
			$(".mainright").html(innerText(res.item));
			//右侧高度初始化
			var rights = document.getElementsByClassName('lineright');
			var lefts = document.getElementsByClassName('lineleft');
			for (var i = 0;i<rights.length;i++) {
				if($(rights[i]).height()>29){
					var height = $(rights[i]).height();
					$(lefts[i]).height(height) ;
				}
			}
		  });
	}


