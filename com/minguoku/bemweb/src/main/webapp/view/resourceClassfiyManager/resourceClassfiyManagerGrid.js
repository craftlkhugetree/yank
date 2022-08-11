function jumpweb(value){
    // console.log(value.getAttribute('datavalue'))
    window.open(value.getAttribute('datavalue'))
}
var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    // split:true,
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '分类库名称', dataIndex: 'NAME',width:120},
        {header: '创建人', dataIndex: 'CREATERNAME',width:120},
        {header: '创建日期', dataIndex: 'CREATEDATE',width:120,
          renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }},
        {header: '最后修改人', dataIndex: 'MODIFIERNAME',width:120},
        {header: '最后修改日期', dataIndex: 'MODIFYDATE',width:140,
    	  renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }}
    ]),
    viewConfig:{
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({  
        pageSize:16,
        // height:50,   
        id:'CenterGrid-MainPT',
        cls:'ak-pager',
        store:CenterGridStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/16+1;
                var xx={"start":start,"limit":16,"page":page,"filter":gridfilter};
                param.data=JSON.stringify(xx);

            },
            render:function(){
               // akconfig.checkAuth(['100110'],userid);
            }
        }
    }),
    tbar:[{
        xtype:'button',
        text:'新增',
        iconCls: 'ak-icon icon-fly',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                    addWindow.show();
                    addWindow.setTitle('新增');
                    addForm.getForm().getEl().dom.reset();
                    eastTreeStoredata=JSON.stringify({'RESOURCEPACKAGEID':''})
                    eastTreeStore.load(Ext.getCmp('con-tree-org-combo').getRootNode(),function(){

                    });

                    Ext.getCmp('CREATER').setText('');
                    Ext.getCmp('CREATEDATE').setText('');
                    Ext.getCmp('MODIFIER').setText('');
                    Ext.getCmp('MODIFYDATE').setText('');
            }
        }
    },{
    	xtype:'button',
    	text:'编辑',
        iconCls: 'ak-icon icon-edit',
    	cls:'ak-btn btn-blue ak-auth',
        akfun:'edit',
        akfunID:'100112',
    	listeners:{
    		click:function(){
                if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=CenterGrid.getSelectionModel().getSelected();
                    
                    addWindow.show();
                    addWindow.setTitle('编辑');
                    addForm.getForm().getEl().dom.reset();
                    addForm.setValues(mianrecord.data);
                    eastTreeStoredata=JSON.stringify({'RESOURCEPACKAGEID':mianrecord.data.ID})
                    eastTreeStore.load(Ext.getCmp('con-tree-org-combo').getRootNode(),function(){

                    });

                    Ext.getCmp('CREATER').setText(mianrecord.data.CREATERNAME);
                    Ext.getCmp('CREATEDATE').setText(akDateChange.timechange(mianrecord.data.CREATEDATE)?akDateChange.timechange(mianrecord.data.CREATEDATE):'');
                    Ext.getCmp('MODIFIER').setText(mianrecord.data.MODIFIERNAME);
                    Ext.getCmp('MODIFYDATE').setText(akDateChange.timechange(mianrecord.data.MODIFYDATE)?akDateChange.timechange(mianrecord.data.MODIFYDATE):'');
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！')}
    		}
    	}
    },{
    	xtype:'button',
    	text:'删除',
        iconCls: 'ak-icon icon-fly',
    	cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
    	listeners:{
    		click:function(){
    			akCommFunction.deleterecord(CenterGrid,'CenterGrid-MainPT','ResourcePackage/delRES');
    		}
    	}
    },
    '->',new  Ext.form.TextField({
        id:'querykeyword',
        name:'KEYWORD',
        width:150
    }),new Ext.Button({
        text:"查询",
        cls:'ak-btn btn-green',
        iconCls:'ak-icon icon-search',
        listeners:{
            click:function(){
                gridfilter={"SEARCH":false,"KEYWORD":Ext.getCmp('querykeyword').getValue()};
                Ext.getCmp('CenterGrid-MainPT').doLoad(0);
            
            }
        }
    }),new Ext.Button({
        iconCls:'ak-icon icon-reset',
        cls:'ak-btn btn-green',       
        text:"重置",
        listeners:{
            click:function(){
                Ext.getCmp('querykeyword').setValue("");
                gridfilter={"SEARCH":false,"KEYWORD":''};
            
                Ext.getCmp('CenterGrid-MainPT').doLoad(0);
    
            }
        }
    })
    ],
    listeners:{
        beforerender:function(th){
            Ext.getCmp('CenterGrid-MainPT').doLoad(0);
            // th.getStore().load({
            //     params:{SEARCH:false,start:0,limit:16}
            // });
        }
    }
    

});
