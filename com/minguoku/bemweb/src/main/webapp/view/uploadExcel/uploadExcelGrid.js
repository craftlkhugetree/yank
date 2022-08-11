
var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '扫描编号', dataIndex: 'CODE',width:120,sortable:true},
		{header: '中图法分类号', dataIndex: 'ZTTYPEID',width:120,sortable:true},
        {header: '主题词串', dataIndex: 'ZTCC',width:140,sortable:true},
        {header: '正题名', dataIndex: 'TITLE',width:140,sortable:true},
        {header: '并列正题名', dataIndex: 'BLTITLE',width:140,sortable:true},
        {header: '其他题名说明', dataIndex: 'OTITLE',width:140,sortable:true},
        {header: '分辑题名', dataIndex: 'FTITLE',width:140,sortable:true},
        {header: '主要责任者', dataIndex: 'ZAUTHOR',width:140,sortable:true},
        {header: '次要责任者', dataIndex: 'CAUTHOR',width:140,sortable:true},
        {header: '版本项', dataIndex: 'BB',width:140,sortable:true},
        {header: '出版发行地', dataIndex: 'PAID',width:140,sortable:true},
        {header: '出版发行者', dataIndex: 'PUBLISHINGID',width:140,sortable:true},
        {header: '出版发行时间', dataIndex: 'DATE',width:140,sortable:true},
        {header: '稽核项', dataIndex: 'JHX',width:140,sortable:true},
		{header: '页数', dataIndex: 'PAGECOUNT',width:100,sortable:true},
        {header: '丛编题名', dataIndex: 'SERIES',width:140,sortable:true},
        {header: '一般性附注', dataIndex: 'CONTENTNOTE',width:140,sortable:true},
        {header: '封面题名', dataIndex: 'COVERTITLE',width:140,sortable:true},
        {header: '学科分类', dataIndex: 'XKMCZT',width:140,sortable:true},
        {header: '主要责任者（个人）', dataIndex: 'ZAUTHOR1',width:140,sortable:true},
        {header: '次要责任者（个人）', dataIndex: 'CAUTHOR1',width:140,sortable:true},
        {header: '主要责任者（团体）', dataIndex: 'ZAUTHOR2',width:140,sortable:true},
        {header: '次要责任者（团体）', dataIndex: 'CAUTHOR2',width:140,sortable:true}
    ]),
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
    	text:'上传',
        iconCls:'ak-icon icon-add',
        akfun:'add',
        akfunID:'100111',
        // id:'sxssss',
    	cls:'ak-btn btn-green ak-auth',
    	listeners:{
    		click:function(){
                uploadWindow.show();
                uploadWindow.setTitle('上传文件');
                uploadForm.getForm().getEl().dom.reset();
    		}
    	}
    },{
        xtype:'button',
        text:'新增',
        iconCls: 'ak-icon icon-add',
        cls:'ak-btn btn-green ak-auth',
        akfun:'add',
        akfunID:'100113',
        listeners:{
            click:function(){
                
				addWindow.show();
				addWindow.setTitle('新增');
				addForm.getForm().getEl().dom.reset();
                 
            }
        }
    },{
        xtype:'button',
        text:'编辑',
        iconCls: 'ak-icon icon-edit',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=CenterGrid.getSelectionModel().getSelected();
                    addWindow.show();
                    addWindow.setTitle('编辑');
                    addForm.getForm().getEl().dom.reset();
                    addForm.setValues(mianrecord.data);
					Ext.getCmp('ZTTYPEID').setValue(mianrecord.data.ZTTYPEID);
					Ext.getCmp('EDUTYPEID').setValue(mianrecord.data.EDUTYPEID);
                }else{Ext.Msg.alert('提示！','请选择一条数据！')}
            }
        }
    },
	 {
		xtype:'button',
		text:'删除',
		 iconCls:'ak-icon icon-del',
		 akfun:'delete',
		 akfunID:'100111',
		cls:'ak-btn btn-green ak-auth',
		listeners:{
			click:function(){
				 if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                        Ext.MessageBox.confirm('提示', '确认要删除这条数据吗？', callBack); 
                        function callBack(id) { 
                                if(id=='yes'){
                                    var deleterecord = CenterGrid.getSelectionModel().getSelected();
                                    var bb={"IDs":[deleterecord.data.BOOKID]};
                                  
                                    Ext.Ajax.request({
                                        url:urls+'Book/delBookCnmarc',// 要跳转的url,此为属性必须要有
                                        method:'post',
                                        params:{data:JSON.stringify(bb)}, // 提交参数
                                        success: function(response, options){
                                          if(errbyextjs(response)){
                                            Ext.getCmp('CenterGrid-MainPT').doLoad(0);
                                          }
                                        },
                                        failure:function(response, options){
                                            Ext.Msg.alert("提示",'网络出错了！');
                                        }
                                    })
                                }
                        }
                    }else{Ext.Msg.alert("提示",'请选择一条记录！');}
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
