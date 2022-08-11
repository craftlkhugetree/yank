


/** Open the quick tips */
Ext.QuickTips.init();

var welcomePanel = new Ext.Panel({
	title: '首页',
	iconCls: 'tabs',
	closable: false,
	layout:'anchor'//,
	// html:"<img width='100%' heigth='100%' src='images/timg.jpg'>"
});

/** 定义中心区域, 本系统的核心区域, 所有打开的Tab都将在该区域展示 */
var centerRegion = new Ext.TabPanel({
    region:'center',
    id:'main-tab',
    deferredRender:false,
    activeTab:0,
    resizeTabs:true,//防止TAB标签溢出
    listeners:{
        remove: function(tp, c){
            c.hide();
        },
        tabchange:function(th, newtab){
            // console.log(th)
            // console.log(newtab)
            // if(document.getElementById('main-tab'+newtab.id)!=null){
            //     var xx=document.getElementById('main-tab'+newtab.id).src;
            //     document.getElementById('main-tab'+newtab.id).src=xx;
            //     newtab.doLayout();
            // }
        }
    },
    autoDestroy: true,
    items:[welcomePanel],
    plugins: new Ext.ux.TabCloseMenu()
 
});


/** 这里是页面展示的开始 */
Ext.onReady(function(){
	/** 处理ie提交数据中文乱码问题 */
    Ext.lib.Ajax.defaultPostHeader += '; charset=utf-8';
    menusloader.on('beforeload', function(loader, node) {  
        this.baseParams.auth = JSON.stringify({userid:userid}); // 通过这个传递参数，这样就可以点一个节点出来它的子节点来实现异步加载  
    }, menusloader); 

    
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[
        	// northRegion,
        	// southRegion,
		    westRegion,
            centerRegion
         ]
    });
	
});









