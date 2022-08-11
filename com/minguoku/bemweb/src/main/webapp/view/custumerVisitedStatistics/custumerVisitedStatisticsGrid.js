
var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    // split:true,
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '用户名', dataIndex: 'NAME',width:120},
        {header: '访问量', dataIndex: 'NAME',width:120},
        {header: '联系方式', dataIndex: 'NAME',width:120},
        {header: '注册时间', dataIndex: 'NAME',width:120},
        {header: '生效时间', dataIndex: 'NAME',width:120},
        {header: '截止时间', dataIndex: 'NAME',width:120},
        {header: '已付款', dataIndex: 'NAME',width:120},
        {header: '账户余额', dataIndex: 'NAME',width:120},
        {header: '使用时间', dataIndex: 'LASTTIME',width:140,
    	renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }}
    ]),
    height:document.documentElement.clientHeight-350,
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
                var xx={"start":start,"limit":16,"page":page};
                param.data=JSON.stringify(xx);

                CenterGridStore.on('load',function(){
                    var rt=CenterGrid.getSelectionModel().getSelected();
                    if(rt!=undefined){
                        if(rt.data.ISUSE=='1'){
                             Ext.getCmp('stopUse').setText('禁用');
                        }else{
                             Ext.getCmp('stopUse').setText('启用');
                        }
                    }
                });
            },
            render:function(){
               // akconfig.checkAuth(['100110'],userid);
            }
        }
    }),
    listeners:{
        beforerender:function(th){
            
            // th.getStore().load({
            //     params:{SEARCH:false,start:0,limit:16}
            // });
        }
    }
    

});


var custumerVisitedEchart= new Ext.Panel({    //客户访问统计
    // layout:'fit',
    collapsible:false,
    //title:'客户单位访问统计',
    items:[{
        xtype:'akechartBarorLIne',//折线和柱状图
        chartUrl:'123',//接口
        chartTitle:'客户单位访问统计',
        chartType:'bar',
        paths:'../../extjs/ux/dist',
        trigger:'axis',//触发类型 item axis
        echartStyle:'height:300px;', //height必须配
        echartmarkPoint:{data :[{type : 'max', name: '最大值'},{type : 'min', name: '最小值'}]}//,//选填
        //echartmarkLine:{data : [{type : 'average', name: '平均值'}]}//选填
    }]
    
    

});


