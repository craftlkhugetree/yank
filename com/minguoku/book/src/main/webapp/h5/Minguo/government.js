$(function(){
	var dao = {
        //政府机构树
        GovernmentTree: function(param) {
            return dkr.util.ajaxPost(GLOBAL.URL+'Government/tree', param)
        }
    };
	var zTreeObj;
	// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
	var setting = {
		check: {
		 	chkboxType: { "Y": "ps", "N": "ps" },//Y 属性定义 checkbox 被勾选后的情况； N 属性定义 checkbox 取消勾选后的情况； "p" 表示操作会影响父级节点； "s" 表示操作会影响子级节点。
	        chkStyle: "checkbox",//复选框类型
	        enable: true ,//每个节点上是否显示 CheckBox
	    },
	    //显示
	    view: {
	    	showIcon:false,
	    },
	 	//回调函数
	    callback: {
	    	
	    }
	};
   // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
	var zNodes = [
		{name:"北京政府", open:true, url:"http://www.baidu.com",checked:true,
			children:[
				{name:"国务院",checked:false,children:[
				{name:"国务院",checked:false,}, 
				{name:"临时法制院",checked:true,}
			]}, 
				{name:"临时法制院",checked:true,}
			]
		},
		{name:"国民政府", open:true, checked:true,
	   		children:[
				{name:"国务院",checked:false,}, 
				{name:"临时法制院",checked:true,}
			]
		},
		{name:"汪伪国民政府", open:true, checked:true,
	   		children:[
				{name:"国务院",checked:false,}, 
				{name:"临时法制院",checked:true,}
			]
		},
		{name:"(广州和武汉)国民政府", open:true, checked:true,
	   		children:[
				{name:"国务院",checked:false,}, 
				{name:"临时法制院",checked:true,}
			]
		},
		{name:"伪维新政府", open:true, checked:true,
	   		children:[
				{name:"国务院",checked:false,}, 
				{name:"临时法制院",checked:true,}
			]
		}
	];
   
	var vm = {
		zNodes:'',
		sort:'GYJN',
		dir:'asc',
		keyword:''
	};
	vm.addEventListener = function(){
		//排序的点击事件
	}
	//各种方法的函数
	vm.handle = {
		getNode(){
			zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, vm.zNodes);
			var sNodes = zTreeObj.getSelectedNodes();
			//右侧高度初始化
			var rights = document.getElementsByClassName('lineright');
			var lefts = document.getElementsByClassName('lineleft');
			for (var i = 0;i<rights.length;i++) {
				if($(rights[i]).height()>29){
					var height = $(rights[i]).height();
					$(lefts[i]).height(height) ;
				}
			}
		},
		GovernmentTree(){
			dao.GovernmentTree({
		    }).done(function(res){
		    	var str = JSON.stringify(res.tree)
		    	str = str.toLowerCase()
		    	vm.zNodes =JSON.parse(str);
		    	vm.handle.getNode()
		    	
		    })
		}
	}
	vm.init = function(){
		vm.addEventListener()
		vm.handle.GovernmentTree()
	}
	
	vm.init()
	
	
})