var tabId;
// function changeFrameHeight(){
    
//     var ifm= document.getElementById('iframemianmain-tab'+tabId);
//     console.log(ifm);
//     console.log(document.documentElement.clientHeight) 
//     ifm.height=document.documentElement.clientHeight;
// }
// window.onresize=function(){  
//      changeFrameHeight();  
// }
var menusloader=new Ext.tree.TreeLoader({
	
	   //url:'http://paydev.angke.com.cn/jalis/rest/User/getMenuArr'
	   url:'rest/main/menu'
	  // url:akconfig.resturl+'main/menu'
    //dataUrl:'../web/rest/main/menu'
});
var menuTree = new Ext.tree.TreePanel({
    loader:menusloader,
    
    // loader: new Ext.tree.TreeLoader({dataUrl:'/newsrelease/03code/newsrelease/WebContent/news/newsrelease/web/rest/main/menus'}),
    autoScroll: true,
    id:'menutree-mian',
    animate: false,
    enableDD: true,
    containerScroll: true,
    rootVisible: false,
    width:230,
    border:false,
    height:'100%',
    // tbar:[  
    //     new Ext.Toolbar.TextItem('<img src="../web/resources/images/logo.png"/>'),  
    //     {xtype:"tbfill"},
    //     // {pressed:false,text:'管理员',iconCls: 'tabs'},
 
    //     new Ext.Toolbar.TextItem('<a id="login-show-user">'+'欢迎,'+username+'</a>'),
    //     {xtype:'button',iconCls:'ak-exit',listeners:{click:function(){ 
    //                 exitnn();
    //     }}}
    // ]
    listeners:{
        click:function(node, e){
        	if(node.attributes.leaf){
                var url = node.attributes.DISPLAYURL;
                tabId = node.attributes.ID;
                var maintab = Ext.getCmp('main-tab');

                if(url){

                    var temtab = Ext.getCmp("main-tab"+tabId);
                    if(!temtab){
                        temtabson=new Ext.ux.IFrameComponent({
                            url:url+'?userid='+userid
                        });
                        temtab=new Ext.Panel({
                            layout:'fit',
                            border:true,
                            title :node.attributes.text,
                            closable : true,
                            id:  "main-tab"+tabId,
                            items:[temtabson]
                        })
                    }else{
                        
                    }
                    maintab.add(temtab);
                    // temtab.setHeight(9999);
                    maintab.setActiveTab(temtab);
                    // window.testiframe=Ext.getCmp('main-tab');

                    
                }

            }else{
                if(node.expanded){
                   node.collapse();
                }else{
                    node.expand();
                }
                
                
            }
        },
        render:function(){
        	root.expand();
        }
    }
});

var root = new Ext.tree.AsyncTreeNode({
    text: 'Ext JS',
    draggable:false,
    id:'source'
});
menuTree.setRootNode(root);
//root.expand();
var westRegion = {
    region:'west',
    id:'west-panel',
    cls:'ak-menu',
    iconCls: 'tabs',
    // title:'主菜单',
    split:false,
    width: 230,
    // collapsed:true,
    collapsible: true,
    margins:'-2 0 0 0',
    layout:'column',
    bodyStyle :"overflow-x:hidden;overflow-y:auto",
    layoutConfig:{
        animate:true
    },
    items:[{
        xtype:'panel',
        cls:'ak-logo'//,
        //html:'<img src="../web/resources/images/logo.png"/>'
    },{
        xtype:'panel',
        cls:'ak-usrinfo',
        items:[{
        	xtype:'panel',
            html:'<div><a id="login-show-user">'+'欢迎，'+username+'</a> [ <a style=" text-decoration: underline; font-size: 13px;" onclick="exitnn()">注销</a> ]</div>'
        }]
    },menuTree]
};