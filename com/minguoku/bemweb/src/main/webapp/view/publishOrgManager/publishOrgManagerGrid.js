
var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    // split:true,
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '对应出版社', dataIndex: 'NAME',width:120},
        {header: '地址', dataIndex: 'ADDRESS',width:120,hidden:true},
        {header: '创建人', dataIndex: 'CREATER',width:120},
        {header: '创建日期', dataIndex: 'CREATEDATE',width:120,
          renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }},
        {header: '修改人', dataIndex: 'MODIFIER',width:120},
        {header: '修改日期', dataIndex: 'MODIFYDATE',width:140,
          renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }
        },
        {header: '状态代码', dataIndex: '',width:120},
        {header: '状态更新者', dataIndex: '',width:120}
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

            }
        }
    }),
    tbar:[{
    	xtype:'button',
    	text:'新增',
        iconCls:'ak-icon icon-add',
        akfun:'add',
        akfunID:'100111',
    	cls:'ak-btn btn-green ak-auth',
    	listeners:{
    		click:function(){
                addWindow.show();
                addWindow.setTitle('新增')
                addForm.getForm().getEl().dom.reset();
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
                    
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！')}
    		}
    	}
    },{
    	xtype:'button',
    	text:'删除',
        iconCls: 'ak-icon icon-del',
    	cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
    	listeners:{
    		click:function(){
    			akCommFunction.deleterecord(CenterGrid,'CenterGrid-MainPT','PublishOrg/deleteOrg');
    		}
    	}
    },
    {
        xtype:'button',
        text:'地址管理',
        iconCls: 'ak-icon icon-search',
        cls:'ak-btn btn-blue ak-auth',
        akfun:'edit',
        akfunID:'100112',
        listeners:{
            click:function(){
                if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=CenterGrid.getSelectionModel().getSelected();
                    publishid=mianrecord.data.ID;
                    addressListWindow.show();
                    addressForm.form.findField('PUBLISHNAME').setValue(mianrecord.data.NAME);

                    gridfilter={"SEARCH":false,"PUBLISHINGID":mianrecord.data.ID};
                    Ext.getCmp('addressMainPT').doLoad(0);
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！');}
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
           
        }
    }
    

});

var addressGrid=new Ext.grid.GridPanel({            //地址列表
    layout:'fit',
    // split:true,
    collapsible:false,
    store: addressStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}),
        {header: '地址', dataIndex: 'ADDRESS',width:120},
        {header: '设置时间', dataIndex: 'SETDATE',width:120,
          renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }},
        {header: '废止时间', dataIndex: 'ENDDATE',width:120,
          renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }}
    ]),
    viewConfig:{
        forceFit: true
    },
    height:331,
    bbar: new Ext.PagingToolbar({  
        pageSize:6,
        // height:50,   
        id:'addressMainPT',
        cls:'ak-pager',
        store:addressStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/6+1;
                var xx={"start":start,"limit":6,"page":page,"filter":gridfilter};
                param.data=JSON.stringify(xx);

            }
        }
    }),
    tbar:[{
        xtype:'button',
        text:'新增',
        iconCls:'ak-icon icon-add',
        akfun:'add',
        akfunID:'100111',
        cls:'ak-btn btn-green ak-auth',
        listeners:{
            click:function(){
                addressWindow.show();
                addressWindow.setTitle('新增');
                addAddressForm.getForm().getEl().dom.reset();
                addAddressForm.form.findField('PUBLISHINGID').setValue(publishid);
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
                if(addressGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=addressGrid.getSelectionModel().getSelected();
                  
                    addressWindow.show();
                    addressWindow.setTitle('编辑');
                    addAddressForm.getForm().getEl().dom.reset();
                    var setdate=mianrecord.data.SETDATE;
                    var enddate=mianrecord.data.ENDDATE;
                    mianrecord.data.SETDATE=akDateChange.timechangeymd(mianrecord.data.SETDATE);
                    mianrecord.data.ENDDATE=akDateChange.timechangeymd(mianrecord.data.ENDDATE);
                    addAddressForm.setValues(mianrecord.data);
                    mianrecord.data.SETDATE=setdate;
                    mianrecord.data.ENDDATE=enddate;
                    
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！')}
            }
        }
    },{
        xtype:'button',
        text:'删除',
        iconCls: 'ak-icon icon-del',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                akCommFunction.deleterecord(addressGrid,'addressMainPT','PublishOrg/delete');
            }
        }
    }]
});
