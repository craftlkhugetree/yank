
var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    // split:true,
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '客户名称', dataIndex: 'NAME',width:120},
        {header: '客户简称', dataIndex: 'NICKNAME',width:120},
        {header: '客户地址', dataIndex: 'ADDR',width:120},
        {header: '客户负责人', dataIndex: 'PRINCIPAL',width:120},
        {header:'客户负责人电话',dataIndex:'PRINCIPALMOBILE',width:130},
        {header:'客户负责人邮箱',dataIndex:'PRINCIPALEMAIL',width:120},
        {header: '客户负责人QQ', dataIndex: 'PRINCIPALQQ',width:140},
        {header: '客户联系人', dataIndex: 'CONTACT',width:140},
        {header: '客户联系人手机', dataIndex: 'CONTACTMOBILE',width:140},
        {header: '客户联系人邮箱', dataIndex: 'CONTACTEMAIL',width:140},
        {header: '客户联系人QQ', dataIndex: 'CONTACTQQ',width:140},
        {header: '开户行', dataIndex: 'OPENBANK',width:140},
        {header: '开户卡号', dataIndex: 'OPENNUM',width:140},
        {header: '税号', dataIndex: 'TAXNUM',width:140},
        {header: '电话', dataIndex: 'PHONE',width:140},
        {header: '传真', dataIndex: 'FAX',width:140},
        {header: '单位性质', dataIndex: 'UNITTYPE',width:140},
        {header: '是否有效', dataIndex: 'ISVALID',width:140,
           renderer:function(value){ 
               return value=='1'?'有效':(value=='0'?'无效':'');
           }
        }
    ]),
    // viewConfig: {
    //     forceFit: true
    // },
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
        iconCls: 'ak-icon icon-add',
        cls:'ak-btn btn-red ak-auth',
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
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！');}
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
    			 akCommFunction.deleterecord(CenterGrid,'CenterGrid-MainPT','Customer/delete');
    		}
    	}
    },
    {
        xtype:'button',
        text:'可用IP管理',
        iconCls: 'ak-icon icon-fly',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=CenterGrid.getSelectionModel().getSelected();
                    IPWindow.show();
                    gridfilter={'CTMID':mianrecord.data.ID};
                    Ext.getCmp('IPMainPT').doLoad(0);
                    custumerId=mianrecord.data.ID;
                    // ipGridStore.load({
                    //     params:{
                    //         data:JSON.stringify({"start":0,"limit":6,"page":1,"filter":{'CTMID':mianrecord.data.ID}})
                    //     }
                    // });
                }else{Ext.Msg.alert('提示！','请选择一条数据管理！');}
                         
            }
        }
    },
     {
        xtype:'button',
        text:'IP查询',
        iconCls: 'ak-icon icon-fly',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
               
                   IPSearchWindow.show();
                    gridfilter={};
                     Ext.getCmp('ipsearchkeyword').setValue("");
                   Ext.getCmp('IPMainSearchPT').doLoad(0);
            }
        }
    },
    {
        xtype:'button',
        text:'客户会员',
        iconCls: 'ak-icon icon-search',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                      var mianrecord=CenterGrid.getSelectionModel().getSelected();
                      addUserWindow.show();
                      userForm.getForm().getEl().dom.reset();
                     
                     Ext.getCmp('usertid').setValue(mianrecord.data.ID);
                     Ext.getCmp('username').setValue(mianrecord.data.NAME);
                      gridfilter={'TID':mianrecord.data.ID};
                      Ext.Ajax.request({
							url : '/authweb/rest/User/simpleList',
							params : "start=0&limit=10&filter=" + Ext.util.JSON.encode([{property:"TID","value":mianrecord.data.ID},{property:"USERTYPE","value":2}]),
							success : function(data) {
								var dt = Ext.util.JSON.decode(data.responseText);
								if(dt.success&&dt.total>0){
								 Ext.getCmp('loginname').setValue(dt.items[0].LOGINNAME);   
								}
							}
						});
                      //Ext.getCmp('downLoadMainPT').doLoad(0);
                }else{Ext.Msg.alert('提示！','请选择一条数据管理！');}
            }
        }
    },
     {
        xtype:'button',
        text:'下载记录查看',
        iconCls: 'ak-icon icon-search',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                //if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                      var mianrecord=CenterGrid.getSelectionModel().getSelected();
                      downLoadWindow.show();
                      gridfilter={'CTMID':mianrecord.data.ID};
                      Ext.getCmp('downLoadMainPT').doLoad(0);
                // }else{Ext.Msg.alert('提示！','请选择一条数据管理！');}
            }
        }
    },
    {
        xtype:'button',
        text:'客户订单管理',
        iconCls:'ak-icon icon-search',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                       var mianrecord=CenterGrid.getSelectionModel().getSelected();
                       custumerOrderWindow.show();
                       gridfilter={'CTMID':mianrecord.data.ID};
                       Ext.getCmp('custumerOrderMainPT').doLoad(0);
                       custumerId=mianrecord.data.ID;
                        resourceStore.load({
                            params:{
                                data:JSON.stringify({})
                            }
                        });
                }else{Ext.Msg.alert('提示！','请选择一条数据管理！');}
               
            }
        }
    },
    '->',new  Ext.form.TextField({
        id:'cumquerykeyword',
        name:'KEYWORD',
        width:150
    }),new Ext.Button({
        text:"查询",
        cls:'ak-btn btn-green',
        iconCls:'ak-icon icon-search',
        listeners:{
            click:function(){
                gridfilter={"KEYWORD":Ext.getCmp('cumquerykeyword').getValue()};
                Ext.getCmp('CenterGrid-MainPT').doLoad(0);
            	
            }
        }
    }),new Ext.Button({
        iconCls:'ak-icon icon-reset',
        cls:'ak-btn btn-green',       
        text:"重置",
        listeners:{

        click:function(){
            Ext.getCmp('cumquerykeyword').setValue("");
            gridfilter={"KEYWORD":''};
        
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
var IPSearchGrid = new Ext.grid.GridPanel({   //IP管理
    layout:'fit',
    collapsible:false,
    store: ipGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '客户名称', dataIndex: 'NAME',width:180},
        {header: '开始IP', dataIndex: 'BEGINIP',width:120},
        {header: '结束IP', dataIndex: 'ENDIP',width:120}
    ]),
    viewConfig:{
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({  
        pageSize:6,
        // height:50,   
        id:'IPMainSearchPT',
        cls:'ak-pager',
        store:ipGridStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/6+1;
                var xx={"start":start,"limit":6,"page":page,"filter":gridfilter};
                param.data=JSON.stringify(xx);

            },
            render:function(){
               // akconfig.checkAuth(['100110'],userid);
            }
        }
    }),
    tbar:[
    '->',new  Ext.form.TextField({
        id:'ipsearchkeyword',
        name:'KEYWORD',
        width:150
    }),new Ext.Button({
        text:"查询",
        cls:'ak-btn btn-green',
        iconCls:'ak-icon icon-search',
        listeners:{
            click:function(){
                gridfilter={"KEYWORD":Ext.getCmp('ipsearchkeyword').getValue()};
                Ext.getCmp('IPMainSearchPT').doLoad(0);
            
            }
        }
    }),new Ext.Button({
        iconCls:'ak-icon icon-reset',
        cls:'ak-btn btn-green',       
        text:"重置",
        listeners:{

         click:function(){
            Ext.getCmp('ipsearchkeyword').setValue("");
            Ext.getCmp('IPMainSearchPT').doLoad(0);
    
         }
        }
    })
    ],
    listeners:{
        beforerender:function(th){
            
            // th.getStore().load({
            //     params:{SEARCH:false,start:0,limit:16}
            // });
        }
    }
    

});

var IPGrid=new Ext.grid.GridPanel({   //IP管理
    layout:'fit',
    collapsible:false,
    store: ipGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '开始IP', dataIndex: 'BEGINIP',width:120},
        {header: '结束IP', dataIndex: 'ENDIP',width:140}
    ]),
    viewConfig:{
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({  
        pageSize:6,
        // height:50,   
        id:'IPMainPT',
        cls:'ak-pager',
        store:ipGridStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/6+1;
                var xx={"start":start,"limit":6,"page":page,"filter":gridfilter};
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
        iconCls:'ak-icon icon-add',
        akfun:'add',
        akfunID:'100111',
        cls:'ak-btn btn-green ak-auth',
        listeners:{
            click:function(){
                ipAddWindow.show();
                ipAddWindow.setTitle('新增');
                ipAddForm.getForm().getEl().dom.reset();
                ipAddForm.form.findField('CTMID').setValue(custumerId);
                //Ext.getCmp('look-up-field').hide();
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
                if(IPGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=IPGrid.getSelectionModel().getSelected();
                    
                    ipAddWindow.show();
                    ipAddWindow.setTitle('编辑');
                    ipAddForm.getForm().getEl().dom.reset();
                    ipAddForm.setValues(mianrecord.data);
                  
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！');}
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
                akCommFunction.deleterecord(IPGrid,'IPMainPT','Customer/deleteIP');
            }
        }
    },
    '->',new  Ext.form.TextField({
        id:'ipquerykeyword',
        name:'KEYWORD',
        width:150
    }),new Ext.Button({
        text:"查询",
        cls:'ak-btn btn-green',
        iconCls:'ak-icon icon-search',
        listeners:{
            click:function(){
                gridfilter={'CTMID':custumerId,"KEYWORD":Ext.getCmp('ipquerykeyword').getValue()};
                Ext.getCmp('IPMainPT').doLoad(0);
            
            }
        }
    }),new Ext.Button({
        iconCls:'ak-icon icon-reset',
        cls:'ak-btn btn-green',       
        text:"重置",
        listeners:{

         click:function(){
            Ext.getCmp('ipquerykeyword').setValue("");
            gridfilter={'CTMID':custumerId,"KEYWORD":''};
            Ext.getCmp('IPMainPT').doLoad(0);
    
         }
        }
    })
    ],
    listeners:{
        beforerender:function(th){
            
            // th.getStore().load({
            //     params:{SEARCH:false,start:0,limit:16}
            // });
        }
    }
    

});

var custumerOrderGrid=new Ext.grid.GridPanel({   //客户订单管理
    layout:'fit',
    collapsible:false,
    store: custumerOrderStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '对应订单号', dataIndex: 'ORDERNAME',width:120},
        {header: '有效期开始时间', dataIndex: 'BEGINDATE',width:100,
          renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }},
        {header: '有效期结束时间', dataIndex: 'ENDDATE',width:100,
          renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }},
        {header: '总金额(元)', dataIndex: 'ZJE',width:90},
        {header: '已付金额(元)', dataIndex: 'YF',width:90},
        {header: '余额(元)', dataIndex: 'YE',width:90},
        {header: '经手人', dataIndex: 'OPERATER',width:100},
        {header: '创办时间', dataIndex: 'OPERATETIME',width:120,
          renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }}
    ]),
    viewConfig:{
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({  
        pageSize:8,
        id:'custumerOrderMainPT',
        cls:'ak-pager',
        store:custumerOrderStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/8+1;
                var xx={"start":start,"limit":8,"page":page,"filter":gridfilter};
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
                custumerAddWindow.show();
                custumerAddWindow.setTitle('新增');
                custumerAddForm.getForm().getEl().dom.reset();
                custumerAddForm.form.findField('CTID').setValue(custumerId);
                
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
                if(custumerOrderGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=custumerOrderGrid.getSelectionModel().getSelected();
                    
                    custumerAddWindow.show();
                    custumerAddWindow.setTitle('编辑');
                    var startdate=mianrecord.data.BEGINDATE;
                    var enddate=mianrecord.data.ENDDATE;
                    mianrecord.data.BEGINDATE=akDateChange.timechangeymd(mianrecord.data.BEGINDATE);
                    mianrecord.data.ENDDATE=akDateChange.timechangeymd(mianrecord.data.ENDDATE);
                    custumerAddForm.getForm().getEl().dom.reset();
                    custumerAddForm.setValues(mianrecord.data);
                    mianrecord.data.BEGINDATE=startdate;
                    mianrecord.data.ENDDATE=enddate;
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！');}
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
                akCommFunction.deleterecord(custumerOrderGrid,'custumerOrderMainPT','Customer/deleteOrd');
                
            }
        }
    },
    {
        xtype:'button',
        text:'收款管理',
        iconCls: 'ak-icon icon-search',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                if(custumerOrderGrid.getSelectionModel().getSelected()!=undefined){
                     var mianrecord=custumerOrderGrid.getSelectionModel().getSelected();
                     receiveWindow.show();
                     orderId=mianrecord.data.ID;
                     receiveMoneyfilter={"ORDERID":mianrecord.data.ID};
                     Ext.getCmp('receiveMainPT').doLoad(0);

                }else{Ext.Msg.alert('提示！','请选择一条数据进行管理！');}
            }
        }
    },
    {
        xtype:'button',
        text:'添加试用订单',
        iconCls: 'ak-icon icon-add',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                custumerTryAddWindow.show();
                custumerTryAddForm.getForm().getEl().dom.reset();
                custumerTryAddForm.form.findField('CTID').setValue(custumerId);
            }
        }
    }
    ],
    listeners:{
        beforerender:function(th){
            
            // th.getStore().load({
            //     params:{SEARCH:false,start:0,limit:16}
            // });
        }
    }
    

});


var receiveGrid=new Ext.grid.GridPanel({   //收款管理
    layout:'fit',
    collapsible:false,
    store: receiveGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}),
       // {header: '对应订单', dataIndex: 'startip',width:120},
        {header: '收款金额(元)', dataIndex:'PAY',width:120},
        {header: '收款时间', dataIndex:'PAYDATE',width:140,
          renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }},
        {header: '发票号', dataIndex:'INVOICENUM',width:120},
        {header: '发票金额(元)', dataIndex:'INVOICEPAY',width:120}
    ]),
    viewConfig:{
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({  
        pageSize:9,
        // height:50,   
        id:'receiveMainPT',
        cls:'ak-pager',
        store:receiveGridStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/9+1;
                var xx={"start":start,"limit":9,"page":page,"filter":receiveMoneyfilter};
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
                receiveAddWindow.show();
                receiveAddWindow.setTitle('新增');
                receiveAddForm.getForm().getEl().dom.reset();
                receiveAddForm.form.findField('ORDERID').setValue(orderId);
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
                if(receiveGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=receiveGrid.getSelectionModel().getSelected();
    
                    receiveAddWindow.show();
                    receiveAddWindow.setTitle('编辑');
                    var paydate=mianrecord.data.PAYDATE;
                    mianrecord.data.PAYDATE=akDateChange.timechangeymd(mianrecord.data.PAYDATE);
                    receiveAddForm.getForm().getEl().dom.reset();
                    receiveAddForm.setValues(mianrecord.data);
                    mianrecord.data.PAYDATE=paydate;
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！');}
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
                //akCommFunction.deleterecord(receiveGrid,'receiveMainPT','Customer/deletePay');
                if(receiveGrid.getSelectionModel().getSelected()!=undefined){
                    Ext.MessageBox.confirm('提示', '真的要删除吗？', callBack); 
                    function callBack(id) { 
                    if(id=='yes'){
                        var deleterecord = receiveGrid.getSelectionModel().getSelected();
                        var bb={"ID":[deleterecord.data.ID]};
                        Ext.Ajax.request({
                            url:urls+'Customer/deletePay',// 要跳转的url,此为属性必须要有
                            method:'post',
                            params:{data:JSON.stringify(bb)}, // 提交参数
                            success: function(response, options){
                              if(errbyextjs(response)){
                                   receiveMoneyfilter={"ORDERID":orderId};
                                   Ext.getCmp('receiveMainPT').doLoad(0);

                                   gridfilter={'CTMID':custumerId};
                                   Ext.getCmp('custumerOrderMainPT').doLoad(0);
                                   
                              }
                            },
                            failure:function(response, options){
                                Ext.Msg.alert("提示",'网络出错了！')
                            }
                        })
                    }}
                }else{Ext.Msg.alert("提示",'请选择一条记录！')}
            }
        }
    }]
    

});

var downLoadGrid=new Ext.grid.GridPanel({   //下载记录查看
    layout:'fit',
    collapsible:false,
    store: downLoadGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([
        {header: '书名', dataIndex: 'TITLE',width:120},
        {header: '页码', dataIndex: 'PAGENUM',width:120},
        {header: '客户IP', dataIndex: 'USERIP',width:140}
    ]),
    viewConfig:{
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({  
        pageSize:16,
        // height:50,   
        id:'downLoadMainPT',
        cls:'ak-pager',
        store:downLoadGridStore,
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
    tbar:[
    '->',new  Ext.form.TextField({
        id:'downLoadkeyword',
        name:'KEYWORD',
        width:150
    }),new Ext.Button({
        text:"查询",
        cls:'ak-btn btn-green',
        iconCls:'ak-icon icon-search',
        listeners:{
            click:function(){
            	var mianrecord=CenterGrid.getSelectionModel().getSelected();
                gridfilter={"KEYWORD":Ext.getCmp('downLoadkeyword').getValue(),"CTMID":mianrecord.data.ID};
                Ext.getCmp('downLoadMainPT').doLoad(0);
            
            }
        }
    }),new Ext.Button({
        iconCls:'ak-icon icon-reset',
        cls:'ak-btn btn-green',       
        text:"重置",
        listeners:{

        click:function(){
            Ext.getCmp('downLoadkeyword').setValue("");
            gridfilter={"KEYWORD":''};
            Ext.getCmp('downLoadMainPT').doLoad(0);
    
            }
        }
    })],
    listeners:{
        beforerender:function(th){
            
            // th.getStore().load({
            //     params:{SEARCH:false,start:0,limit:16}
            // });
        }
    }
    

});
