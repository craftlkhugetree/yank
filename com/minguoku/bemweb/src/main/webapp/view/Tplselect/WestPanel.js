var facility= new Ext.grid.GridPanel({
	layout:'fit',
    // split:true,
	title:'资料来源',
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '分类名称', width: 150, dataIndex: 'NAME'},
        {header: '描述', width: 150, dataIndex: 'DES'},
        {header: '最后修改时间', width: 150, dataIndex: 'LASTTIME',
    	renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }}
    ]),
    bbar: new Ext.PagingToolbar({  
        pageSize:10,
        id:'CenterGrid-MainPT',
        cls:'ak-pager',
        store:CenterGridStore,
        beforePageText : "第",
        listeners:{
          beforechange:function(a,param){
            param.filter=JSON.stringify(filter);
          }
        }
        
    }),
    tbar:['->',{
    	xtype:'button',
    	text:'保存',
    	cls:'ak-btn btn-blue',
    	listeners:{
    		click:function(){
                if(SITESID){
                    addWindow.show();
                    addWindow.setTitle('新增')
                    addForm.getForm().getEl().dom.reset();
                    Ext.getCmp('Classify-WEBSITEID-text').setValue(SITESID);
                }else{
                    Ext.Msg.alert('提示！','请先选择网站！')
                }
                
    		}
    	}
    },{
    	xtype:'button',
    	text:'预览',
    	cls:'ak-btn btn-red',
    	listeners:{
    		click:function(){
    			akCommFunction.deleterecord(CenterGrid,'CenterGrid-MainPT','Classify/delete');
    		}
    	}
    

    }]
    

});

//var facility=new Ext.tree.TreePanel({
//    loader: eastTreeStore,
//    title:'资料来源',
//    // region:'center',
//    split:true,
//    layout:'fit',
//    collapsible:false,
//    id:'con-tree-org-combo',
//    autoScroll: true,
//    animate: false,
//    enableDD: true,
//    containerScroll: true,
//    rootVisible: false,
//    // width:230,
//    border:false,
//    height:'100%',
//    tbar:['->',new Ext.Button({
//        text:'保存',
//        cls:'ak-btn btn-blue',
//        listeners:{
//            click:function(th){  
//                addColumnWindow.show();
//                addColumnWindow.setTitle('新增');
//                addForm.getForm().getEl().dom.reset();  
//            }
//        }
//    }),new Ext.Button({
//        text:'预览',
//        cls:'ak-btn btn-blue',
//        listeners:{
//            click:function(th){  
//                addColumnWindow.show();
//                addColumnWindow.setTitle('新增');
//                addForm.getForm().getEl().dom.reset();  
//            }
//        }
//    })]
//})


