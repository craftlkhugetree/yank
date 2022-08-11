var batchGrid = new Ext.grid.GridPanel({        // 批次列表
    layout: 'fit',
    title:'批次号',
    store: batchGridStore,
    sm: new Ext.grid.CheckboxSelectionModel({
        singleSelect: true
    }),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        }),{
            header: '批次号',
            width: 100,
            dataIndex: 'BATID'
        },{
            header: '制作公司',
            width: 130,
            dataIndex: 'MAKER'
        }
        // ,{
        //     header: '起始流水号',
        //     width: 80,
        //     dataIndex: 'BEGINID'
        // },{
        //     header: '终止流水号',
        //     width: 80,
        //     dataIndex: 'ENDID'
        // }
    ]),
    viewConfig: {
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({
        pageSize: 16,
        id: 'batchid',
        cls: 'ak-pager',
        store: batchGridStore,
        beforePageText: "第",
        listeners: {
            beforechange: function(a, param) {
                var start=param.start;
                var page=param.start/16+1;
                var xx={"start":start,"limit":16,"page":page};
                param.data=JSON.stringify(xx);
            }
        }

    }),
    tbar: [{
        text: '增加',
        xtype: 'button',
        iconCls: 'x-btn-text ak-icon icon-add',
        cls: 'ak-btn btn-orange ak-auth',
        listeners: {
            click: function() {
         
                batchAddWindow.show();
                batchAddWindow.setTitle('批次新增');
                batchAddForm.getForm().getEl().dom.reset();

            }
        }
    },
     {
        text: '删除',
        xtype: 'button',
        iconCls: 'ak-icon icon-del',
        cls: 'ak-btn btn-red ak-auth',
        listeners: {
            click: function() {
                                  
                    //akCommFunction.deleterecord(batchGrid,'batchid','Book/delMakeID');
                    if(batchGrid.getSelectionModel().getSelected()!=undefined){
                        Ext.MessageBox.confirm('提示', '真的要删除吗？', callBack); 
                        function callBack(id) { 
                                if(id=='yes'){
                                    var deleterecord = batchGrid.getSelectionModel().getSelected();
                                    var bb={"ID":[deleterecord.data.ID]};
                                  
                                    Ext.Ajax.request({
                                        url:urls+'Book/delMakeID',// 要跳转的url,此为属性必须要有
                                        method:'post',
                                        params:{data:JSON.stringify(bb)}, // 提交参数
                                        success: function(response, options){
                                          if(errbyextjs(response)){
                                              Ext.getCmp('batchid').doLoad(0);

                                              CenterGridStore.removeAll();
                                              batchFilter='';
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
     {
        text: '查看',
        xtype: 'button',
        iconCls: 'x-btn-text ak-icon icon-edit',
        cls: 'ak-btn btn-blue ak-auth',
        listeners: {
            click: function() {
                if (batchGrid.getSelectionModel().getSelected() != undefined) {
                    var mianrecord = batchGrid.getSelectionModel().getSelected();
                    batchLookWindow.show();
                    batchLookWindow.setTitle('批次查看');
                    batchLookForm.getForm().getEl().dom.reset();
                    batchLookForm.setValues(mianrecord.data);


                } else {
                    Ext.Msg.alert('提示！', '请选择一条数据！');
                }

            }
        }
    }],
    listeners:{
        beforerender:function(){
            Ext.getCmp('batchid').doLoad(0);
        },
        rowclick:function(){
             var mianrecord = batchGrid.getSelectionModel().getSelected();
            
             if(mianrecord!=undefined){
                   batchFilter={"BATID":mianrecord.data.ID};
                   Ext.getCmp('CenterGrid-MainPT').doLoad(0);
             }else{
                   CenterGridStore.removeAll();
                   batchFilter='';
             }
             
        }
    }

});



var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    title:'图书列表',
    // split:true,
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '题名', dataIndex: 'TITLE',width:120,sortable:true},
		{header: '内容对应扫描目录', dataIndex: 'BOOKDIR',width:210,sortable:true},
        {header: '责任人', dataIndex: 'AUTHOR',width:110,sortable:true},
        {header: '出版地', dataIndex: 'ADDRESS',width:100,sortable:true},
        {header: '出版社', dataIndex: 'PUBLISHINGNAME',width:120,sortable:true},
        {header:'出版年',dataIndex:'DATE',width:100,sortable:true},
        {header:'稽核项',dataIndex:'JHX',width:120,sortable:true},
		{header:'页数',dataIndex:'PAGECOUNT',width:100,sortable:true},
        {header: '主题词', dataIndex: 'TAGS',width:140,sortable:true},
        {header: '中图法分类', dataIndex: 'ZTNAME',width:140,sortable:true},
        {header: '附注说明', dataIndex: 'CONTENTNOTE',width:120,sortable:true},
        {header: '丛书名', dataIndex: 'SERIES',width:140,sortable:true},
        {header:'对应学科',dataIndex:'EDUNAME',width:120,sortable:true}
    ]),
    // viewConfig: {
    //     forceFit: true
    // },
    bbar: new Ext.PagingToolbar({  
        pageSize:20,
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
                var page=param.start/20+1;
                var xx={"start":start,"limit":20,"page":page,"filter":batchFilter};
                param.data=JSON.stringify(xx);

            }
        }
    }),
    tbar:[
    // {
        // xtype:'button',
        // text:'新增',
        // iconCls: 'ak-icon icon-edit',
        // cls:'ak-btn btn-blue ak-auth',
        // akfun:'edit',
        // akfunID:'100112',
        // listeners:{
            // click:function(){
                // if(batchFilter){
                    // addWindow.show();
                    // addWindow.setTitle('新增');
                    // addForm.getForm().getEl().dom.reset();
                // }else{
                    // Ext.Msg.alert('提示！','请先选择一条批次号数据');
                // }
                    
            // }
        // }
    // },
	// {
    // 	xtype:'button',
    // 	text:'删除',
    //     iconCls: 'ak-icon icon-del',
    // 	cls:'ak-btn btn-red ak-auth',
    //     akfun:'delete',
    //     akfunID:'100113',
    // 	listeners:{
    // 		click:function(){
    // 			akCommFunction.deleterecord(CenterGrid,'CenterGrid-MainPT','Book/delBook');
                    
    // 		}
    // 	}
    // },
    {
        xtype:'button',
        text:'查看',
        iconCls: 'ak-icon icon-edit',
        cls:'ak-btn btn-blue ak-auth',
        akfun:'edit',
        akfunID:'100112',
        listeners:{
            click:function(){
                if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=CenterGrid.getSelectionModel().getSelected();
                    
                    lookWindow.show();
                    lookWindow.setTitle('查看');
                    lookForm.getForm().getEl().dom.reset();
                    lookForm.setValues(mianrecord.data);
                }else{Ext.Msg.alert('提示！','请选择一条数据！')}
            }
        }
    },
    {
        xtype:'button',
        text:'导出CN MARC',
        iconCls: 'ak-icon icon-fly',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                window.open(urls+'Book/ExportCNMARC');

            }
        }
    },
    // {
        // xtype:'button',
        // text:'编辑',
        // iconCls: 'ak-icon icon-edit',
        // cls:'ak-btn btn-red ak-auth',
        // akfun:'delete',
        // akfunID:'100113',
        // listeners:{
            // click:function(){
                // if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                    // var mianrecord=CenterGrid.getSelectionModel().getSelected();
                    // addWindow.show();
                    // addWindow.setTitle('编辑');
                    // addForm.getForm().getEl().dom.reset();
                    // addForm.setValues(mianrecord.data);
					// Ext.getCmp('ZTTYPEID').setValue(mianrecord.data.ZTCODE);
					// Ext.getCmp('EDUTYPEID').setValue(mianrecord.data.EDUCODE);
                // }else{Ext.Msg.alert('提示！','请选择一条数据！')}
            // }
        // }
    // },
    {
        xtype:'button',
        text:'馆藏管理',
        iconCls: 'ak-icon icon-search',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                      var mianrecord=CenterGrid.getSelectionModel().getSelected();
                      collectionWindow.show();
                      librayManagerFilter={"BOOKID":mianrecord.data.ID};
                      Ext.getCmp('collectionMainPT').doLoad(0);

                }else{Ext.Msg.alert('提示！','请选择一条数据！');}
            }
        }
    }//,'->',
    // {
    //     xtype:'textfield',
    //     width:80
    // },new Ext.Button({
    //     text:"查询",
    //     cls:'ak-btn btn-green',
    //     iconCls:'ak-icon icon-search',
    //     listeners:{
    //         click:function(){
    //             rolegridfilter={"SEARCH":false,"NAME":Ext.getCmp('rolequerykeyword').getValue()};
    //             Ext.getCmp('roleMainPT').doLoad(0);
            
    //         }
    //     }
    // }),new Ext.Button({
    //     iconCls:'ak-icon icon-reset',
    //     cls:'ak-btn btn-green',       
    //     text:"重置",
    //     listeners:{

    //     click:function(){
    //         Ext.getCmp('rolequerykeyword').setValue("");
    //         rolegridfilter={"SEARCH":false,"KEYWORD":''};
        
    //         Ext.getCmp('roleMainPT').doLoad(0);
    
    //         }
    //     }
    // })

    // {
    //     xtype:'label',
    //     html:'出版社： '
    // },{
    //     xtype:'combo',
    //     width:80
    // },'&nbsp;&nbsp;&nbsp;',{
    //     xtype:'label',
    //     html:'中图法分类： '
    // },{
    //     xtype:'combo',
    //     width:50
    // }
    // ,'&nbsp;&nbsp;&nbsp;',new  Ext.form.TextField({
    //     id:'rolequerykeyword',
    //     name:'KEYWORD',
    //     width:80
    // }),new Ext.Button({
    //     text:"查询",
    //     cls:'ak-btn btn-green',
    //     iconCls:'ak-icon icon-search',
    //     listeners:{
    //         click:function(){
    //             rolegridfilter={"SEARCH":false,"NAME":Ext.getCmp('rolequerykeyword').getValue()};
    //             Ext.getCmp('roleMainPT').doLoad(0);
            
    //         }
    //     }
    // }),new Ext.Button({
    //     iconCls:'ak-icon icon-reset',
    //     cls:'ak-btn btn-green',       
    //     text:"重置",
    //     listeners:{

    //     click:function(){
    //         Ext.getCmp('rolequerykeyword').setValue("");
    //         rolegridfilter={"SEARCH":false,"KEYWORD":''};
        
    //         Ext.getCmp('roleMainPT').doLoad(0);
    
    //         }
    //     }
    // })
    ],
    listeners:{
        beforerender:function(th){
            
            // th.getStore().load({
            //     params:{SEARCH:false,start:0,limit:16}
            // });
        }
    }
    

});

var collectionGrid=new Ext.grid.GridPanel({   //馆藏管理
    layout:'fit',
    // split:true,
    collapsible:false,
    store: collectionGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '图书馆名', dataIndex: 'NAME',width:120},
        {header: 'OPAC', dataIndex: 'OPAC',width:140}
    ]),
    viewConfig:{
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({  
        pageSize:7,
        // height:50,   
        id:'collectionMainPT',
        cls:'ak-pager',
        store:collectionGridStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/7+1;
                var xx={"start":start,"limit":7,"page":page,"filter":librayManagerFilter};
                param.data=JSON.stringify(xx);

            }
        }
    }),
    tbar:[
    '->',new  Ext.form.TextField({
        id:'rolequerykeyword',
        name:'KEYWORD',
        width:150
    }),new Ext.Button({
        text:"查询",
        cls:'ak-btn btn-green',
        iconCls:'ak-icon icon-search',
        listeners:{
            click:function(){
                var mainrecord=CenterGrid.getSelectionModel().getSelected();
                librayManagerFilter={"KEYWORD":Ext.getCmp('rolequerykeyword').getValue(),"BOOKID":mainrecord.data.ID};
                Ext.getCmp('collectionMainPT').doLoad(0);
            
            }
        }
    }),new Ext.Button({
        iconCls:'ak-icon icon-reset',
        cls:'ak-btn btn-green',       
        text:"重置",
        listeners:{

            click:function(){
                var mainrecord=CenterGrid.getSelectionModel().getSelected();
                Ext.getCmp('rolequerykeyword').setValue('');
                librayManagerFilter={"KEYWORD":'',"BOOKID":mainrecord.data.ID};
                Ext.getCmp('collectionMainPT').doLoad(0);
        
            }
        }
    })
    ]
    

});

